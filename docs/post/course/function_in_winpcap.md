---
toc: false
date: 1651667675800
title: 'WinPcap中常用函数'
link: '/post/course/function_in_winpcap'
file: 'function_in_winpcap'
scope: ['WinPcap']
buckets: ['post', 'course']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<CenterImg src="https://res.zrain.fun/images/2022/05/winpcap-4103db1030cf5dd52bf7275ae6ee7a81.gif" alt="WinPcap" />

### pcap_findalldevs

```c
#include <pcap/pcap.h>

char errbuf[PCAP_ERRBUF_SIZE];

int pcap_findalldevs(pcap_if_t **alldevsp, char *errbuf);
```

得到所有网卡接口，存储至 alldevs。返回 0 表示获取成功，-1 则表明获取失败。参数如下：

- alldevs：网卡列表，类型为 pcap_if_t，使用后确保使用 [`pcap_freealldevs`](#pcap_freealldevs) 解放设备资源。

- errbuf：存放错误信息的缓冲。

例子：

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pcap/pcap.h>
#include <arpa/inet.h>

main()
{
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_if_t *it;
    int r;

    r = pcap_findalldevs(&it, errbuf);
    if (r == -1)
    {
        printf("err:%s\n", errbuf);
        exit(-1);
    }

    while (it)
    {
        printf(":%s\n", it->name);
        it = it->next;
    }
}
```

### pcap_freealldevs

```c
#include <pcap/pcap.h>

char errbuf[PCAP_ERRBUF_SIZE];

int pcap_findalldevs(pcap_if_t **alldevsp, char *errbuf);
```

如上述所说，释放被捕获的设备列表。参数如下：

- alldevs：被捕获设备的列表。

### pcap_open_live

```c
#include <pcap/pcap.h>

char errbuf[PCAP_ERRBUF_SIZE];

pcap_t *pcap_open_live(const char *device, int snaplen, int promisc, int to_ms, char *errbuf);
```

用于获得数据包捕获句柄，以查看网络上的数据包。设备是指定要打开的网络设备的字符串；在具有 2.2 或更高版本的 Linux 系统上，可以使用 any 或 NULL 的设备参数来捕获所有接口的数据包。返回 `pcap_t *` 表示获取目标句柄成功，NULL 则为失败。参数如下：

- device：设备名称，如上述所说，可以设置为 any 或 NULL 来捕获所有设备的数据包。

- snaplen：指定要在句柄上设置的 snapshot 长度。

- promisc：指定接口是否要设置为混杂模式。

- to_ms：指定最大的捕获时间。

- errbuf：错误信息缓冲区。

### pcap_loop

```c
#include <pcap/pcap.h>

typedef void (*pcap_handler)(u_char *user, const struct pcap_pkthdr *h,const u_char *bytes);

int pcap_loop(pcap_t *p, int cnt,pcap_handler callback, u_char *user);

int pcap_dispatch(pcap_t *p, int cnt,pcap_handler callback, u_char *user);
```

捕获数据包，其中 pcap_handler 为回调函数指针。返回 0 表示已捕获完 CNT 数据包，-1 表示错误产生，-2 表示调用了 `pcap_breakloop` 函数使捕获提前结束，它也可能什么也不返回，因为超过 `pcap_open_live` 中设置了**to_ms**，这时它会尽可能捕获更多的数据包。

依据：[pcap_loop - Linux man page](https://linux.die.net/man/3/pcap_loop)。

### pcap_next_ex

```c
#include <pcap/pcap.h>

int pcap_next_ex(pcap_t *p, struct pcap_pkthdr **pkt_header, const u_char **pkt_data);

const u_char *pcap_next(pcap_t *p, struct pcap_pkthdr *h);
```

读取下一个数据包并返回成功/失败指示。如果成功读取数据包，则设置 pkt_header 参数指向的指针指向数据包的 pcap_pkthdr 结构体，并且 pkt_data 参数指向的指针设置为指向数据集中的数据。返回 1 表示在没有任何问题的情况下捕获到的数据包，返回 0 表示正在捕获，也有可能超时，-1 则表示错误产生，-2 表示数据包正在从 savefile 中读取，savefile 里已经没有更多的数据包可供读取了。参数如下：

- p：设备句柄。

- pcap_pkthdr：指向数据包的 pcap_pkthdr 结构体指针。

- pkt_data：数据集指针。

### pcap_compile

```c
#include <pcap/pcap.h>

int pcap_compile(pcap_t *p, struct bpf_program *fp, const char *str, int optimize, bpf_u_int32 netmask);
```

编译数据包过滤器，将程序中高级的过滤表达式，转换成能被内核级的过滤引擎所处理的东西。返回 0 表示成功，-1 表示失败。

### pcap_setfilter

```c
#include <pcap/pcap.h>

int pcap_setfilter(pcap_t *p, struct bpf_program *fp);
```

在捕获过程中绑定一个过滤器。

### pcap_dump_open

```c
#include <pcap/pcap.h>

// pcap_dumper 结构体表示 libpcap 存储文件的描述符
typedef struct pcap_dumper pcap_dumper_t;

pcap_dumper_t *pcap_dump_open(pcap_t *p, const char *fname);

pcap_dumper_t *pcap_dump_fopen(pcap_t *p, FILE *fp);
```

打开一个文件来写入数据包。调用成功返回一个 `pcap_dumper_t` 指针，失败则返回 NULL。

### pcap_dump

```c
#include <pcap/pcap.h>

void pcap_dump(u_char *user, struct pcap_pkthdr *h, u_char *sp);
```

将数据包数据写入到通过 `pcap_dump_open` 打开的 savefile 中。

### pcap_inject & pcap_sendpacket

```c
#include <pcap/pcap.h>

int pcap_inject(pcap_t *p, const void *buf, size_t size);

int pcap_sendpacket(pcap_t *p, const u_char *buf, int size);
```

`pcap_inject` 函数通过网络接口发送 RAW 数据包。参数如下：

- p：设备句柄。

- buf：指向发送数据的指针。

- size：发送数据的大小。

注意，即使成功打开了网络接口，也可能没有权限在目标设备上发送数据包，或者**当前设备可能不支持发送数据包**。`pcap_sendpacket` 功能和 `pcap_inject` 相像，但在成功时返回 0，而不是返回编写的字节数。`pcap_inject` 来自 OpenBSD； `pcap_sendpacket` 来自 winpcap。两者都提供兼容性。
