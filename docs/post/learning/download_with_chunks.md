---
date: 1653321855437
title: '探索分块（chunk）传输'
scope: ['Node', 'ES6']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

大文件上传采用的方式是分块，那大文件下载呢？答案也是分块！只是这次的分块任务交给了传输层（TCP）而已。因此我们需要完成分片（chunks）的接收。

### 什么是 chunk 传输？

分块传输编码（Chunked transfer encoding）是超⽂本传输协议（HTTP）中的⼀种数据传输机制，允许 HTTP 由应⽤服务器发送给客户端应⽤（ 通常是⽹页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP 协议 1.1 版本（HTTP/1.1）中提供。

### 什么是 chunk？

<CenterImg src="https://res.zrain.fun/images/2022/05/chunk_struct-f59ade5edbf1fd8fbd1d58cb411cafaa.png" alt="chunk" zoom="40%" />

<br/>

chunk 编码格式如下：

```txt
[chunk size][\r\n][chunk data][\r\n][chunk size][\r\n][chunk data][\r\n][chunk size = 0][\r\n][\r\n]
```

编码使用若干个 chunk 组成，由一个标明长度为 0 的 chunk 结束。每个 chunk 有两部分组成，第一部分是该 chunk 的长度，第二部分就是指定长度的内容，每个部分用 CRLF（\r\n） 隔开。在最后一个长度为 0 的 chunk 中的内容是称为 footer 的内容，是一些没有写的头部内容。

### 为什么需要它

如果要一边产生数据，一边发给客户端（即**动态内容**），服务器就需要使用分块传输。

<CenterImg src="https://res.zrain.fun/images/2022/05/chunk_transform-2100d3e9a6e241800e2210d86873a4de.png" alt="chunk_transform" zoom="48%" />

<br/>

通常，HTTP 应答消息中发送的数据是整个发送的，Content-Length 头部字段表⽰数据的长度。数据的长度很重要，因为客户端需要知道哪⾥是应答消息的结束，以及后续应答消息的开始。然⽽，使⽤分块传输编码，数据分解成⼀系列数据块，并以⼀个或多个块发送，这样服务器可以发送数据⽽不需要预先知道发送内容的总⼤⼩，非常适合大文件或者动态内容。

### 开启 chunk 传输

要使用分块传输编码，则需要在响应头配置 Transfer-Encoding 字段，并设置它的值为 chunked 或 gzip, chunked：

```txt
Transfer-Encoding: chunked
Transfer-Encoding: gzip, chunked
```

响应头 Transfer-Encoding 字段的值为 chunked，表示数据以一系列分块的形式进行发送。需要注意的是 Transfer-Encoding 和 Content-Length 这两个字段是**互斥**的，也就是说响应报文中这两个字段不能同时出现。

### 实现

使用 NodeJS 实现一个小 Demo。

#### 服务端代码

```javascript
const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer()

server.on('request', function (req, res) {
  // 处理一下跨域
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.url === '/') {
    res.writeHeader(200, { 'Content-Type': 'text/html' })
    res.write(fs.readFileSync(path.resolve(__dirname, 'demo.html')))
    res.end()
  } else if (req.url === '/download') {
    // 设置为chunk传输（其实可以不用设置，流式传输自动开启）
    res.setHeader('Transfer-Encoding', 'gzip, chunked')
    const filePath = path.resolve(__dirname, 'hello.txt')
    const r = fs.createReadStream(filePath)
    // 注入内容
    r.pipe(res)
  } else res.end()
})

// 开启监听
server.listen(8080, function () {
  console.log('Listen on http://localhost:8080')
})
```

#### 客户端代码

只展示核心逻辑部分。

```javascript
const btn = document.querySelector('.btn')
btn.addEventListener('click', async function () {
  const reader = (await fetch('http://localhost:8080/download')).body.getReader()

  // 数据收集
  let resultUint8Array = []
  let bufferLen = 0

  while (true) {
    const readChunk = await reader.read()
    if (readChunk.done) {
      download(
        new Blob([mergeUint8Array(resultUint8Array, bufferLen)], {
          type: 'text/plain'
        }),
        'hello.txt'
      )
      break
    } else {
      bufferLen += readChunk.value.length
      resultUint8Array.push(readChunk.value)
    }
  }
})

// 合并数据
function mergeUint8Array(arr, length) {
  let mergedArray = new Uint8Array(length)
  let offset = 0
  arr.forEach((item) => {
    mergedArray.set(item, offset)
    offset += item.length
  })
  return mergedArray
}

// 下载文件
function download(blob, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  a.click()
  URL.revokeObjectURL(a.href)
}
```

效果如下：

<iframe src="https://codesandbox.io/embed/chunk-jw5snv?codemirror=1&fontsize=14&hidenavigation=1&theme=night"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="chunk"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads"
   ></iframe>

### 分析

手里正好有 WireShark，抓下包分析，下面是整个请求流程图：

![chunk_wireshark](https://res.zrain.fun/images/2022/05/chunk_wireshark-be1861ae3a718c13d8f2b5cd2631187f.png)

14 到 16 正好是 TCP 三次握手（顺便复习了一下）。重点注意 18、19、21 号，这些都是服务器向客户端发送的消息。18 号报文：

![wireshark_p1](https://res.zrain.fun/images/2022/05/wireshark_p1-07bbe5e9df9f378d1beeaa81c5c3a53c.png)

可以很明显的看到这是一个 TCP 分片，里面包装了来自应用层的 http 数据包。TCP segment data (1460 bytes)表明包含的数据大小为 1460 字节，因为下面还有类似的分片，我们可以推断出最大传输单元字节数为**1460**。这是在 TCP 握手阶段第一个请求就确定好的（Maximum Segment Size）。19 号报文格式与 18 号报文相似，传输了剩下的 678 字节数据，这里有个小细节：

![wirehark_p2](https://res.zrain.fun/images/2022/05/wirehark_p2-041f88b256e51e64ef989b21c951f445.png)

注意每个 chunk 数据后面都带了 CRLF（\r\n）！

到 21 号报文可知说有数据都传输完成，应该会有一个结束标志块：

![wireshark_p3](https://res.zrain.fun/images/2022/05/wireshark_p3-57fd50cf65ae38c359c3d086d82c9a98.png)

没错，结束块就是：End of chunked encoding。同时这里可以看出传输的总数据大小为 2000 字节。
