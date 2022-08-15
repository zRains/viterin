---
date: 1650208113000
title: 'JS的二进制家族'
scope: ['JS']
buckets: ['post', 'learning']
draft: false
visible: true
lang: 'zh'
layout: 'page'
advanced: true
---

<script setup>
import BlobViewImg from './BlobViewImg.vue'
import FileReaderMethods from './FileReaderMethods.vue'
</script>

<CenterImg src="https://res.zrain.fun/images/2022/04/js%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6-d83a0110d6395f3b8ddf71ae705f948b.png" alt="js的二进制" zoom="40%" />

在了解[关于 NodeJS 中的流（Stream）](/post/learning/about_node_stream)这篇 post 出现多次`<Buffer xx xx>`，借此机会了解一下 JS 中的二进制操作。

## 概述

与 JS 的二进制操作相关的类有`Blob`和`ArrayBuffer`。在 node 里则是`Buffer`：

- Blob: 前端的一个专门用于支持文件操作的二进制对象
- ArrayBuffer：前端的一个通用的二进制缓冲区，类似数组，但在 API 和特性上却有诸多不同
- Buffer：Node.js 提供的一个二进制缓冲区，常用来处理 I/O 操作

<CenterImg src="https://res.zrain.fun/images/2022/04/js%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6-508f4ff8201c8420c8e918ec282a5935.png" alt="二进制操作关系图" zoom="40%" />

## Blob

Blob(binary large object)，二进制类文件大对象，是一个可以存储二进制文件的“容器”，HTML5 中的 Blob 对象除了存放二进制数据外还可以设置这个数据的 MIME 类型。File 接口基于 Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

> 所以在我们看来，File 对象可以看作一种特殊的 Blob 对象。

在前端工程中，我们在这些操作中可以获得 File 对象：

- `<input type="file">`标签上所选取的文件。

- 拖拽中生成的`DataTransfer`对象。

File 对象是一种特殊的 Blob 对象，那么它自然就可以直接调用 Blob 对象的方法：

- 文件下载：通过`URL.createObjectURL(blob)`生成 Blob URL，赋给 a 标签的 download 属性。

- 图片显示：通过`URL.createObjectURL(blob)`生成 BlobRL，赋给 img 标签的 src 属性。

- 资源分段：通过`blob.slice`可以分割二进制数据为子 Blob 上传。

- 读取本地文件：`FileReader`的 API 可以将 Blob 或 File 转化为文本/ArrayBuffer/Data URL 等。

下面是 Blob 的几个具体运用例子。

### 构造一个 Blob URL

Blob() 构造函数允许通过其它对象创建 Blob 对象。比如，用字符串构建一个 blob：

```javascript
const debug = { hello: 'world' }
const blob = new Blob([JSON.stringify(debug, null, 2)], { type: 'application/json' })
```

通过 `window.URL.createObjectURL` 方法可以把一个 blob 转化为一个 Blob URL，并且用做文件下载或者图片显示的链接：

```javascript
window.URL.createObjectURL(blob)
// 输出： 'blob:chrome://new-tab-page-third-party/8f0149c3-df2e-4a65-b7b3-203b6a198c9e'
```

和冗长的 Base64 格式的 Data URL 相比，Blob URL 的长度显然不能够存储足够的信息，这也就意味着它只是类似于一个浏览器内部的“引用“。从这个角度看，Blob URL 是一个浏览器自行制定的一个**伪协议**。

### 利用 Blob URL 实现文件的下载

我们可以通过 `window.URL.createObjectURL`，接收一个 Blob（File）对象，将其转化为 Blob URL，然后赋给 a 标签的 download 属性，然后在页面上点击这个链接就可以实现下载了：

```html
<!-- html部分 -->
<a id="h">点此进行下载</a>
<!-- js部分 -->
<script>
  var blob = new Blob(['Hello World'])
  var url = window.URL.createObjectURL(blob)
  var a = document.getElementById('h')
  a.download = 'helloworld.txt'
  a.href = url
</script>
```

### Blob 实现图片本地显示

window.URL.createObjectURL 生成的 Blob URL 还可以赋给 img.src，从而实现图片的显示：

```html
<!-- html部分 -->
<input type="file" id="f" />
<img id="img" style="width: 200px;height:200px;" />
<!-- js部分 -->
<script>
  document.getElementById('f').addEventListener(
    'change',
    function (e) {
      var file = this.files[0]
      const img = document.getElementById('img')
      const url = window.URL.createObjectURL(file)
      img.src = url
      img.onload = function () {
        // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
        window.URL.revokeObjectURL(url)
      }
    },
    false
  )
</script>
```

<BlobViewImg/>

### Blob 实现文件分片上传

在处理大文件上传时常用的一个功能，将 blob 分成小块并发上传，可以大大提高上传的效率：

```javascript
/**
 * 大文件分片
 * @param {File} file
 * @param {number} size
 * @returns
 */
function createFileChunk(file, size = 100) {
  const fileChunkList = []
  file.arrayBuffer()
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push(file.slice(cur, cur + size))
    cur += size
  }
  return fileChunkList
}
```

### FileReader 读取本地文件内容

如果想要读取 Blob 或者文件对象并转化为其他格式的数据，可以借助 FileReader 对象的 API 进行操作：

- **`FileReader.readAsText(Blob)`**：将 Blob 转化为文本字符串。

- **`FileReader.readAsArrayBuffer(Blob)`**： 将 Blob 转为 ArrayBuffer 格式数据。

- **`FileReader.readAsDataURL(Blob)`**: 将 Blob 转化为 Base64 格式的 Data URL。

<FileReaderMethods/>

上面介绍了 Blob 的用法，我们不难发现，Blob 是针对文件的，或者可以说它就是一个文件对象，同时呢我们发现 Blob 欠缺对二进制数据的细节操作能力，比如如果如果要具体修改某一部分的二进制数据，Blob 显然就不够用了，而这种细粒度的功能则可以由下面介绍的 ArrayBuffer 来完成。

## ArrayBuffer

ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个**字节数组**，通常在其他语言中称为“byte array”。说它是一个数组，但我们并不能对其进行常规操作，需要借用类型数组对象（TypeArray）或 DataView。

ArrayBuffer 跟 JS 的原生数组有很大的区别，具体为：

- ArrayBuffer 初始化后固定大小，数组可以自由增减。

- 数组放在堆中，ArrayBuffer 把数据放在栈中。

- ArrayBuffer 没有 push/pop 等数组的方法。这也是为什么它不能操作 buffer 的原因之一。

- ArrayBuffer 只能读不能写，写要借助 TypeArray/DataView。

ArrayBuffer 和 Blob 可以相互转化：

Blob => ArrayBuffer：

```javascript
let blob = new Blob([1, 2, 3, 4])
// 使用Blob原型上的arrayBuffer方法
blob.arrayBuffer() // Promise

// 或者使用FileReader对象
let reader = new FileReader()
reader.onload = function (result) {
  console.log(result)
}
reader.readAsArrayBuffer(blob)
```

ArrayBuffer => Blob：

```javascript
let blob = new Blob([buffer])
```

下面是 ArrayBuffer 的一些小例子。

### 通过 ArrayBuffer 的格式读取本地数据

```javascript
const file = this.files[0]
const fileReader = new FileReader()
fileReader.onload = function () {
  const result = fileReader.result
  console.log(result)
}
fileReader.readAsArrayBuffer(file)
```

<small>\*可以在上面的 FileReader 转换组件中尝试</small>

### 通过 ArrayBuffer 的格式读取 Ajax 请求数据

将 xhr.responseType 设置为 arraybuffer 可指定响应相应数据类型。在 onload 回调里打印 xhr.response：

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'ajax', true)
xhr.responseType = 'arraybuffer'
xhr.onload = function () {
  console.log(xhr.response)
}
xhr.send()
```

### 通过 TypeArray 对 ArrayBuffer 进行写操作

> TypedArray 指的是以下的其中之一：
>
> - Int8Array();
> - Uint8Array();
> - Uint8ClampedArray();
> - Int16Array();
> - Uint16Array();
> - Int32Array();
> - Uint32Array();
> - Float32Array();
> - Float64Array();

```javascript
const typedArray1 = new Int8Array(8)
typedArray1[0] = 32

const typedArray2 = new Int8Array(typedArray1)
typedArray2[1] = 42

console.log(typedArray1) //  output: Int8Array [32, 0, 0, 0, 0, 0, 0, 0]
console.log(typedArray2) //  output: Int8Array [32, 42, 0, 0, 0, 0, 0, 0]
```

### 通过 DataView 对 ArrayBuffer 进行写操作

```javascript
const buffer = new ArrayBuffer(16)
const view = new DataView(buffer)
view.setInt8(2, 42)
console.log(view.getInt8(2)) // 输出: 42
```

## Buffer

如开头所说，Buffer “看起来”像这样：（它在 NodeJS 中打印出来确实是这样的）

```text
<Buffer 02 04 06 08 0a 0c 0e 10>
```

Buffer 充当原始字节的容器，一个字节意味着 8 位，并且一位只是 `0` 或 `1`，所以字节看起来像 10101。但我们发现打印出来的 Buffer 并不是单纯的 1 或 0，其原因是 NodeJS 为了**节约显示空间和提高可读性**，选择展示 16 进制。

下面开始正式介绍 Buffer。

Buffer 是 **Node.js** 提供的对象，前端没有，它以二进制形式临时存放在内存中的物理映射、以 [Stream](/post/learning/about_node_stream) 为搬运数据的传送带和加工器，有方向、状态、缓冲大小。 它一般应用于 IO 操作，例如接收前端请求数据时候，可以通过以下的 Buffer 的 API 对接收到的前端数据进行整合。

<CenterImg src="https://res.zrain.fun/images/2022/04/js%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6-cfa9e18d0bcff3ddc504558ba87872d8.png" alt="node中Buffer创建及存储" zoom="40%" />

### 产生原因

由于历史原因，早期的 JavaScript 语言没有用于读取或操作二进制数据流的机制。因为 JavaScript 最初被设计用于处理 HTML 文档，而文档主要由字符串组成。同样，Node 早期为了处理图像、视频等文件，将字节编码为字符串来处理二进制数据，效率低下。 ECMAScript 2015 发布 TypedArray，更高效的访问和处理二进制，用于操作网络协议、数据库、图片和文件 I/O 等一些需要大量二进制数据的场景。Node 与时俱进，更新了 Buffer 来操作二进制数据。

> 注意：Buffer 的产生是来操作二进制数据，而不是代替 String 来操作字符串更高效的一系列方法！

在官方文档中说到：

> The Buffer class is a subclass of JavaScript's Uint8Array class and extends it with methods that cover additional use cases. Node.js APIs accept plain Uint8Arrays wherever Buffers are supported as well.

大致意思是：Buffer 约等于 Uint8Array 因为 Buffer 就是通过继承 Uint8Array 实现的。虽然 Buffer 不在 TypedArray，却是一家人。🤣

### 编码与转换

Buffer 和字符串之间转换时，默认使用 UTF-8，也可以指定其他字符编码格式。buffer 不支持的编码类型，gbk、gb2312 等可以借助 JS 工具包 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 实现。

![iconv-lite](https://camo.githubusercontent.com/56311a8a34ad3a7c7acc6b4327827586c5b256ef8150f877ce54ff229cc4dfde/68747470733a2f2f6e6f6465692e636f2f6e706d2f69636f6e762d6c6974652e706e67)

### 内存分配机制

由于 Buffer 需要处理的是大量的二进制数据，假如用一点就向系统去申请，则会造成频繁的向系统申请内存调用，所以 Buffer 所占用的内存不是由 V8 分配，而是在 NodeJS 的 C++ 层面完成申请，在 JS 中进行内存分配。这部分内存称之为**堆外内存**。

### 基本使用

Buffer 的创建及操作方法。

老版本（NodeJS v6-v8）：

```javascript
// 创建实例
const buf1 = new Buffer()
const buf2 = new Buffer(10)

buf1.fill(0) // 手动覆盖
```

船新版本（NodeJS v8-）：

```javascript
Buffer.alloc(10) // 指定长度初始化
Buffer.alloc(10, 1) // 指定填充 1
Buffer.allocUnsafe(10) // 未初始化的缓冲区 比alloc更快，有可能包含旧数据

Buffer.from([1, 2, 3]) //from 创建缓冲区
Buffer.from('test') // 通过字符串创建缓冲区
Buffer.from('test', 'test2')

const buf = Buffer.from([1, 2, 3]) //类似数据组 可以用 for..of
for (const item of buf) {
  console.log(item)
}

// 输出
// 1
// 2
// 3
```

Buffer 的切片（slice）、连接（concat）、比较（compare）：

```javascript
// slice
const buf = new Buffer.from('buffer')
console.log(buf.slice(0, 4).toString()) // buff
// 相当于
console.log('buffer'.slice(0, 4))

// concat
const buf = new Buffer.from('buffer')
const buf1 = new Buffer.from('11111')
const buf2 = new Buffer.from('22222')

const concatBuf = Buffer.concat([buf, buf1, buf2], buf.length + buf1.length + buf2.length)
console.log(concatBuf.toString()) // buffer1111122222

// compare
const buf1 = new Buffer.from('1234')
const buf2 = new Buffer.from('0123')
const arr = [buf1, buf2]
arr.sort(Buffer.compare)
console.log(arr.toString()) // 0123,1234

const buf3 = new Buffer.from('4567')
console.log(buf1.compare(buf1))
console.log(buf1.compare(buf2))
console.log(buf1.compare(buf3))
// 0 相同
// 1 之前
// -1 之后
```

### 和 string 传输效率的比较

一个有趣的事情，我在收集资料时，发现有[文章](https://zhuanlan.zhihu.com/p/368045575)在比较 string 和 buffer 在传输速度上的比较（使用压测），服务端如下：

```javascript
const http = require('http')
let s = ''
for (let i = 0; i < 1024 * 10; i++) {
  s += 'a'
}

const str = s
const bufStr = Buffer.from(s)
const server = http.createServer((req, res) => {
  if (req.url === '/buffer') {
    res.end(bufStr)
  } else if (req.url === '/string') {
    res.end(str)
  }
})

server.listen(3000)
```

测试命令如下：

```bash
# -c 200并发数  -t 等待响应最大时间 秒
$ ab -c 200 -t 60 http://localhost:3000/buffer
$ ab -c 200 -t 60 http://localhost:3000/string
```

但结果却不是原文章的结论：Buffer 比字符串的的传输更快。

![buffer和string传输比较](https://res.zrain.fun/images/2022/04/buffer%E5%92%8Cstring%E4%BC%A0%E8%BE%93%E6%AF%94%E8%BE%83-31ea42cfb2634e75dd33ff78e5ce1ee6.png)

可以看到字符串和 Buffer 传输速度差不多，似乎前者还要比后者效率好不少 🤣。 可能是测试的次数太少了。后来我在 [StackOverflow](https://stackoverflow.com/a/4901913/14792586) 上找到这么一个解答:

> Strings are built-in to V8, and allocate memory within the VM. Buffers were added not to make all string operations faster, but to represent binary data, where as Strings are unicode.
>
> When writing large amounts of data to a socket, it's much more efficient to have that data in binary format, vs having to convert from unicode.

大致意思是说如果在 Socket 编程时如果数据量**比较大**，Buffer 数据会比 string 数据高效。

我注意到要在数据量**比较大**的情况，于是调高了数据量（x100），下面是测试结果：

![buffer和string传输比较2](https://res.zrain.fun/images/2022/04/buffer%E5%92%8Cstring%E4%BC%A0%E8%BE%93%E6%AF%94%E8%BE%832-a203e81489aeb6996895f93df94027c5.png)

结果比较明显了，一分钟内/buffer 完成了 5w 次请求，平均传输速率为**1811756.95 KB/sec**，而/string 分钟内只完成 3w 次请求，平均传输速率为**507905.41 KB/sec**。

## Refer

[聊聊 JS 的二进制家族：Blob、ArrayBuffer 和 Buffer - 知乎](https://zhuanlan.zhihu.com/p/97768916)

[理解 Node 中的 Buffer 与 stream - 知乎](https://zhuanlan.zhihu.com/p/368045575)

[TypedArray - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

[Node Js Buffer - Pabbly](https://www.pabbly.com/tutorials/node-js-buffer/)
