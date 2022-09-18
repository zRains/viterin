---
date: 1663476240742
title: 'Minecraft与SLP'
scope: ['Node', 'Socket']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<img src="https://res.zrain.fun/images/2022/09/Multiplayer_mode.png" />

突然好奇 Minecraft 的多人游戏是怎么获取多人服务器的信息的，就如上图所示。获取的基本信息有：

- 服务器版本；
- 服务器名；
- 服务器基本描述；
- 服务器 Logo；
- 服务器在线人数和最大同时在线人数；
- 服务器延迟。

身为一名前端和 Minecraft 爱好者，推测可能是有某类获取信息的 API，但我查找一部分资料后，发现事情没这么简单 🤔。

## SLP 接口

废话不多说，实际上客户端获取信息功能是通过一个叫 [Server List Ping(SLP)](https://wiki.vg/Server_List_Ping) 接口实现的。客户端自身实现了一套 [Socket](https://wiki.vg/Protocol) 通信协议，并在此基础上构建了 LSP、登录、聊天通信接口。看了一下各种语言的 SLP 实现示例，其难点在于 socket 服务的搭建和构建通信消息。其中 [NodeJS](https://github.com/PauldeKoning/minecraft-server-handshake) 示例只实现了前半部分（Handshake），并没有处理返回的消息，借此机会自己手撸一个功能完整的，这里的功能项参照了比较出名的服务端信息检测：[mcsrvstat](https://mcsrvstat.us/)。

我实现版本是 SLP 1.7+，这个版本能获取当前大部分服务端端信息，也是实现过程最复杂的一种：

> The SLP process changed in 1.7 in a non-backwards compatible way, but current servers still support both the new and old process.

<small>\* SLP 进程在 1.7 中以不向后兼容的方式进行了更改，但当前服务器仍然支持新进程和旧进程。</small>

如果要获取较老版本服务端的信息还需要单独做适配，但相比之下比 1.7+ 版本简单。SLP 一共有三个阶段：Handshake、Status Request、Status Response。

## Handshake

首先，客户端需要发送一个 handshake 数据包给服务端。其结构如下：

<CenterImg src="https://res.zrain.fun/images/2022/09/handshake_packet_struct.png" alt="handshake_packet_struct" />

这里就出现一个对我来说比较新的概念了：VarInt。

### 何为 VarInt？

Varint 是一种紧凑的表示数字的方法。它用一个或多个字节来表示一个数字，值越小的数字使用越少的字节数。这能减少用来表示数字的字节数。比如一个 32 位的无符号整数 123456，它需要 4 字节来表示：

```javascript
console.log(new Uint32Array([123456]).buffer)
// ArrayBuffer { [Uint8Contents]: <40 e2 01 00>, byteLength: 4 }
```

但经过 VarInt 编码后可以减少为 3 字节：

```javascript
console.log(Varint(123456).buffer)
// ArrayBuffer { [Uint8Contents]: <c0 c4 07>, byteLength: 3 }
```

当然凡事都有好的也有不好的一面，采用 Varint 表示法，大的数字则需要 5 个 byte 来表示。从统计的角度来说，一般不会所有的消息中的数字都是大数，因此大多数情况下，采用 Varint 后，可以用更少的字节数来表示数字信息。

### VarInt 编码规则

除了最后一个字节外，varint 编码中的每个字节都设置了最高有效位（most significant bit - msb）–msb 为 1 则表明后面的字节还是属于当前数据的,如果是 0 那么这是当前数据的最后一个字节数据。每个字节的低 7 位用于以 7 位为一组存储数字的二进制补码表示，最低有效组在前。varint 编码后数据的字节是按照**小端序**排列的。举个例子：

<CenterImg src="https://res.zrain.fun/images/2022/09/VarInt_encode_example.png" alt="VarInt_encode_example" />

需要注意的是结果是反方向排列的。

### 实现 Varint 编码

有了上述规则，我们可以很好的用位运算实现：

```javascript
function packVarint(num) {
  const buffers = []

  while (true) {
    // 如果大于 0x7f 说明此数字不能用只用当前一个字节表示，需要在高位变 1
    if (num > 0x7f) {
      // 0x7f 的二进制编码为 01111111，用 & 操作即可取出后 7 位
      // 0x80 的二进制编码为 11111111，用 ｜ 操作可以把最高位变为 1
      buffers.push(0x80 | (num & 0x7f))
      // 完成操作将数字右移 7 位
      num >>= 7
    } else {
      // 如果不大于 0x7f 说明一字节就行了，直接添加到结果里
      buffers.push(num)
      break
    }
  }

  return Uint8Array.from(buffers)
}
```

### 实现 Varint 解码

解码就是编码的逆过程，同样是用位运算就能快速有效的完成解码，结合下面的代码注释再在纸上推演一遍理解起来就不难了。

```javascript
function unPackVarint(arr) {
  let result = 0

  for (let idx = 0; idx < 5; idx++) {
    let bufferVal = arr[idx]

    // 获取蒂7位的有效数据，并根据结果左移进行还原
    result |= (bufferVal & 0x7f) << (idx * 7)

    // 读取最高位是否为 0，如果为 0 表示这是最后一个数据，直接返回即可
    if ((bufferVal & 0x80) === 0) return result
  }

  return result
}
```

### 构建 handshake 数据包

```javascript
// 这里以 hypixel 为例
const host = 'mc.hypixel.net'
const port = 25565

// 主机地址
const hostUnit8Arr = Uint8Array.from(Buffer.from(host))
const dataBody = concatData([
  // 第一个 buffer 为数据包 ID，后一个便是协议版本，这里没有使用 packVarInt 是因为可以直接看出来结果（-1 或空）。
  Uint8Array.from([0x00, 0x00]),
  // 主机地址长度，使用VarInt编码进行处理
  packVarint(hostUnit8Arr.length),
  // 主机地址，类型为string，不需要进行编码
  hostUnit8Arr,
  // 端口，同样不需要编码，而 1 经过编码后很容易看出来为 0x01，没有大于0x7f
  // 由于端口需要两个字节表示，所以需要转换一下
  concatData([Uint8Array.from(Buffer.from(Uint16Array.from([port]).buffer)), Uint8Array.from([0x01])])
])

// 将包长度信息进行编码
const data = concatData([packVarint(dataBody.length), dataBody])

function concatData(arrays) {
  const totalLength = arrays.reduce((acc, value) => acc + value.length, 0)
  let result = new Uint8Array(totalLength)

  arrays.reduce((offset, arr) => {
    result.set(arr, offset)
    return offset + arr.length
  }, 0)

  return result
}
```

我们试着使用 Node 构建一个简单的 socket 客户端并进行发送，用 Wireshark 抓包：

<CenterImg src="https://res.zrain.fun/images/2022/09/wireshark_handshake_packet.png" alt="wireshark_handshake_packet" />

我们可以进行验证，首先可以确定的是“mc.hypixel.net”的却是成功发送出去了的，之后我们通过 Varint 解码前几个字节 `<14 00 00>`：由于 `0x14` 的二进制表示为 00010100 其最高位已经为 0，表明这个是最后一个数据，也就是说后面数据部分长度为 20，这点也是可以验证的。

## Status Request

下面是 Status Request 数据包的结构，非常简单，就一个确认包：

<CenterImg src="https://res.zrain.fun/images/2022/09/status_request_packet.png" alt="status_request_packet" zoom="60%" />

一行代码构建完成 😉：

```javascript
// 同上面一样，数据长度进行了 VarInt 编码处理，但因为太小还是和未编码一样（一个字节）
const data = Uint8Array.from([0x01, 0x00])
```

我们试着发送，看看抓包结果。首先是数据发送情况：

<CenterImg src="https://res.zrain.fun/images/2022/09/wireshark_status_request_packet.png" alt="wireshark_status_request_packet" />

确定了数据发送成功，我们就可以进行最后一个阶段了。

## Status Response

这个阶段是我们读取服务端返回的信息，里面包含了各种数据。具体字段内容可以参考 Minecraft 开发者 [wiki](https://wiki.vg/Protocol#Status_Response)。这里需要注意的是数据部分最长为连个字节的 VarInt 编码表示，也就是 16383bits。

| Packet ID |  Field Name   | Field Type |                     Notes                      |
| :-------: | :-----------: | :--------: | :--------------------------------------------: |
|   0x00    | JSON Response |   String   | prefixed by its length as a VarInt(2-byte max) |

我们可以查看上一阶段后服务器发送过来的信息：

<CenterImg src="https://res.zrain.fun/images/2022/09/wireshark_server_resopnse_packet.png" alt="wireshark_server_resopnse_packet" />

可以明显可见返回了一个类似 JSON 格式的数据，里面就包含了我们需要的服务器信息。现在问题来了，怎么通过 Node 获取到这些数据呢，时候断开 socket 连接呢？答案还是 VarInt 编码：因为前两个字节表示后续数据的大小，就算 TCP 分片的我们也可以源源不断的收集起来，达到目标大小后就可以断开 socket 连接。

## 收集数据

基本实现如下：

```javascript
function getResponseData() {
  const socket = new Socket().connect({ host: 'mc.hypixel.mc', port: 25565 })
  let packageDataLen,
    responseBuffers = Buffer.from('')
  // Send handshake Packet
  // Send server request packet

  return new Promise((resolve) => {
    socket.on('readable', () => {
      // 如果字节数小于 2，则无法读取数据部分的总大小，需要等到下一次可读取状态触发
      if (socket.readableLength >= 5) {
        if (packageDataLen === undefined) {
          // 读取数据部分大小
          const packageLen = unPackVarint(socket)
          // 读取数据包 ID，这里可以不用解码
          const packageId = unPackVarint(socket)
          // 读取信息部分大小
          const packageDataLength = unPackVarint(socket)

          packageDataLen = packageDataLength
        }

        responseBuffers = Buffer.concat([responseBuffers, socket.read()])

        if (responseBuffers.length >= packageDataLen) {
          // 数据大小达到期望值，可以中断连接了
          socket.destroy()
          // 返回数据
          resolve(responseBuffers)
        }
      }
    })
  })
}
```

获取信息后可以将其转为 JSON 格式，因为信息内包含 base64 编码的服务端图标，存在逃逸 Unicode 字符，就比如 “=” 为 \u003d。

## 获取延迟

信息获取后就可以断开连接了，但其实还有两个阶段：Ping Request 和 Pong Response，没错，这就是用来获取延迟信息的。 这表明关于延迟的数据是没有包含在信息里的，在 wiki 里存在以下说明：

> After receiving the Response packet, the client may send the next packet to help calculate the server's latency, or if it is only interested in the above information it can disconnect here.

<small>\* 在接收到响应数据包后，客户端可以发送下一个数据包，以帮助计算服务器的延迟，或者，如果客户端只对上述信息感兴趣，则可以在此处断开连接。</small>

<CenterImg src="https://res.zrain.fun/images/2022/09/ping_pong_packet.png" aly="ping_pong_packet" />

用服务端返回的时间减去客户端发送时的时间即可获取延迟，由于功能重复编码太强，所以就不实现了。

## 最终代码

我将其封装为一个 MineStatus 类，以便做信息缓存。同时参照[mcsrvstat](https://mcsrvstat.us/)做了丐版的 debug 消息。

```javascript
const { Socket } = require('net')

class MineStatus {
  /** @type {Socket} */
  socket

  /** @type {string} */
  host

  /** @type {number} */
  port

  /** @type {number} */
  packageDataLen

  /** @type {Buffer} */
  responseBuffers = Buffer.from('')

  /** @type {{host: string, ip: string, port: string}} */
  debugInfo

  /**
   * @param {string} host
   * @param {number} port
   * @param {boolean} [immediately]
   */
  constructor(host, port) {
    this.host = host
    this.port = port
  }

  onConnect() {
    const hostUnit8Arr = Uint8Array.from(Buffer.from(this.host))
    const dataBody = MineStatus.concatData([
      Uint8Array.from([0x00, 0x00]),
      MineStatus.packVarint(hostUnit8Arr.length),
      hostUnit8Arr,
      MineStatus.concatData([Uint8Array.from(Buffer.from(Uint16Array.from([this.port]).buffer)), Uint8Array.from([0x01])])
    ])

    this.socket.write(MineStatus.concatData([MineStatus.packVarint(dataBody.length), dataBody]))
    this.socket.write(Uint8Array.from([0x01, 0x00]))

    // Set debug info here
    this.debugInfo = {
      host: this.host,
      ip: this.socket.remoteAddress || this.host,
      port: this.socket.remotePort || this.port
    }
  }

  /** @return {Promise<Buffer>} */
  getResponseData() {
    if (this.responseBuffers.length >= this.packageDataLen) return Promise.resolve(this.responseBuffers)

    this.socket = new Socket().connect({ host: this.host, port: this.port })
    this.socket.on('connect', this.onConnect.bind(this))

    return new Promise((resolve) => {
      this.socket.on('readable', () => {
        if (this.socket.readableLength >= 5) {
          if (this.packageDataLen === undefined) {
            const packageLen = MineStatus.unPackVarint(this.socket)
            const packageId = MineStatus.unPackVarint(this.socket)
            const packageDataLen = MineStatus.unPackVarint(this.socket)

            this.packageDataLen = packageDataLen
          }

          this.responseBuffers = Buffer.concat([this.responseBuffers, this.socket.read()])

          if (this.responseBuffers.length >= this.packageDataLen) {
            this.socket.destroy()
            resolve(this.responseBuffers)
          }
        }
      })
    })
  }

  async getStatus() {
    const responseData = await this.getResponseData()

    try {
      return JSON.parse(responseData.toString())
    } catch (error) {
      console.log(responseData.toString())
      return {}
    }
  }

  /** @return {Promise<{host: string, ip: string, port: string}>} */
  getDebugInfo() {
    if (this.debugInfo) return Promise.resolve(this.debugInfo)

    this.socket = new Socket().connect({ host: this.host, port: this.port })

    return new Promise((resolve) => {
      this.socket.on('connect', () => {
        this.debugInfo = {
          host: this.host,
          ip: this.socket.remoteAddress || this.host,
          port: this.socket.remotePort || this.port
        }

        this.socket.destroy()

        resolve(this.debugInfo)
      })
    })
  }

  /** @param {Uint8Array[]} arrays */
  static concatData(arrays) {
    const totalLength = arrays.reduce((acc, value) => acc + value.length, 0)
    let result = new Uint8Array(totalLength)

    arrays.reduce((offset, arr) => {
      result.set(arr, offset)
      return offset + arr.length
    }, 0)

    return result
  }

  /** @param {number} num */
  static packVarint(num) {
    const buffers = []

    while (true) {
      if (num > 0x7f) {
        buffers.push(0x80 | (num & 0x7f))
        num >>= 7
      } else {
        buffers.push(num)
        break
      }
    }

    return Uint8Array.from(buffers)
  }

  /** @param {Socket} socket */
  static unPackVarint(socket) {
    let result = 0

    for (let idx = 0; idx < 5; idx++) {
      let bufferVal = socket.read(1)[0]

      result |= (bufferVal & 0x7f) << (idx * 7)

      if ((bufferVal & 0x80) === 0) return result
    }

    return result
  }
}
```

使用方法可参照我的 [Gist](https://gist.github.com/zRains/905457b550ef86cc4f7ecd4f99228e9b)。

## 参考

- [wiki.vg](https://wiki.vg/)
- [详解 varint 编码原理](https://zhuanlan.zhihu.com/p/84250836)
