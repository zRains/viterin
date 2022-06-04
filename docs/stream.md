---
lang: zh-CN
title: 关于NodeJS中的流（Stream）
---

<CenterImg src="https://res.zrain.fun/images/2022/04/stream%E7%9A%84%E7%90%86%E8%A7%A3-250997c1315f9bf52cbe6adfc8d4a6ab.png" alt="stream的理解" zoom="38%" />

[[toc]]

### 什么是流

**流**就是一系列的数据——就跟数组或者字符串一样。有一点不同，就是 stream 可能无法在一次性全部可用，它们不需要完全载入内存，而这就是它的巨大优势。stream 在处理大量数据时，不会将数据一次性全部给消费者，而是连续不断的，可控的给消费者。

很多 Node.js 的内置模块都是基于流接口的：

| Readable Stream                 | WritableStream                 |
| ------------------------------- | ------------------------------ |
| HTTP responses, on the client   | HTTP requests, on the client   |
| HTTP requests, on the server    | HTTP responses, on the server  |
| fs read streams                 | fs write streams               |
| zlib streams                    | zlib streams                   |
| crypto streams                  | crypto streams                 |
| TCP sockets                     | TCP sockets                    |
| child process stdout and stderr | child process stdin            |
| process.stdin                   | process.stdout, process.stderr |

表格中就是一些使用了流的原生 Node.js 对象。其中有一些对象甚至是既可读又可写的，例如 TCP socket、zlib 以及 crypto 等。

值得注意的是上面说的一些对象也是彼此紧密联系的。例如 HTTP 响应在客户端中是一个可读流，而在服务端则是一个可写流。毕竟在 HTTP 场景中，我们在客户端侧是从相应对象（http.IncommingMessage）读取数据，而在服务端则是写入数据（http.ServerResponse）。

### 缓冲池

NodeJS 中所有的流都有缓冲池，缓冲池存在的目的是增加流的效率，当数据的生产和消费都需要时间时，我们可以在下一次消费前提前生产数据存放到缓冲池。但是缓冲池并不是时刻都处于使用状态，例如缓冲池为空时，数据生产后就不会放入缓冲池而是直接消费。

<CenterImg src="https://res.zrain.fun/images/2022/04/stream%E7%9A%84%E7%90%86%E8%A7%A3%20-1--9705a903c100c0aa68cc36f9916630dc.png" alt="stream的缓冲池" zoom="40%" />

> 缓冲池其实就是利用 Buffer 缓冲区实现，具体文章见[JS 的二进制家族](/post/learning/js_binary_family#buffer)

### 缓冲池背压问题与 Stream 的 highWaterMark

内存的读写速度远远大于磁盘的读写速度。在流的应用中，当内存中的数据要存放到磁盘时，中间的传送通道可以想象为一个“管道（pipe）”,而管道里面的就是“流”。内存的数据流入管道是非常快的，当管道塞满时，内存中就会产生数据背压，数据积压在内存中，占用资源。

<CenterImg src="https://res.zrain.fun/images/2022/04/stream%E7%9A%84%E7%90%86%E8%A7%A3-7c3c87518e926c51c65d9e73c6969707.png" alt="stream的背压问题" zoom="40%" />

NodeJS Stream 的解决办法是为每一个流的 缓冲池（就是图中写入队列）设置一个浮标值（highWaterMark），当其中数据量达到这个浮标值后，往缓冲池再次 push 数据时就会返回 false，表示当前流中缓冲池内容已经达到浮标值，不希望再有数据写入了，这时我们应该立即停止数据的生产，防止缓冲池过大产生背压。

### EventEmitter

NodeJS 中对 Stream 是一个实现了 EventEmitter 的抽象接口，所以先了解一下 EventEmitter。

EventEmitter 是一个实现事件发布订阅功能（发布订阅者模式）的类，来看一个简单的例子：

```javascript
const { EventEmitter } = require('events')

const eventEmitter = new EventEmitter()

eventEmitter.on('eventB', () => console.log('eventB invoke'))
eventEmitter.once('eventA', () => console.log('eventA invoke'))
eventEmitter.on('removeListener', event => console.log('removeListener', event))

eventEmitter.emit('eventB') // 触发 eventB
eventEmitter.emit('eventB') // 再次触发 eventB
eventEmitter.emit('eventA') // 触发 eventA
eventEmitter.emit('eventA') // 再次触发 eventA
```

`on`方法可以理解为注册某个事件，`emit`就是触发这个事件，而`once`顾名思义，只让事件触发一次。下面是输出结果：

```text
eventB invoke
eventB invoke
removeListener eventA
eventA invoke
```

> 可以注意到，eventEmitter 自带的 removeListener 事件会先移除事件再触发该事件。

### 流的一个示例

我们可以通过一个小示例来体会流的强大之处，先创建一个大文件：

```javascript
const fs = require('fs')
const file = fs.createWriteStream('./big.file')

for (let i = 0; i <= 1e5; i++) {
  file.write(
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
  )
}

file.end()
```

上面那个脚本会生成一个近 43MB 的文件，之后再写一个脚本测试：

```javascript
const fs = require('fs')

let data = null
console.log(process.pid)
setTimeout(() => {
  data = fs.readFileSync('./big.file') // 读入文件
}, 5000)

setTimeout(() => {
  data = null // 重置为null，让data被回收
  global.gc() // 手动触发GC
}, 10000)

process.stdin.resume() // 阻止node退出
```

> 运行上面脚本时需将 gc 暴露出来：node --expose-gc "target js file"

从下面的运行结果来看，读取文件后会使得 node 进程内存使用量陡增，不用说也知道是读取整个 big.file 到内存当中，这还不算大文件，如果直接上 10GB（超出 node 限制内存）程序会直接崩溃。

![无Stream内存使用情况](https://res.zrain.fun/images/2022/04/%E6%97%A0Stream%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5-ca37d5473e24f3f402ac248d2f17ed03.gif)

然而，当我们使用了流，结果会完全不一样。下面是使用了流处理后的代码：

```javascript
const fs = require('fs')

let data = null
console.log(process.pid)

setTimeout(() => {
  data = fs.createReadStream('./big.file', { highWaterMark: 100 }) // 创建文件读取流
  data.pipe(process.stdout)
}, 3000)
```

从运行结果来看，读取文件并没有占用太多内存：

![有Stream内存使用情况](https://res.zrain.fun/images/2022/04/%E6%9C%89Stream%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5-fa50d0c0d1339efd96869a929bd81d31.gif)

### 流

Stream 是在 Node.js 中处理流数据的抽象接口。Stream 并不是一个实际的接口，而是对所有流的一种统称。实际的接口有 ReadableStream（可读流）、 WritableStream（可写流）、ReadWriteStream（读写流） 这几个。

```typescript
interface ReadableStream extends EventEmitter {
  readable: boolean
  read(size?: number): string | Buffer
  setEncoding(encoding: BufferEncoding): this
  pause(): this
  resume(): this
  isPaused(): boolean
  pipe<T extends WritableStream>(
    destination: T,
    options?: { end?: boolean | undefined }
  ): T
  unpipe(destination?: WritableStream): this
  unshift(chunk: string | Uint8Array, encoding?: BufferEncoding): void
  wrap(oldStream: ReadableStream): this
  [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>
}

interface WritableStream extends EventEmitter {
  writable: boolean
  write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void): boolean
  write(
    str: string,
    encoding?: BufferEncoding,
    cb?: (err?: Error | null) => void
  ): boolean
  end(cb?: () => void): this
  end(data: string | Uint8Array, cb?: () => void): this
  end(str: string, encoding?: BufferEncoding, cb?: () => void): this
}

interface ReadWriteStream extends ReadableStream, WritableStream {}
```

可以看出 ReadableStream 和 WritableStream 都是继承 EventEmitter 类的接口（ts 中接口是可以继承类的，因为他们只是在进行类型的合并）。
上面这些接口对应的实现类分别是 Readable、Writable 和 Duplex。

流常用的事件和方法：

![Stream常用事件与方法](https://res.zrain.fun/images/2022/04/1-HGXpeiF5-hJrOk_8tT2jFA-eafdef8afb2c68d774071858fcfd6fbc.png)

NodeJS 中的流有 4 种：

- Readable 可读流（实现 ReadableStream）

- Writable 可写流（实现 WritableStream）

- Duplex 可读可写流（继承 Readable 后实现 WritableStream）

- Transform 转换流（继承 Duplex）

> 上面应用代码里的 fs.createReadStream 实际上创建了一个 Readable。

### Readable

可读流（Readable）是流的一种类型，他有两种模式三种状态：

两种模式：

- **暂停模式**：在这种模式下将不会主动触发 EventEmitter 传输数据，必须显示的调用 `Readable.read()`方法来从缓冲池中读取数据，read 会触发响应到 EventEmitter 事件。

- **流动模式**：数据会从底层系统读取写入到缓冲池，当缓冲池被写满后自动通过 EventEmitter 尽快的将数据传递给所注册的事件处理程序中。

三种状态：

- readableFlowing === null（初始状态）

- readableFlowing === false（暂停模式）

- readableFlowing === true（流动模式）

| 事件名   | 说明                                                             |
| -------- | ---------------------------------------------------------------- |
| readable | 当缓冲池有新的可读取数据时触发（每一个想缓冲池插入节点都会触发） |
| data     | 每一次消费数据后都会触发，参数是本次消费的数据                   |
| close    | 流关闭时触发                                                     |
| error    | 流发生错误时触发                                                 |

添加 data 事件后变为 true 。调用 `pause()`、`unpipe()`、或接收到背压或者添加 `readable` 事件，则 readableFlowing 会被设为 false ，在这个状态下，为 data 事件绑定监听器不会使 readableFlowing 切换到  true。

```javascript
const fs = require('fs')
let data = ''

let readStreams = fs.createReadStream('./string.txt', { highWaterMark: 2 })

readStreams.on('readable', () => {
  console.log('缓冲池满了')
  // read方法会消耗掉缓冲池内的数据并触发data事件。
  // 如果不到用那么缓冲池一直是满的没有被消耗，自然也不会触发data事件，下面会有说明
  console.log(readStreams.read())
})

readStreams.on('data', data => {
  console.log(data)
})

console.log(readStreams.readableFlowing) // false，添加了readable事件
```

当缓冲池中的数据长度达到浮标值 highWaterMark 后，就不会在主动请求生产数据，而是等待数据被消费后再生产数据。上面代码输出：

```text
false
缓冲区满了
<Buffer 61 62>
<Buffer 61 62>
缓冲区满了
<Buffer 63 64>
<Buffer 63 64>
缓冲区满了
null
```

> 注意最后输出了 null，表明数据源的数据被读完前，会触发一次 readable。

暂停状态的流如果不调用 read 来消费数据时，后续也不会触发 data 和 readable，当调用 read 消费时会先判断本次消费后剩余的数据长度是否低于 浮标值，如果低于 浮标值 就会在消费前请求生产数据。这样在 read 后的逻辑执行完成后新的数据大概率也已经生产完成，然后再次触发 readable，这种提前生产下一次消费的数据存放在缓冲池的机制也是缓存流为什么快的原因。

流动状态下的流有两种情况：

- 生产速度慢于消费速度时：这种情况下每一个生产数据后一般缓冲池中都不会有剩余数据，直接将本次生产的数据传递给 data 事件即可（因为没有进入缓冲池，所以也不用调用 read 来消费），然后立即开始生产新数据，待上一次数据消费完后新数据才生产好，再次触发 data ，一只到流结束。

- 生产速度快于消费速度时：此时每一次生产完数据后一般缓冲池都还存在未消费的数据，这种情况一般会在消费数据时开始生产下一次消费的数据，待旧数据消费完后新数据已经生产完并且放入缓冲池。

他们的区别仅仅在于数据生产后缓冲池**是否还存在数据**，如果存在数据则将生产的数据 push 到缓冲池等待消费，如果不存在则直接将数据交给 data 而不加入缓冲池。

> 值得注意的是当一个缓冲池中存在数据的流从暂停模式进入的流动模式时，会先循环调用 read 来消费数据只到返回 null。

#### 暂停模式（Paused Mode）

![Paused模式](https://res.zrain.fun/images/2022/04/cbea1fa0d58d45ee8e9fd6653a8abb0e-tplv-k3u1fbpfcp-zoom-in-crop-mark-1304-0-0-0-e244a8861164b251c5571e0342cba03a.webp)

暂停模式下，一个可读流读创建时，模式是暂停模式，创建后会自动调用 `_read` 方法，把数据从数据源 push 到缓冲池中，直到缓冲池中的数据达到了浮标值。每当数据到达浮标值时，可读流会触发一个`readable`事件，告诉消费者有数据已经准备好了，可以继续消费。

一般来说， readable 事件表明流有新的动态：要么有新的数据，要么到达流的尽头。所以，数据源的数据被读完前，也会触发一次 readable 事件。消费者 readable 事件的处理函数中，通过 `stream.read(size)` 主动消费缓冲池中的数据。

暂停模式的示例代码就是上面的代码，这里不做多余书写。

#### 流动模式（Flowing Mode）

![Flowing模式](https://res.zrain.fun/images/2022/04/bb06ec082f774a0cbd80146b17b88fbc-c5f81445e33166f750b8747d2f8d7cc8.png)

与暂停模式不同的是：流动模式下，缓冲池里面的数据会自动输出到消费端进行消费。

所有可读流开始的时候都是暂停模式，可以通过以下方法可以切换至流动模式：

- 添加`data`事件句柄。

- 调用`resume`方法。

- 使用`pipe`方法把数据发送到可写流。

在流动模式下缓冲池的使用和暂停模式一样：每次输出数据后，会自动回调 \_read 方法，把数据源的数据放到缓冲池中，如果此时缓冲池中不存在数据则会直接吧数据传递给 data 事件，不会经过缓冲池。

示例代码：

```javascript
const fs = require('fs')
let data = ''

let readStreams = fs.createReadStream('./string.txt', { highWaterMark: 2 })

// 或者使用readStreams.pipe(process.stdout)，pipe和data会将暂停模式的流切换到流动模式
readStreams.on('data', data => {
  console.log(data)
})

console.log(readStreams.readableFlowing)
```

### Writable

![WritableStream](https://res.zrain.fun/images/2022/04/5900bc9c471140a0859fc80a519d66df-tplv-k3u1fbpfcp-zoom-in-crop-mark-1304-0-0-0-39bf6402766d6bc114aa8bf567a1f05e.webp)

Writable 可以类比做 Readable 相反的操作，生产者和消费着互调身份。

当生产者调用 `write(chunk)` 时，内部会根据一些状态（corked，writing 等）选择是否加入到缓冲池中或者调用 `_write`，每次写完数据后，会尝试清空缓冲池中的数据。如果缓冲池中的数据大小超出了浮标值（highWaterMark），消费者调用 `write(chunk)` 后会返回 false，这时候生产者应该停止继续写入，直到缓冲池被清空触发`drain`事件通知生产者继续生产。

当生产者需要结束写入数据时，需要调用 `end` 方法通知可写流结束。

一个简单的示例，将输入流 pipe 到 WritableStream 并输出。

```javascript
const { Writable } = require('stream')

const outStream = new Writable({
  // write实现了_write
  write(chunk, encoding, callback) {
    console.log(chunk)
    callback()
  },
})

process.stdin.pipe(outStream)
```

`write`函数有三个参数：

- chunk 通常是一个 Buffer，除非我们用了别的奇葩姿势；

- encoding 参数指的就是编码，实际上我们通常可以忽略它；

- callback 是我们在写完数据后需要调用一下的回调函数。它相当于是告知调用方数据写入成功或者失败的信标。如果写入失败，在调用 callback 函数的时候传入一个错误对象即可。

下面是一个缓冲池消费示例：

```javascript
const { Writable } = require('stream')

let fileContent = ''
const myWritable = new Writable({
  highWaterMark: 10,
  write(chunk, encoding, callback) {
    setTimeout(() => {
      fileContent += chunk
      console.log('消费', chunk.toString())
      callback() // 写入结束后调用
    }, 100)
  },
})

myWritable.on('close', () => {
  console.log('close', fileContent)
})

let count = 0
function productionData() {
  let flag = true
  while (count <= 20 && flag) {
    flag = myWritable.write(count.toString())
    count++
  }
  if (count > 20) {
    myWritable.end()
  }
}
productionData()
myWritable.on('drain', productionData)
```

这里分析一下执行情况：

1. 首先第一次调用`myWritable.write("0")`时，因为缓存池不存在数据，所以 "0" 不进入缓存池，而是直接交给`_wirte，myWritable.write("0")`返回值为 true。

2. 当执行`myWritable.write("1")`时，因为 \_wirte 的 callback 还未调用，表明上一次数据还未写入完，位置保证数据写入的有序性，只能创建一个缓冲区将 "1" 加入缓存池中。后面 2-9 都是如此。

3. 当执行`myWritable.write("10")`时，此时缓冲区长度为 9（1-9），还未到达浮标值， "10" 继续作为一个缓冲区加入缓存池中，此时缓存池长度变为 11，所以`myWritable.write("1")`返回 false，这意味着缓冲区的数据已经足够，我们需要等待 drain 事件通知时再生产数据。

> “10”被视作两个 buffer。当要求写入的数据大于可写流的 highWaterMark 的时候，数据不会被一次写入，有一部分数据被滞留，这时候 writeable.write() 就会返回 false。

4. 100ms 过后`_write("0", encoding, callback)`的 callback 被调用，表明 "0" 已经写入完成。然后会检查缓存池中是否存在数据，如果存在则会先调用`_read`消费缓存池的头节点("1")，然后继续重复这个过程直到缓存池为空后触发 drain 事件，再次执行 productionData。

5. 调用`myWritable.write("11")`，触发第 1 步开始的过程，直到流结束。

### Duplex

![Duplex模式](https://res.zrain.fun/images/2022/04/5e40e4426450453ba20d1702dfbc3c9d-tplv-k3u1fbpfcp-zoom-in-crop-mark-1304-0-0-0-eb135bd0698734a1a6bab111ab317e83.webp)

Duplex 流需要同时实现下面两个方法：

- 实现 `_read()` 方法，为可读流生产数据。

- 实现 `_write()` 方法，为可写流消费数据。

需要注意的是：“读”和“写”两者都是独立的，每个都有独立的内部缓冲池。读写事件独立发生：

```text
                                        Duplex Stream
                                    ------------------|
                                Read  <-----               External Source
                        You         ------------------|
                                Write ----->               External Sink
                                    ------------------|
```

下面是一个简单的输入输出示例：

```javascript
const { Duplex } = require('stream')

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    if (String.prototype.trim.call(chunk.toString()) === 'exit') {
      console.log('exit~~~~~')
      inoutStream.end()
    }
    callback()
  },

  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++))
    if (this.currentCharCode > 90) {
      this.push(null)
    }
  },
})

inoutStream.currentCharCode = 65

process.stdin.pipe(inoutStream).pipe(process.stdout)
```

`process.stdin.pipe(inoutStream)`会阻止 node 进程结束，并且读入输入流调用`inoutStream._write`再次输出。`pipe(process.stdout)`会调用`inoutStream._write`并将 ABCDEFGHIJKLMNOPQRSTUVWXYZ 输出。当然，在 write 里调用 end 方法会结束`inoutStream`。

### Transform

![Transform](https://res.zrain.fun/images/2022/04/6317a5a204ba47829bbf8d273b0e9bd0-tplv-k3u1fbpfcp-zoom-in-crop-mark-1304-0-0-0-29c92d7f4e39b3c8eb08da7b94f95b98.webp)

对于 Transform，我们不需要实现 read 或者 write 方法，我们只需要实现 transform 方法就好了——它是一个糅杂方法。它既有 write 方法的特征，又可以在里面 push 数据。

下面是一个小例子，功能是将输入的小写字母转为大写并输出：

```javascript
const { Transform } = require('stream')

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  },
})

process.stdin.pipe(upperCaseTr).pipe(process.stdout)
```

这里可看出与 Duplex 的不同：Transform 流是**双工**的，其中读写以因果关系进行。双工流的端点通过某种转换链接。读取要求发生写入。也可以这么理解：Transform 里的“读”和“写”共用一个缓冲池。

```text
                                          Transform
                                --------------|--------------
                    You     Write  ---->     🙌            ---->  Read  You
                                --------------|--------------
```

Node 内置库有很多都使用了 Transform，如 zlib 和 crypto。

下面是一个使用 zlib.createGzip 和 fs 的可读/可写流结合起来写的一个文件压缩脚本：

```javascript
const fs = require('fs')
const zlib = require('zlib')
const file = process.argv[2]

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'))
```

### Pipe

上面的一些代码用到了`Pipe`函数。我们将他称为“管道”。

<CenterImg src="https://res.zrain.fun/images/2022/04/stream%E7%9A%84%E7%90%86%E8%A7%A3%20-1--615f4e5c48b2a9f2dd5c0399d17e184a.png" alt="Pipe" zoom="40%" />

管道是将上一个程序的输出作为下一个程序的输入，这是管道在 Linux 中管道的作用。NodeJS 中的管道其实也类似，它管道用于连接两个流，上游的流的输出会作为下游的流的输入。管道 sourec.pipe(dest, options) 要求 sourec 是可读的，dest 是可写的。其返回值是 dest。

> 对于处于管道中间的流既是下一个流的上游也是上一个流的下游，所以其需要时一个可读可写的双工流，一般我们会使用 Transform 来作为管道中间的流。

一个利用了管道的命令：

```bash
root$ grep -R exports * | wc -l 6
```

一个大致等价的 node 模型：

```javascript
const grep = ... // grep 输出流
const wc = ... // wc 输入流

grep.pipe(wc)
```

利用 Pipe 可以将各种流联合起来。组合流的用法是无止境的。
