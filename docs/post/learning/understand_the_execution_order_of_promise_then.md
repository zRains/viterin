---
toc: false,
date: 1664031831364
title: '理解Promise.then的执行顺序'
scope: ['JS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<CenterImg src="https://res.zrain.fun/images/2022/09/understand_the_execution_order_of_promise_then_banner.png" alt="understand_the_execution_order_of_promise_then_banner" invert="0" />

遇到一个非常离谱的求输出顺序题，本以为能轻松秒杀，没想到直接来个大的，各种混杂非常烧脑。具体题目代码放在末尾，有兴趣的可以直接挑战一下。这里截取一个核心考点：Promise.then 的执行顺序。

### 问题

先来看一个问题吧，以下代码的输出顺序是：

```javascript
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then((a) => {
    console.log(2)
    new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    })
      .then((c) => {
        console.log(4)
      })
      .then((d) => {
        console.log(6)
      })
  })
  .then((b) => {
    console.log(5)
  })
```

<details>
<summary>答案</summary>

```text
1 -> 2 -> 3 -> 4 -> 5 -> 6
```

</details>

我们知道 Promise 产生的任务为微任务，需要添加到微任务队列。那么问题来了：在输出 3 后轮到谁添加到队列？是输出 5 还是输出 4？

<CenterImg src="https://res.zrain.fun/images/2022/09/qzi_of_order.png" alt="qzi_of_order" zoom="55%" />

### Promise/A+ 规范

要理解其中的过程，我们需要了解一下什么是 [Promise/A+](https://promisesaplus.com.cn/) 规范。摘取比较重要的几点：

1、一个 Promise 的当前状态必须为以下三种状态中的一种。

等待态（Pending）、完成态（Fulfilled）和拒绝态（Rejected）。

2、一个 Promise 必须提供一个 then 方法以访问其当前值、终值和拒绝原因。

```javascript
// 提供两个参数，都为函数类型
promise.then(onFulfilled, onRejected)
```

如果 onFulfilled 是函数，此函数必须在 Promise 完成后被调用,并把 Promise 的值作为它的第一个参数；此函数在 Promise 完成态之前绝对不能被调用；此函数绝对不能被调用**超过一次**。

3、then 必须返回一个 Promise，并且在同一个 Promise 里可以被调用多次。

当 Promise 的状态变为完成态或者拒绝态时，onFulfilled 和 onRejected 回调函数的调用顺序将会按照在 then 里**定义的顺序**进行调用（也就是大家所熟知的 then 链式调用）:

```javascript
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
```

### 解决

结合前面理解的几条 Promise/A+ 规范，让我们来一起分析一下这段代码的执行顺序。

前面的输出容易理解：首先打印 1，之后调用了 `resolve()` 函数，这将首个 Promise（记为 P0）的状态更改为完成态。这时将后面跟紧的 `then()` 放入微任务队列（打印 2 等，记为 P1），这时可能就会有疑问了：那最后的 then（打印 5，记为 P2）需要紧跟着进入微任务队列吗？这时我们必须结合规范了。

- 根据规范 [2.2.7](https://promisesaplus.com.cn/#point-40)，then 必须返回一个 Promise（也就是上面的 P1）。注意它被放入队列后回调还没被执行，也就是状态还是等待态。
- 根据规范 [2.2.2.1](https://promisesaplus.com.cn/#point-27)，then 回调的执行必须在上一个 Promise 的状态为 fulfilled，所以下一个紧跟的 then（P2）其实是被缓存在 P1 的内回调队列里，等这个 Promise 的状态改变再放入微任务队列。

<CenterImg src="https://res.zrain.fun/images/2022/09/then_promise_add_queue.png" alt="then_promise_add_queue" zoom="55%" />

此时的微任务队列：

```text
|------|------|------|------|------|
|  P1  |      |      |      |      |
|------|------|------|------|------|
```

接着执行微任务队列的第一个微任务（P1），即打印 2，然后接着往下执行，遇到了一个新的 Promise，我们记为 P1-0, 接着先打印 3。后面调用了 `resolve()` 使得 P1-0 变为完成态，之后便将后面的 then （打印 4，记为 P1-1）添加到微任务队列中。同样的道理，之后的 then（打印 6，记为 P1-2）被缓存在 P1-1 中。

此时的微任务队列：

```text
|------|------|------|------|------|
|  P1  | P1-1 |      |      |      |
|------|------|------|------|------|
```

接着 P1 执行完了，没有返回东西，可以理解为返回 undefined ，根据规范 [2.3.4](https://promisesaplus.com.cn/#point-64)，如果 x 既不是对象也不是函数，用 x 完成（fulfill）Promise，说明上面的 P1 的状态变为了完成态，因此之前的 P2 此时可以被放入微任务队列里等待执行了。

此时的微任务队列：

```text
|------|------|------|------|------|
| P1-1 |  P2  |      |      |      |
|------|------|------|------|------|
```

之后运行 P1-1 微任务，打印 4。注意它后面有一个 then（P1-2），P1-1 变为完成态后将 P1-2 加入了微任务队列。

此时的微任务队列：

```text
|------|------|------|------|------|
|  P2  | P1-2 |      |      |      |
|------|------|------|------|------|
```

因为没有额外的 then 分析了，微任务队列内的任务依次执行。所以输出结果就是，P2 -> 5，P1-2 -> 6。

### 扩展

我们知道，链式调用的 then 的值是上一个 then 的返回值或者 `resolve()` 传递的值，如果 then 返回一个新的 Promise 会怎样呢？下面是引题的变体：

```javascript
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then((a) => {
    console.log(2)
    return new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    })
      .then((c) => {
        console.log(4)
      })
      .then((d) => {
        console.log(6)
      })
  })
  .then((b) => {
    console.log(5)
  })
```

我们依然根据规范进行分析：

根据规范 [2.3.2](https://promisesaplus.com.cn/#point-49)，如果 x 是一个 Promise，采用 Promise 的状态，如果 x 是请求状态， Promise (也就是这个 then 代表的 Promise)必须保持请求态直到 x fulfilled 或 rejected；如果 x 是完成态，用相同的值完成 Promise ；如果 x 是拒绝态(rejected)，用相同的原因拒绝 Promise。

因此上面的变体代码等效于下面的代码：

```javascript
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
}).then((a) => {
  console.log(2)
  return new Promise((resolve, reject) => {
    console.log(3)
    resolve()
  })
    .then((c) => {
      console.log(4)
    })
    .then((d) => {
      console.log(6)
    })
    .then((b) => {
      console.log(5)
    })
})
```

结果自然明了：1 -> 2 -> 3 -> 4 -> 6 -> 5。

### hard_invoke.js

注意适度用脑 😆。

```javascript
async function async1() {
  console.log('async1 start')
  new Promise((resolve, reject) => {
    try {
      throw new Error('error1')
    } catch (e) {
      console.log(e)
    }
    setTimeout(() => {
      resolve('promise4')
    }, 3 * 1000)
  })
    .then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
    .finally((res) => {
      console.log(res)
    })
  console.log(await async2())
  console.log('async1 end')
}

function async2() {
  console.log('async2')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, 1 * 3000)
  })
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

async1()

new Promise((resolve) => {
  console.log('promise1')
  resolve()
})
  .then(() => {
    console.log('promise2')
    return new Promise((resolve) => {
      resolve()
    }).then(() => {
      console.log('then 1-1')
    })
  })
  .then(() => {
    console.log('promise3')
  })

console.log('script end')
```
