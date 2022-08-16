---
toc: false
date: 1649942694485
title: 'JS中this的绑定'
scope: ['JS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

## 前提

**this**的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定，this 最终指向调用它的对象。在用执行上下文解释中：当函数将要执行时，会为此函数创建执行上下文，在创建词法环境时确定 this 指向。当这个函数在全局环境下直接调用，调用这个函数自然是 window（浏览器下）了，于是，这个函数的 this 便是 window。

## 类型

### 函数调用模式

当一个函数并非一个对象的属性时，那么它就是被当做函数来调用的。在此种模式下，this 被绑定为全局对象，在浏览器环境下就是[window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/window)对象：

```js
function foo() {
  console.log(this)
}

foo() // window
```

### 方法调用模式

当函数被保存为一个对象的属性时，它就可称为这个对象的方法。当一个方法被调用时，this 被绑定到这个对象上。如果调用表达式包含一个提取属性的动作（. 或 []），那么它被称为方法调用：

```js
const obj = {
  name: 'zrain',
  foo: function () {
    console.log(this.name)
  }
}

obj.foo() // zrain
```

换一种方式就不一样了，call 是全局变量，这样相当于在 window 下直接调用`foo`。

```js
const obj = {
  name: 'zrain',
  foo: function () {
    console.log(this.name) // undefined
    console.log(this) // window
  }
}

const call = obj.foo
call()
```

### 构造函数调用模式

如果在一个函数前面加上 new 关键字来调用，那么就会创建一个连接到该函数的 prototype 成员的新对象，同时，this 会被绑定到这个新对象上。这种情况下，这个函数就可以成为此对象的构造函数。

```js
function foo() {
  console.log(this)
}

const a = new foo() // foo {}
```

当用 new 关键字，返回的是一个对象，this 指向的就是那个返回的对象；如果返回的不是对象，this 还是指向函数的实例，虽然 null 属于对象，但是返回 null 依然指向函数实例：

```js
// 返回对象，如上述所说，null，function，匿名函数，Array也属于这种情况
function foo() {
  this.name = 'zrain'
  return {
    name: 'adsd'
  }
}

const a = new foo()
console.log(a.name) // adsd

// 当返回的是基本值，包括undefined
function foo() {
  this.name = 'zrain'
  return 'wtf?'
}

const a = new foo()
console.log(a.name) // zrain
```

### apply 和 call 调用模式

JS 中，函数也是对象，所有函数对象都有两个方法：apply 和 call，这两个方法可以让我们构建一个参数数组传递给调用函数，也允许我们改变 this 的值：

```js
var name = 'window'
var obj = {
  name: 'obj'
}

function foo() {
  console.log(this.name)
}

foo() // window
foo.apply(obj) // obj
foo.call(obj) // obj
foo.call() // window
foo.call() // window
```
