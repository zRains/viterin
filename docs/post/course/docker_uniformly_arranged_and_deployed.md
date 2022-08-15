---
date: 1650466212678
title: 'Docker容器统一编排部署'
scope: ['Docker']
buckets: ['post', 'course']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

![cover_docker_uniformly_arranged_and_deployed](https://res.zrain.fun/images/2022/06/cover_docker_uniformly_arranged_and_deployed-4d4321d385b06fc7d7a3bcd14fd684b6.png)

本次工程实践课题为 Docker 容器统一编排部署。借此机会了解一下容器编排技术。

## 课题方向

容器虚拟化技术应用，解决当前云原生开发、微服务开发到统一微服务编排（容器编排）问题解决，巩固所学的开发技术、云技术、容器技术等知识。

## 内容要求

1. 了解 Docker 容器主流的编排技术。

2. 掌握 Docker Swarm 的部署和基本使用。

3. 掌握 Docker Compose 的部署和基本使用（选读内容）。

4. 掌握 Docker 的图形化管理工具 Portainer 或其他工具。

5. 部署一个 httpd 服务作为应用验证编排服务或其他 K8s 等管理的统一编排技术。

## 准备

下面是我的配置：

1. VMware Workstation 17 Pro。

2. [Centos 7.9.2009](http://mirrors.aliyun.com/centos/7.9.2009/os/x86_64/images/boot.iso)，阿里云镜像。

3. Docker version 20.10.14, build a224086。

4. chrony version 3.4。

5. FinalShell（可选）。

## 配置虚拟机

### 前置安装

这里需要注意的几个点：

1. 在“INSTALLATION SOURCE”设置软件包国内源时会发现 On the network 无法编辑，其原因是网络没有设置 🤣。将“NETWORK & HOST NAME”中的网络打开就可以了。

![centos7设置阿里源](https://res.zrain.fun/images/2022/04/centos7%E8%AE%BE%E7%BD%AE%E9%98%BF%E9%87%8C%E6%BA%90-3d3ec0bae87d95834c45949d78305669.png)

2. 在设置“NETWORK & HOST NAME”时将 Host name 改为下面内容，以表明这是一个 Swarm 主机。

```text
master.localdomain
```

在“SOFTWARE SELECTION”中选择 Minimal install（最小化安装），是勇士直接安排。

### 安装工具

安装一下必要的工具：

```bash
# 安装vim
yum install -y vim

# 安装net-tools
yum install -y net-tools

# 安装chrony
yum install -y chrony
# 检查chrony是否安装成功并正在运行
systemctl status chronyd
```

### 关闭防火墙

防火墙会阻止 node_1 节点与 master 节点之间的时间同步，为了不影响后续操作，将防火墙关闭：

```bash
# 查看防火墙状态，如果为 running 则为开启状态
firewall-cmd --state

# 关闭防火墙
systemctl stop firewalld
```

### 安装 Docker

此部分参照 [Docker Docs](https://docs.docker.com/engine/install/centos/)。

```bash
# 移除之前的 Docker（这部分其实是没必要的，因为我选择的最小化安装）
yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
yum install -y yum-utils
# 添加 Docker 仓库
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 安装 Docker 引擎
yum install docker-ce docker-ce-cli containerd.io
# 检查 Docker 是否安装成功
docker -v
```

到这里就可以准备一下克隆和快照：克隆出 Node_1 节点并各自保存快照。在此列出我的克隆情况：

📀 master：192.168.30.130 2H/2G

💿 node_1：192.168.30.131 2H/2G

## 配置 chrony

chrony 是一个开源自由的网络时间协议 NTP 的客户端和服务器软软件。它能让计算机保持系统时钟与时钟服务器（NTP）同步，因此让你的计算机保持精确的时间，Chrony 也可以作为服务端软件为其他计算机提供时间同步服务。我们既然要做容器编排管理，那就最好保证每个节点的时间保持同步。

如果要让我们的 chrony 服务端能为互联网的所有计算机提供时间同步服务，需要将这个 chrony 服务端运行在公网服务器上，通常选用云服务器。但由于是演示作用，就将这个服务部署在 master 节点上，这样就能保证所有节点时间同步了。

先看看 node_1 节点的默认时间同步源：

```bash
chronyc sources -v

210 Number of sources = 4

  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
 / .- Source state '*' = current synced, '+' = combined , '-' = not combined,
| /   '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
||                                                 .- xxxx [ yyyy ] +/- zzzz
||      Reachability register (octal) -.           |  xxxx = adjusted offset,
||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
||                                \     |          |  zzzz = estimated error.
||                                 |    |           \
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^- time.cloudflare.com           3  10   376   41m  +2928us[+3951us] +/-  122ms
^- 79.133.44.136                 1  10   355   41m    -20ms[  -19ms] +/-  147ms
^* 119.28.206.193                2  10   335   38m  +3959us[+4997us] +/-   50ms
^- ntp1.ams1.nl.leaseweb.net     2  10   371   52m  +2043us[+3018us] +/-  185ms

```

不得不说这个提示挺友好的，直接用字符画说明了每个值的含义。其中重点注意`^*`开头的，表示的是当前与之同步的时钟服务器。接下来开始修改 master 和 node_1 各自的 chrony.conf：

```bash
vim /etc/chrony.conf
```

这里主要关注一下几个参数：

- server：用于指定外部时间同步服务器源地址，可以添加任意多个源地址。

- pool：用于指定外部时间同步服务器池。

- allow：允许特定 IP 的客户端计算机向本 chrony 服务器发送时间同步请求，如果设置成 allow all 表示允许所有网段的客户端计算机发送请求过来。

- local stratum：允许在外部时间同步服务器不可用时，使用服务器本地时间作为返回值返回给发起请求的客户端计算机。

```txt
# 下面是 master 的配置
# 既然是测试用就设置 master（也就是本机）为时间同步服务器。
server master iburst

# 这里设置 local stratum 10，允许在外部时间同步服务器不可用时，使用服务器本地时间作为返回值返回给发起请求的客户端计算机。
local stratum 10

# 为了方便测试，这里 allow 配置成 allow all，也就是允许所有网段的客户端发送请求过来。
allow all

# 下面是原本就有的设置
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
logdir /var/log/chrony



# 下面是 node_1 的配置
# 将 NTP 同步服务器设置为 master
server 192.168.30.130 minpoll 4 maxpoll 10 iburst

# 下面是原本就有的设置
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
logdir /var/log/chrony
```

保存后重启 chrony 服务，同时设置开机自启动：

```bash
systemctl enable chronyd && systemctl restart chronyd
```

接下来在 node_1 中验证同步是否已开启：

```bash
chronyc sources
```

如果 master（192.168.30.130）前面出现`^*`表明同步已建立连接：

![chrony同步状态结果](https://res.zrain.fun/images/2022/04/image-20220421163154910-ee78989fd7cec7b2b433e7cf514eda0d.png)

然后就是 chrony 客户端上的一些常用命令：

```bash
# 查看可用的时间同步源
chronyc sources -v

# 查看时间同步源的状态
chronyc sourcestats -v

# 对客户端系统时间进行强制同步
chronyc -a makestep
```

## 配置 Docker API

Docker 可以监听并处理 3 种 socket 形式的 API 请求，分别是：

- unix（unix 域协议）。

- tcp（tcp 协议）。

- fd。

一般来说，在安装好 docker 后，默认就已经开启了 unix socket，并且我们在执行需要有 root 权限或者 docker 用户组成员才有权限访问。例如查看本机 Docker 详细信息：

```bash
curl --unix-socket /var/run/docker.sock  http://docker/version
```

### 添加远程 API 访问接口

编辑 docker 守护进程的配置文件，给 dockerd 命令加参数-H tcp://0.0.0.0:2375，意思是在 2375 端口开放 API 访问。

```bash
vim /lib/systemd/system/docker.service

# 将
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
# 改为
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375  --containerd=/run/containerd/containerd.sock
```

然后运行下面的命令，重新加载一下：

```bash
# 重新加载守护进程配置
systemctl daemon-reload

# 重启 Docker 服务
systemctl restart docker.service
```

通过 `netstat -tlunp` 命令可以看到 Docker API 已在 2375 端口上监听：

![docker开启远程访问接口](https://res.zrain.fun/images/2022/04/docker%E5%BC%80%E5%90%AF%E8%BF%9C%E7%A8%8B%E8%AE%BF%E9%97%AE%E6%8E%A5%E5%8F%A3-23992f572a492ee8de28995ff0a0119a.png)

## 初始化 Swarm 集群

在 master 节点创建 Swarm 集群：

```bash
docker swarm init --advertise-addr 192.168.30.130
```

初始化命令中“--advertise-addr”选项表示管理节点公布它的 IP 是多少。其它节点必须能通过这个 IP 找到管理节点。创建成功结果如下：

```text
Swarm initialized: current node (server id) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token TOKEN 192.168.30.130:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

> 如果初始化时没有记录下 `docker swarm init` 提示的添加 worker 的完整命令，可以通过 `docker swarm join-token worker` 命令查看。

反馈内容很清楚了，在 node_1 子节点内运行（每次 Token 都不一样！）：

```bash
docker swarm join --token TOKEN 192.168.30.130:2377
```

我们在 master 节点中通过 `docker node ls` 查看子节点是否加入成功：

![node成功加入了master](https://res.zrain.fun/images/2022/04/node%E6%88%90%E5%8A%9F%E5%8A%A0%E5%85%A5%E4%BA%86master-d58a23178d7c8004316c73dcc6ec44a0.png)

## 安装 Portainer

Portainer 是 Docker 的图形化管理工具，提供状态显示面板、应用模板快速部署、容器镜像网络数据卷的基本操作（包括上传和下载镜像、创建容器等操作）、事件日志显示、容器控制台操作、Swarm 集群和服务等集中管理和操作、登录用户管理和控制等功能。功能十分全面，基本能满足中小型企业对容器管理的全部需求。

我们在 master 节点内搜索 Portainer 镜像：

```bash
docker search portainer
```

结果如下：

![docker搜索Portainer镜像](https://res.zrain.fun/images/2022/04/docker%E6%90%9C%E7%B4%A2Portainer%E9%95%9C%E5%83%8F-b0125435373f0fcf26e4e51383c92af4.png)

网上大多数教程都是拉取的 `portainer/portainer` 这个镜像，但我看后面描述写着已被废弃，于是选择了第二个 `portainer/portainer-ce`，也就是社区版本：

```bash
# 拉取 portainer/portainer-ce 最新镜像并启动容器
docker run -d -p 9000:9000   -v /var/run/docker.sock:/var/run/docker.sock  --name portainer portainer/portainer-ce
```

启动成功后便可以打开 http://192.168.30.130:9000/ 。首次登陆会叫我们创建一个管理账户，这里就不做说明了。Portainer 管理界面如下：

![portainer主页](https://res.zrain.fun/images/2022/04/portainer%E4%B8%BB%E9%A1%B5-ca5abcd40743ee4145c33a7aa3e46842.png)

## 创建服务并运行

我们现在 master 节点部署一个运行 nginx 镜像的 Service：

```bash
# 开启一个 nginx 服务容器
docker service create --name web nginx

# 查看服务是否开启
docker service ls

# 查看服务在哪个节点上运行（we是服务的id）
docker service ps we
```

![运行一个nginx](https://res.zrain.fun/images/2022/04/%E8%BF%90%E8%A1%8C%E4%B8%80%E4%B8%AAnginx-67a838df73e593bf78a0a5667c83d2b9.png)

我们可以看到刚刚创建的服务是运行在当前（master）节点上的。

## 服务伸缩

刚刚部署了只有一个副本的 Service，不过对于 Web 服务，通常会运行多个实例。这样可以负载均衡，同时也能提供高可用。

Swarm 要实现这个目标非常简单，增加 Service 的副本数：

```bash
# 副本数增加到 5
docker service scale web=5
```

![nginx服务扩展](https://res.zrain.fun/images/2022/04/nginx%E6%9C%8D%E5%8A%A1%E6%89%A9%E5%B1%95-3c021c1dbd71c387943b09db8b496737.png)

在这里我们就可以清除的看到有些 nginx 服务被分配到了 node_1 子节点上了。

![portainer服务展示](https://res.zrain.fun/images/2022/04/portainer%E6%9C%8D%E5%8A%A1%E5%B1%95%E7%A4%BA-43671e9a74b833d5a6dc85828031a727.png)

## 访问服务

要访问 nginx 服务，首先得保证网络通畅，其次需要知道服务的 IP。查看容器的网络配置。

在 Master 上运行了一个容器，是 web 的一个副本，容器监听了 80 端口，但并没有映射到 Docker Host，所以只能通过容器的 IP 访问。但是服务并没有暴露给外部网络，只能在 Docker 主机上访问，外部无法访问。要将 Service 暴露到外部：

```bash
# 更新 nginx 容器的暴露端口为 8080
docker service update --publish-add 8080:80 web
```

![更新nginx服务端口](https://res.zrain.fun/images/2022/04/%E6%9B%B4%E6%96%B0nginx%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%8F%A3-f1eb18c240f39d46bdaca89d04233a8b.png)

通过 `netstat -tlunp` 命令可以看到 8080 端口已监听，打开 http://192.168.30.130:8080/ ：

![成功运行nginx](https://res.zrain.fun/images/2022/04/%E6%88%90%E5%8A%9F%E8%BF%90%E8%A1%8Cnginx-e2de8951a60a1070fe8b4cd86384f002.png)

## 参考

[Docker 容器编排 - 博客园](https://www.cnblogs.com/lzp123/p/13769776.html)

[在 ubuntu 上使用 chrony 进行系统时间同步的配置方法 - CSDN](https://blog.csdn.net/weixin_67155214/article/details/123785360)

[Docker 开放远程 API 接口 - CSDN](https://blog.csdn.net/ic_esnow/article/details/113284475)
