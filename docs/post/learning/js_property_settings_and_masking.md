---
toc: false
date: 1664786919794
title: 'JS属性设置和屏蔽'
scope: ['JS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

![js_property_mask_banner_img](https://res.zrain.fun/images/2022/10/js_property_mask_banner_img.png)

在阅读[《你不知道的 JavaScript（上卷）》](https://awesome-programming-books.github.io/javascript/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%EF%BC%88%E4%B8%8A%E5%8D%B7%EF%BC%89.pdf)时发现了一个被自己忽略的一个问题：当给一个对象赋值时，如果对象没有这个属性但其原型链上存在此属性，那么在执行 LHS 查询时是否会将赋值操作应用到原型链上？

### 分析

从问题的答案简单来看只有两种：

1. 对象的原型链上的相应属性被改变；
2. 对象本身添加一个新的属性并进行赋值。

当然，我们可以尝试一下，毕竟我们可以创造这个条件 🤔。先从最简单的开始，对象本身和其原型链上都没有这个属性：

```javascript
const obj = {
  fruit: 'apple',
  size: 5
}

obj.color = 'red'
console.log(obj) // { fruit: 'apple', size: 5, color: 'red' }
```

答案肯定复合我们的预料：在执行 LHS 时发现 `color` 这个属性并不存在，于是添加了一个新的上去。接下来我们设置一下 `obj` 的原型：

```javascript
// ...

Object.setPrototypeOf(obj, {
  color: 'green'
})

obj.color = 'red'
console.log(obj) // { fruit: 'apple', size: 5, color: 'red' }
console.log(Object.getPrototypeOf(obj)) // { color: 'green' }
```

可以发现，此操作仍然是在 obj 本身添加了一个新属性，而且原型上的属性并没有被改变。难道原型链上的同名属性不会对属性赋值产生影响吗？我们知道，影响一个属性有三个配置，分别是：writable、enumerable、configurable，这些可以使用 `defineProperty` 定义。当 writable 为 `false` 时属性将无法改变。这时可以提出一个问题：如果原型链上的同名属性的 writable 设置为 `false` 会不会对之后的对象赋值产生“蒙骗”效果？

```javascript
// ...

Object.setPrototypeOf(
  obj,
  Object.defineProperty({}, 'color', {
    configurable: true,
    enumerable: true,
    writable: false,
    value: 'green'
  })
)

obj.color = 'red'
console.log(obj) // { fruit: 'apple', size: 5 }
console.log(Object.getPrototypeOf(obj)) // { color: 'green' }
```

可以看到什么事也没有发生，而且如果在严格模式下会报错，说明此操作静默失败。接下来我们试试在原型链上添加访问修饰符（也就是 getter/setter）会发生什么：

```javascript
// ...

const obj_proto = {
  _color: ''
}

Object.defineProperty(obj_proto, 'color', {
  set: function (val) {
    console.log('exec setter!') // exec setter!
  },
  get: function () {}
})

Object.setPrototypeOf(obj, obj_proto)

obj.color = 'red'
console.log(obj) // { fruit: 'apple', size: 5 }
console.log(Object.getPrototypeOf(obj)) // {}
```

对象依旧没有被赋值，而且原型的 getter 被触发了，说明只是执行了一下 getter。

### 屏蔽

由于原型链的关系，产生了对象与原型链的一种独特关系：屏蔽。

> 如果属性名既出现在 obj 中也出现在 obj 的 [[Prototype]] 链上层，那么就会发生屏蔽。obj 中包含的 color 属性会屏蔽原型链上层的所有 color 属性，因为 obj.color 总是会选择原型链中**最底层**的 color 属性。

<small>\* 摘自《你不知道的 JavaScript（上卷）》 第五章 P144 有修改</small>

产生屏蔽意味我们不能简单的通过“对象.属性名”来修改原型链上面的同名属性。借助屏蔽和上面的分析结果，我们可以很好的印证下面的结论：

1. 如果在 [[Prototype]] 链上层存在名为 obj 的普通数据访问属性并且没有被标记为只读（writable:true），那就会直接在 obj 中添加一个名为 color 的新属性，它是**屏蔽属性**。
2. 如果在 [[Prototype]] 链上层存在 color，但是它被标记为只读（writable:false），那么无法修改已有属性或者在 obj 上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在 [[Prototype]] 链上层存在 color 并且它是一个 setter，那就一定会调用这个 setter。color 不会被添加到（或者说屏蔽于）obj，也不会重新定义 color 这个 setter。

<small>\* 结论摘自《你不知道的 JavaScript（上卷）》 第五章 P145 有修改</small>

当然，如果希望在 2、3 条件下建立屏蔽属性可以使用 `Object.defineProperty(...)` 。

这里还有一个疑问：为什么 obj 对象会因为另一个对象中的同名只读属性而无法创建新的属性（结论 2）？我们可以猜测一下什么时候会用到这个特殊的机制？

没错，这个机制就是 -> **类的继承**。对于真正的符合类设计模式的语言来说（java 等），继承就是将属性复制到子类中，也就是说：如果父类属性中的属性经过 `readonly` 修饰复制到子类中时，子类也是无法更改这个属性的。

### 隐式产生屏蔽

书中给出了一个比较坑的题，但熟悉以上结论就可以很好的分析出原因：

```javascript
var anotherObject = {
  a: 2
}
var myObject = Object.create(anotherObject)
anotherObject.a // 2
myObject.a // 2

anotherObject.hasOwnProperty('a') // true
myObject.hasOwnProperty('a') // false
myObject.a++ // 隐式屏蔽！
anotherObject.a // 2
myObject.a // 3
myObject.hasOwnProperty('a') // true
```

在执行 `myObject.a++` 操作时，可以等同执行下面代码：

```javascript
myObject.a = myObject.a + 1
```

首先进行 RHS 操作获取 `a` 的值，在原型链上找到了，为 2，之后等同于执行下面代码：

```javascript
myObject.a = 3
```

由于原型链上的 `a` 属性是可写的，于是在对象本身上产生一个同名的**屏蔽属性**，之后在操作这个属性就不会影响待原型链上的属性了。
