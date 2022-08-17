---
doc: false
date: 1652886203165
title: '简单实现 call/bind/new'
order: 1
visible: true
lang: 'zh'
layout: 'doc'
---

### call

```javascript
Function.prototype.myCall = function (context, ...args) {
  // 判断是否为有效上下文，不是则取全局（window）
  const c = context || window
  // 利用 Symbol 生成全局唯一的一个键
  const fnSymbol = Symbol()
  // 将 fn 挂载到指定上下文中
  c[fnSymbol] = this
  // 通过在上下文中调用即可更改 fn 上下文
  c[fnSymbol](...args)
  delete c[fnSymbol]
}
```

### apply

和 `call` 实现差不多，只不过将传入的参数换为数组。

```javascript
Function.prototype.myApply = function (context, args) {
  const c = context || window
  const fnSymbol = Symbol()
  c[fnSymbol] = this
  c[fnSymbol](...args)
  delete c[fnSymbol]
}
```

### bind

bind 特点：

- 函数调用，改变上下文。

- 返回一个绑定指定上下文的函数。

- 接收多个参数（这一点类似于 call）。

- 支持柯里化形式传参。

```javascript
Function.prototype.myBind = function (context, ...args) {
  context = context || window
  const fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  return function (..._args) {
    args = args.concat(_args)
    context[fnSymbol](...args)
    delete context[fnSymbol]
  }
}
```

### new

寄生组合式构建：

```javascript
function myNew(constructor, ...args) {
  // 新建一个空的 Object 对象
  const newObj = new Object()
  // 构造一个中间函数
  const F = function () {}
  // 将中间函数的原型设置为目标原型
  F.prototype = constructor.prototype
  //  将新对象的 __proto__ 指向中间函数
  newObj.__proto__ = new F()
  const ret = constructor.apply(newObj, arguments)
  return typeof ret === 'object' ? ret : newObj
}
```
