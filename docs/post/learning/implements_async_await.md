---
date: 1652156716000
title: '简单实现 async/await'
scope: ['ES6', 'TS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

![async_await](https://res.zrain.fun/images/2022/05/async_await-941574ea5f3cc6be82f9a417b6c2b390.png)

async/await 是 Js 异步解决方案之一，让我们以同步的方式编写异步代码，使异步处理逻辑更清晰明了。这篇文章就来探索一下它背后的实现原理。

### 目录

### 什么是 async/await

先用代码体验一下这种处理方式和其它方式的区别，首先是回调方式：

```typescript
// cb 为回调函数
function getCompany(cb: (data: string) => void) {
  // 模拟请求服务
  setTimeout(() => {
    const userDataFromServer = '用户数据'
    cb(userDataFromServer)
  }, 3000)
}

getCompany((data) => {
  console.log('来自Server的数据', data) // 来自Server的数据 用户数据
})
```

之后是 Promise/then 方式：

```typescript
function getCompany() {
  new Promise((resolve, reject) => {
    // 模拟请求服务
    setTimeout(() => resolve('用户数据'), 3000)
  }).then((userData) => {
    console.log('来自Server的数据', userData) // 来自Server的数据 用户数据
  })
}

getCompany()
```

最后是 async/await 方式：

```typescript
function serverRequest(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 模拟请求服务
    setTimeout(() => resolve('用户数据'), 3000)
  })
}

async function getCompany(): Promise<void> {
  let userData = await serverRequest()
  console.log('来自Server的数据', userData) // 来自Server的数据 用户数据
}

getCompany()
```

可以很明显的看到，`await` 是等待后面的异步操作完成后才返回给 `userData`。如果没有等待操作 `userData` 将会是 `undefined`。

async 函数是使用 async 关键字声明的函数。 async 函数是 `AsyncFunction` 构造函数的实例， 并且其中允许使用 await 关键字。async 和 await 关键字让我们可以用一种更简洁的方式写出基于 Promise 的异步行为，而无需刻意地链式调用 Promise。async 函数一定会返回一个 Promise 对象。如果一个 async 函数的返回值看起来不是 Promise，那么它将会被隐式地**包装在一个 Promise 中**。在所有异步解决方案中，它有以下优点：

- 级联调用：即调用依次发生的场景，比如通过书名获取一本书的作者的其它书籍信息信息：先获取作者的信息，通过作者信息查找全部的书籍信息，再通过指定的书籍信息获取具体书籍的信息。以上每一步都是异步操作且连续（当然后台可以一步到位，SQL 写的好的话 😆），使用 Promise 会使得代码非常长，而 async 却不会出现。

- 符合编写习惯： Promise 使用 then 函数进行链式调用，是一种从左向右的横向写法；async 从上到下，顺序执行，就像写同步代码一样，更符合代码编写习惯。

- 多参数传递： Promise 的 then 函数只能传递一个参数，虽然可以通过包装成对象来传递多个参数，但是会导致传递冗余信息，频繁的解析又重新组合参数，比较麻烦；async/await 没有这个限制。

- 同异步结合： 使用 Promise 的时候最好将同步代码和异步代码放在不同的 then 节点中，这样结构更加清晰；async 整个书写习惯都是同步的，不需要纠结同步和异步的区别，当然，异步过程需要包装成一个 Promise 对象放在 await 关键字后面。

这里顺便说一下 `AsyncFunction` 类型。首先它并不是一个全局对象，需要通过下面的方法来获取，具体资料参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)：

```typescript
// [Function: AsyncFunction]
Object.getPrototypeOf(async function () {}).constructor
```

执行 AsyncFunction 的时候，会创建一个**异步函数**对象。但是这种方式不如用 async 创建来的快、高效，因为第二种方式中异步函数是与其他代码一起被解释器解析的，而第一种方式的函数体是单独解析的。它还有一个用途——用来准确判断异步函数：

```javascript
console.log(function () {} instanceof asyncConstructor) // false
console.log(async function () {} instanceof asyncConstructor) // true
```

### 原理

async 函数其实就是一个语法糖，其原理就是将 Generator 函数和自动执行器包装在一个函数里，通过和 Promise 相互配合产生的效果。不难想象，既然 async 函数内部可以以同步方式执行代码，肯定有某种方式阻断执行，而这种方式就是 Generator。

在了解 Generator 之前，需要了解一下迭代器（Iterator）。

### 迭代器

迭代器（Iterator）是一种数据访问工作方式。它能为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员，如 ES6 展开符，for...of）。说到这就让我想起了数组，类似这种操作大部分都作用于数组或类数组，而数组确实可以通过原型获取 Iterator 对象：

```typescript
const iterator = Array.prototype.values()
```

通过 VScode 我们可以看到它包含 3 个方法：next()（必要）、return()（可选）、throw()（可选）：

<CenterImg src="https://res.zrain.fun/images/2022/05/iterator-437a816670de3d1f8dd0614acf064858.png" alt="Iterator" zoom="80%" invert="0" />

#### next 方法

先来看看 next 的效果：

```typescript
const arr = ['a', 'b', 'c']
const iter = arr[Symbol.iterator]()

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
iter.next() // { value: undefined, done: true }
```

不难发现：value 是每次遍历到的值，done 代表是否将该数组遍历完全。既然 Array 原型上通过 `Symbol.iterator` 方法可实现数组遍历，那么普通对象也是否可以借此达到自定义遍历功能？答案是：**可以**。

```typescript
const a = {
  num: 3,
  [Symbol.iterator]: function () {
    let self = this
    return {
      next() {
        const value = self.num++
        const done = value > 8
        return {
          // 注意完成状态需要将 value 置为 undefined
          value: done ? undefined : value,
          done
        }
      }
    }
  }
}

console.log([...a]) // [ 3, 4, 5, 6, 7, 8 ]
```

#### return 方法

此方法用于指定在迭代器提前关闭时执行的逻辑。当我们不想让遍历到的可迭代对象被耗尽时，就可以将迭代器“关闭”。可能的情况有：

- for...of 循环通过 break、continue、return 或 throw 提前退出。

- 解构操作并未消费所有值。

比如在如果在 Generator 函数返回的迭代器对象中调用 return 方法就可提前将其关闭：

```typescript
function* gen() {
  yield 'a'
  yield 'b'
  yield 'c'
}

const g = gen()

g.next() // { value: 'a', done: false }
g.return() // { value: undefined, done: true }
g.next() // { value: undefined, done: true }
```

值得注意的是，因为该方法是可选的，所以并非所有迭代器都是可关闭的，比如数组的迭代器就不可关闭。

#### throw 方法

此方法用来向生成器抛出异常，并**恢复生成器**的执行，返回带有 done 及 value 两个属性的对象：

```typescript
function* gen() {
  try {
    yield 'a'
    yield 'b'
    yield 'c'
  } catch (e) {
    console.log(e)
  }
}

const g = gen()

g.next() // { value: 'a', done: false }
// 抛出异常，本轮结束，面的 done 均标记 true
g.throw() // { value: undefined, done: true }
g.next() // { value: undefined, done: true }
```

### 生成器

生成器（Generator） 是 ES6 推出的一种新的数据类型。用法类似于定义一个函数，但有一个<strong>“\*”</strong>标识，内部可以使用 `yield` 关键字“阻断”当前函数运行，返回一个迭代器：

```typescript
function* gen() {
  yield 'a'
  yield 'b'
  return 'c'
}

g.next() // { value: 'a', done: false }
g.next() // { value: 'b', done: false }
g.next() // { value: 'c', done: true }
g.next() // { value: undefined, done: true }
```

#### yield

作用类似于 return，代表一个暂停的标志而已，yield 后面的值相当于一个阶段的值，该值会作为调用相应 next() 后对象的 value 属性的值。

yield 不会像 return 将后面的内容返回：

```typescript
function* gen() {
  let a = yield 'a'
  console.log(a) // zrain
  yield 'b'
  return 'c'
}

g.next() // { value: 'a', done: false }
g.next('zrain') // { value: 'b', done: false }
g.next() // { value: 'c', done: true }
g.next() // { value: undefined, done: true }
```

上面的例子需要关注一个点：在传入参数的时候我们应该从第二个 next 方法开始进行传入，因为第一个 next 方法是从函数内部起始开始运行的，此时最前方并没有 yield 表达式，所以第一个 next 方法中的参数并没有任何作用，如果要在开头就要传入参数，应该在生成迭代器对象时传入 Generator 函数的参数。

### 实现

前面的生成器、迭代器主要是为了实现 async 做铺垫。由 Generator 函数我们可以知道使用 yield 就可以作为函数暂停的标识，但是每次继续运行都需要手动调用迭代器的 next 方法，而 async/await 实质上就是要简化这种手动调用的方式，让 Generator 函数能够自动进行迭代。

在 async/await 还未出现之前，express 的作者 [TJ Holowaychuk](https://github.com/tj) 开发了 [co](https://github.com/tj/co) 库，其原理就是利用 Generator：

```javascript
co(function* () {
  var result = yield Promise.resolve(true)
  return result
}).then(
  (value) => console.log(value),
  (err) => console.error(err.stack)
)
```

#### 类型定义

先看一下 Iterator 和 Generator 的类型定义：

```typescript
interface Iterator<T, TReturn = any, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>
  return?(value?: TReturn): IteratorResult<T, TReturn>
  throw?(e?: any): IteratorResult<T, TReturn>
}

interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>
  return(value: TReturn): IteratorResult<T, TReturn>
  throw(e: any): IteratorResult<T, TReturn>
  [Symbol.iterator](): Generator<T, TReturn, TNext>
}
```

这里我们可以发现 Iterator 和 Generator 的关系了：Generator 是 Iterator 更具体实用的封装。其中的泛型参数含义如下：

- T：所有 yield 关键字后返回类型的联合类型。

- TReturn：return 的返回值类型，没有 return 定义为 void。

- TNext：所用通过 next() 返回值类型的联合类型，也就是 yield 返回类型的联合类型。

#### 包装函数

借助 Generator 实现之前，还需理清它和 async/await 的执行方式和返回值有什么区别：

- Generator 函数执行返回值可能不是 Promise，async 执行返回值是 Promise。

- Generator 函数需要执行相应的操作，才能等同于 async 的排队效果。

- Generator 函数执行的操作是不完善的，因为并不确定有几个 yield，不确定会嵌套几次。

至此，我的解决方式是：可以封装一个高阶函数。这个高阶函数可以**不停**的迭代直至最后的 `return` 内容返回。

可以得出一下大致结构（伪代码）：

```typescript
function myAsync(fn: Generator<any, any, unknown>) {
  // 初始化生成器
  const generator = fn()
  // 返回一个包装函数
  return function () {
    // 最后返回一个 Promise
    return new Promise(function (resolve, reject) {
      // ...
    })
  }
}

// 调用方式
const foo = myAsync(function* () {
  yield 1
  yield 2
  return 'ending'
})

foo().then((res) => console.log(res)) // ending
```

#### 生成器 next 处理

因为在 Generator 函数内 `yield` 数量未知，我们需要写一个循环处理 next()函数的调用，直至遇到 return：

```typescript
type ResolveValue<T> = T extends PromiseLike<infer V> ? V : T

function _myAsync<R, T = unknown, A extends Array<any> = Array<any>>(
  fn: (...args: A) => Generator<T, R, any>
): (...args: A) => Promise<ResolveValue<R>> {
  return function (...args: any) {
    // 初始化生成器函数
    const generator: Generator<T, R, any> = fn.apply(this, args)
    // 返回一个 Promise
    return new Promise(function (resolve, reject) {
      // next 处理下一个数据，throw 处理错误
      function processStep(key: 'next' | 'throw', arg?: any) {
        const { value, done } = generator[key](arg)
        // 如果 done 为 true，说明走完了，进行 resolve(value)
        if (done) {
          resolve(value)
        } else {
          Promise.resolve(value).then((val) => processStep('next', val))
        }
      }
      // 第一次执行
      processStep('next')
    })
  }
}
```

这里需要说明一下代码顶部的工具函数，可以帮助我们将 Promise 成功状态的类型解析出来：

```typescript
// PromiseLike 是在 ES6 中进行全局定义的定义文件，可以不用引入，这里只是说明其定义，总的来说就是一类 Promise 的实例
interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>
}

type ResolveValue<T> = T extends PromiseLike<infer V> ? V : T
```

#### 生成器 throw 处理

在等待类型为异步任务的 `value` 时难免产生错误，我们需要在 `processStep` 中进行捕获：

```typescript
function _myAsync<R, T = unknown, A extends Array<any> = Array<any>>(
  fn: (...args: A) => Generator<T, R, any>
): (...args: A) => Promise<ResolveValue<R>> {
  return function (...args: any) {
    const generator: Generator = fn.apply(this, args)
    return new Promise(function (resolve, reject) {
      function processStep(key: 'next' | 'throw', arg?: any) {
        try {
          // 将运行结果传入 next() 或 throw() 当作 yield 关键字的返回值。这里有可能会执行返回 reject 状态的 Promise
          const { value, done } = generator[key](arg)
          if (done) {
            resolve(value)
          } else {
            // 如果 done 为 false，说明没走完，还得继续走
            // value有可能是：常量，Promise，Promise 有可能是成功或者失败
            Promise.resolve(value).then(
              (value) => processStep('next', value),
              (error) => processStep('throw', error)
            )
          }
        } catch (error) {
          // 报错的话会走 catch，直接 reject
          reject(error)
        }
      }
      processStep('next')
    })
  }
}
```

#### 测试

当完成 `throw` 的逻辑后已经基本实现 async/await 的逻辑了，下面来试一试：

```typescript
function fn(nums: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}

function* gen() {
  const num1 = yield fn(1)
  console.log(num1) // 2
  const num2 = yield fn(num1)
  console.log(num2) // 4
  const num3 = yield fn(num2)
  console.log(num3) // 8
  return num3
}

const genToAsync = myAsync(gen)
const asyncRes = genToAsync()
console.log(asyncRes) // Promise
asyncRes.then((res) => console.log(res)) // 8
```

验证成功！

### 参考

[async 函数 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

[实现一个 async/await （typescript 版） - 掘金](https://juejin.cn/post/6913393501262577672)

[co.js - Github](https://github.com/tj/co/blob/master/index.js)
