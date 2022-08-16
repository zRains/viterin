---
toc: false
date: 1649942694484
title: '理解一下CommonJS和ES Modules'
scope: ['Node']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

两种规范都是为了解决 JS 脚本直接导入才能的诸多问题。

1. 解决变量污染问题，每个文件都是独立的作用域，所以不存在变量污染。
2. 解决代码维护问题，一个文件里代码非常清晰。
3. 解决文件依赖问题，一个文件里可以清楚的看到依赖了那些其它文件。

## CommonJS

使用`module.exports`就进行变量导出，包括函数，类：

```js
// 导出一个类
class zrain {}
module.exports.foo = zrain

// 导出一个对象
module.exports = {
  name: 'zrain'
}

// 导出任意值
module.exports.name = 'zrain'
module.exports.sex = 1
module.exports.age = 21
```

可省略`module`关键字：

```js
exports.name = 'zrain'
exports.sex = 1
```

注意：使用单个导出后就不能导出单个对象：

```js
// tag1会被之后导出的对象覆盖，变更为undefined
module.exports.tag1 = 'tag1'
module.exports = {
  noTag: 'none'
}
module.exports.tag2 = 'tag2'
module.exports.tag3 = 'tag3'
```

混合导出，`exports`和`module.exports`可以同时使用，不会存在问题：

```js
exports.name = 'zrain'
module.exports.age = 21
```

使用`require`进行导入时使用解构语法：

```js
// test.js
module.exports.tag2 = 'tag2'
module.exports.tag3 = 'tag3'

// test2.js
const { tag2 } = require('./test')
console.log(tag2) // tag2

const data = require('./test')
console.log(data) // { tag2: 'tag2', tag3: 'tag3' }
```

不管是`CommonJs`还是`Es Module`都不会重复导入，就是只要该文件内加载过一次这个文件了，我再次导入一次是不会生效的。

```js
let data = require('./index.js')
let data = require('./index.js') // 不会在执行了
```

CommonJS 支持动态导入：

```js
let lists = ['./index.js', './config.js']
lists.forEach((url) => require(url)) // 动态导入
```

commonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化不会影响到这个值：

```js
// common.js
let count = 1
let printCount = () => {
  return ++count
}
module.exports = {
  printCount: printCount,
  count: count
}
// index.js
let v = require('./common')
//commonJS是值的拷贝，可以进行修改
console.log(v.count) // 1
console.log(v.printCount()) // 2
console.log(v.count) // 1
```

可以通过闭包或者`getter`实现属性共通：

```js
// common.js
let count = 1
let printCount = () => {
  return ++count
}
module.exports = {
  printCount: printCount,
  get count() {
    /*改写*/
    return count
  }
}
// index.js
let v = require('./common')
//commonJS是值的拷贝，可以进行修改
console.log(v.count) // 1
console.log(v.printCount()) // 2
console.log(v.count) // 2
```

## ES Mudule

在 Es Module 中导出分为两种，单个导出(export)、默认导出(export default)，单个导出在导入时不像 CommonJs 一样直接把值全部导入进来了，Es Module 中可以导入我想要的值。那么默认导出就是全部直接导入进来，当然 Es Module 中也可以导出任意类型的值。

```js
// 导出变量/函数
export const name = 'zrain'
export let age = 18

// 导出函数
export function foo() {}

// 导出类
export class Zrain {}

// ts
export type fooType = {}
export interface foo2Type {}

// 默认导出
export default {}
```

`Es Module`使用的是`import`语法进行导入。如果要单个导入则必须使用花括号`{}` 。注意：这里的花括号跟解构不一样，是固定语法。

```js
// test.js
export const name = 'zrain'
export const age = 21

// test2.js
import { name, age } from './test.js'
console.log(name, age) // "zrain" 21

// 如果里面全是单个导出，我们就想全部直接导入则可以这样写
import * as all from './test.js'
console.log(all) // {name: "zrain", age: 21}
```

`export`导出的值是值的引用，并且内部有映射关系，这是`export`关键字的作用。而且导入的值，不能进行修改也就是只读状态。

```typescript
// test.ts
export let num = 0
export function add() {
  ++num
}

// test2.ts
import { num, add } from './test'
console.log(num) // 0
add()
console.log(num) // 1
num = 10 // 报错
```

ES Module 没有动态导入：

```typescript
if (true) {
  import xxx from 'XXX' // 报错
}
```

## Refer

[聊聊什么是 CommonJs 和 Es Module 及它们的区别](https://blog.csdn.net/weixin_44165167/article/details/114688927)

[commonJS 和 ESmodules 差异](https://zhuanlan.zhihu.com/p/219806376)
