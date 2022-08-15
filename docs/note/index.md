---
title: '笔记'
toc: false

head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

<script setup>
import BetterInvertColors from './BetterInvertColors.vue'
</script>

<h1>笔记</h1>

> 简短的笔记，也许是我不想写这么多罢了 📝

### 不错的正色与反色

<BetterInvertColors />

### 关于 appendChild

Node.appendChild() 方法将一个节点附加到指定父节点的子节点列表的末尾处。如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）。

这意味着，一个节点不可能同时出现在文档的不同位置。所以，如果某个节点已经拥有父节点，在被传递给此方法后，<strong><u>它首先会被移除</u></strong>，再被插入到新的位置。

<small>\* 摘自[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)</small>

### zsh 环境变量的加载

**.zshenv** - 它存放的环境变量配置项在任何场景下都能被读取，这里通常把$PATH 等变量写在这里，这样无论是在交互 shell，或者运行程序都会读取此文件。

**.zshrc** - 它主要用在交互 shell。对终端交互 shell 有用。

**.zlogin** - 在 login shell 的时候读取，比如系统启动的时候会读取此文件。

**.zprofile** - 是.zlogin 的替代品，如果使用了.zlogin 就不必再关心此文件。

**.zlogout** - 退出终端的时候读取，用于做一些清理工作。

读取顺序：.zshenv → [.zprofile if login] → [.zshrc if interactive] → [.zlogin if login] → [.zlogout sometimes]。

### 常见的时间复杂度

| 表示          | 名称       |
| ------------- | ---------- |
| $O(1)$        | 常数阶     |
| $O(n)$        | 线性阶     |
| $O(n^2)$      | 平方阶     |
| $O(\log{n})$  | 对数阶     |
| $O(n\log{n})$ | 线性对数阶 |
| $O(n^3)$      | 立方阶     |
| $O(2^n)$      | 指数阶     |
| $O(n!)$       | 阶乘阶     |

复杂度排序：

$$
O(1) < O(\log{n}) < O(n) < O(n\log{n}) < O(n^2) < O(n^3) < O(2^n) < O(n!) < O(n^n)
$$

### OSI 七层模型基本理解

<CenterImg src="https://res.zrain.fun/images/2022/05/OSI_process-5d8b0d87dab735ef5d7c95bb71352da3.png" alt="OSI_process" zoom="45%" />

<br/>

|   OSI 层   |                       功能                        |                应用（协议）                |
| :--------: | :-----------------------------------------------: | :----------------------------------------: |
|   应用层   |      文件传输、电子邮件、文件服务、虚拟终端       |  TFTP、HTTP、SNMP、FTP、SMTP、DNS、Telnet  |
|   表示层   |         数据格式转化、代码转换、数据加密          |                  没有协议                  |
|   会话层   |            解除或建立与别的节点的联系             |                  没有协议                  |
|   传输层   |                 提供端对端的接口                  |                  TCP、UDP                  |
|   网络层   |                 为数据包选择路由                  | IP、ICMP、RIP（动态路由）、OSPF、BGP、IGMP |
| 数据链路层 | 传输有地址的帧（以太网 MAC 帧等）以及错误检测功能 |      SLIP、CSLIP、PPP、ARP、RARP、MTU      |
|   物理层   |       以二进制数据小时在物理媒体上传输数据        |        ISO2110、IEEE802、IEEE802.2         |

### Rust 中可派生的 Trait

- 比较 trait: Eq, PartialEq, Ord, PartialOrd。

- Clone, 用来从 &T 创建副本 T。

- Copy，使类型具有 “复制语义”（copy semantics）而非 “移动语义”（move semantics）。

- Hash，从 &T 计算哈希值（hash）。

- Default, 创建数据类型的一个空实例。

- Debug，使用 {:?} formatter 来格式化一个值。

### 捕获与冒泡

事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中事件流（事件发生顺序）的问题。下面是一个基本示例：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>Hello zRain 🤗</div>
    <script>
      const DIV = document.querySelector('div')
      DIV.addEventListener(
        'click',
        function (event) {
          console.log('Click!')
        },
        false
      )
    </script>
  </body>
</html>
```

大致对应：

<CenterImg src="https://res.zrain.fun/images/2022/05/bubbling_and_capture-ed43c2beeb5a8c65ad2d85c990b3a381.png" alt="bubbling_and_capture" zoom="30%" />

在**事件函数**中通过下列方法阻止事件冒泡：

- `event.stopPropagation()`

- `return false`

但是这两种方式是有区别的。`return false` 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。`event.stopPropagation()` 则只阻止事件往上冒泡，不阻止事件本身。

还有另一个相似的概念，阻止默认事件：`event.preventDefault()`。

<small>\* 参考于[你真的理解”事件冒泡“和”事件捕获“吗？](https://juejin.cn/post/6844903834075021326)</small>

### rust 与 None

rust 并没有空值，`None` 只是 `Option` 的一个枚举。rust 不允许在给变量赋值前使用此变量：

```rust
{
    let r;

    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r);
}
```

声明了没有初始值的变量：r，这乍看之下好像和 Rust 不允许存在空值相冲突。然而如果尝试在给它一个值之前使用这个变量，会出现一个编译时错误，这就说明了 Rust 确实不允许空值。

<small>\* 摘自 [Rust 程序设计语言 简体中文版](https://kaisery.github.io/trpl-zh-cn/ch10-03-lifetime-syntax.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%81%BF%E5%85%8D%E4%BA%86%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8)</small>

### cargo 更换国内（清华）镜像源

进入 cargo 安装目录，新建 `config` 文件：

```text
[source.crates-io]
replace-with = 'tuna'

# 清华大学镜像源
[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

### 语法糖

语法糖（syntactic sugar），是指编程语言中可以更容易的表达一个操作的语法，它可以使程序员更加容易去使用这门语言，操作可以变得更加清晰、方便，或者更加符合程序员的编程习惯。用比较通俗易懂的方式去理解就是，在之前的某个语法的基础上改变了一种写法，实现的功能相同，但是写法不同了，主要是为了让开发人员在使用过程中更方便易懂。

### Linux 启用 ssh 远程登陆

登录目标机器，打开/etc/ssh/sshd_config 并将相应字段修改为：

```bash
# vim /etc/ssh/sshd_config
PermitRootLogin yes
PasswordAuthentication yes
```

之后重启 ssh 服务：

```bash
systemctl restart sshd
```

### 多进程并发服务器连接过程

当父进程产生新的子进程后，父、子进程共享父进程在调用 fork 之前的所有描述符。一般情况下，接下来这样父进程只负责接收客户请求，而子进程只负责处理客户请求。关闭不需要的描述符既可以节省系统资源，又可以防止父、子进程同时对共享描述符进程操作，产生不可预计的后果。

- 当服务器调用 accept 函数时，连接请求从客户到达服务器。
- 客户的连接请求被服务器接收后，新的已连接套接字即 connfd 被创建，可通过此描述符读、写数据。
- 服务器的下一步就是调用 fork 函数，如图下图所示，给出了从 fork 函数返回后的状态。此时描述符 listenfd 和 connfd 在父、子进程间共享。
- 接下来就由父进程关闭已连接描述符，由子进程关闭监听描述符。

<details>
<summary>展开图列</summary>
<img src="https://res.zrain.fun/images/2022/04/%E5%A4%9A%E8%BF%9B%E7%A8%8B%E5%B9%B6%E5%8F%91%E6%9C%8D%E5%8A%A1%E5%99%A8-ce0e1c97fb85235d2e817559f484d394.png" alt="多进程并发服务器" style="zoom:40%;" />
</details>

---

### socket 函数中协议族和套接字类型组合

socket 函数如下：

```c
#include <sys/socket.h>

int socket(int family,int type,int protocol);
```

socket 函数中 family 参数指明协议族，type 指明生产的套接字类型。

| 套接字类型\协议族 | AF_INET | AF_INET6 |
| ----------------- | ------- | -------- |
| SOCK_STREAM       | TCP     | TCP      |
| SOCK_DGRAM        | UDP     | UDP      |
| SOCK_RAW          | IPV4    | IPV6     |

---

### Android Studio 的 10.0.2.2

在 Android Studio 内如果想要连接本地的服务（socket，http）是不能使用 127.0.0.1、localhost 的，因为 Android 模拟器（simulator）把它自己作为了 localhost。如果你想在模拟器 simulator 上面访问你的电脑，那么就使用 android 内置的 IP 10.0.2.2 吧， 它是模拟器设置的特定 ip，是你的电脑的别名 alias 。

### delete 对 null 和 undefined 作用

首先是`delete`的特性：

- 如果删除成功，返回 true，反之返回 false;
- 如果试图删除不存在的变量， delete 不会起任何作用（废话），但是返回 true;
- delete 只能删除对象自己的属性，不能删除其原型链上的属性
- 属性可配置（configurable）设置为 false 时也无法删除。

下面语句会有一个有趣的现象：

```javascript
console.log(delete null) // true
console.log(delete undefined) // false
```

下面是 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined#description) 对`undefined`的解释：

> undefined 是全局对象的一个属性。也就是说，它是全局作用域的一个变量。undefined 的最初值就是原始数据类型 undefined。

在`window`下是可以输出`undefined`的：

![image-20220403175859377](https://res.zrain.fun/images/2022/04/image-20220403175859377-eb728c6f601ef83acebfda0b0134d9f7.png)

看到`configurable: false`就知道为什么删除`undefined`是 false 了。对于`null`，它是一个关键字，相当于没有，不管怎么删除只有返回 true。

---

### 容易忘记的 Math.random()

Math.random()方法返回大于等于 0 小于 1 的一个随机数。

产生**1-10**的随机数（两端包含）：

```javascript
var rand1 = Math.floor(Math.random() * 10 + 1)
```

产生**0-10**的随机数（两端包含）：

```javascript
var rand1 = Math.floor(Math.random() * 11)
var rand1 = Math.ceil(Math.random() * 10)
```

---

### 一些有用的 Linux 命令

防止别人 ping 你的服务器

```bash
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

查看端口

```bash
ps aux
```

查看所有进程

```bash
netstat -tlunp
```

---

### iframe 标签特性

- iframe 的创建比其它包括 scripts 和 css 的 DOM 元素的创建慢了 1-2 个数量级，使用 iframe 的页面一般不会包含太多 iframe，所以创建 DOM 节点所花费的时间不会占很大的比重。但带来一些其它的问题：onload 事件以及连接池（connection pool）

- 搜索引擎的检索程序无法解读 iframe。另外，iframe 本身不是动态语言，样式和脚本都需要额外导入。

- 绝大部分浏览器，主页面和其中的 iframe 是共享这些连接的。这意味着 iframe 在加载资源时可能用光了所有的可用连接，从而阻塞了主页面资源的加载。如果 iframe 中的内容比主页面的内容更重要，这当然是很好的。但通常情况下，iframe 里的内容是没有主页面的内容重要的。这时 iframe 中用光了可用的连接就是不值得的了。一种解决办法是，在主页面上重要的元素加载完毕后，再动态设置 iframe 的 SRC。

---

### 手动写动画最小时间间隔是多久

多数显示器的默认频率是 60hz,即每秒刷新 60 次。所以理论上的最小间隔是 1/60\*1000ms=16.7ms

---

### \<string.h> 和 \<strings.h> 的区别

we don't need and should not read this file if `<string.h>` was already read. The one exception being that if \_USE_MISC isn't defined, then these aren't defined in string.h, so we need to define then here.

```cpp
#ifdef __USE_MISC
#include <strings.h>
```

[stckoverflow](https://stackoverflow.com/a/4291328/14792586): strings.h comes from the BSD branch in the unix evolution. Its content has been standardized by POSIX, but most of it is marked as legacy and can be easily replaced with other functions:

```cpp
int    bcmp(const void *, const void *, size_t); /* LEGACY, see memcmp */
void   bcopy(const void *, void *, size_t); /* LEGACY, see memcpy, memmove */
void   bzero(void *, size_t); /* LEGACY, see memset */
int    ffs(int);
char  *index(const char *, int); /* LEGACY, see strchr */
char  *rindex(const char *, int); /* LEGACY, see strrchr */
int    strcasecmp(const char *, const char *);
int    strncasecmp(const char *, const char *, size_t);
```

---

### 实现最简单的防抖和节流

参考于掘金（具体网址忘了），修复了其中一个 BUG。

```javascript
/**
 * 防抖
 * @param {Function} fn
 * @param {number} time 防抖时间
 * @returns
 */
debounce(fn, time) {
  let task = null
  return (...args) => {
    if (task) {
      clearTimeout(task)
    }
    task = setTimeout(() => fn.apply(this, args), time)
  }
}

/**
 * 节流
 * @param {Function} fn
 * @param {number} time 节流时间
 * @returns
 */
throttle(fn, time) {
  let task = null
  return (...args) => {
    if (!task) {
      task = setTimeout(() => {
        task = null
        fn.apply(this, args)
      }, time)
    }
  }
}
```

---

### 正确使用 TypeScript 检查对象

体现于：[TC-9: Deep Readonly](/wrap/type_challenge/9_medium_deep_readonly)

```typescript
// Note: Record<string, any> accept all types:
// https://github.com/microsoft/TypeScript/issues/41746
const a1: Record<string, any> = [22]
const a2: Record<string, any> = /\d/
const a3: Record<string, any> = {}
let a4: Record<string, any> = { name: '张三' }
a4 = []
const a5: Record<string, any> = new Map()
const a6: Record<string, any> = new Set()
const a7: Record<string, any> = class Person {}
const a8: Record<string, any> = new Promise(() => {})

// Record<string, unknown> only accept obj:
const b: Record<string, unknown> = () => 22 // error
const b1: Record<string, unknown> = [22] // error
const b2: Record<string, unknown> = /\d/ // error
const b3: Record<string, unknown> = {}
let b4: Record<string, unknown> = { name: '张三' }
b4 = [] // error
const b5: Record<string, unknown> = new Map() // error
const b6: Record<string, unknown> = new Set() // error
const b7: Record<string, unknown> = class Person {} // error
const b8: Record<string, unknown> = new Promise(() => {}) // error
```

---
