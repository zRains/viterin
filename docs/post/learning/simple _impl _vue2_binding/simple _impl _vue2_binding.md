---
date: 1660720086027
title: '简单实现vue的双向绑定'
scope: ['JS', 'Vue']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

双向绑定一直是 Vue 的核心内容，是 MVVM 框架学习不可缺少的一环，今天就来实现一下 Vue2 版本的双向绑定。内容包括：数据驱动视图，视图驱动数据。

## 什么是双向绑定？

说白话就是内部数据改变，会自动使与之关联的视图（DOM）更新，再也不需要我们手动使用 `dom.nodeValue = 'xxx'` 类似的操作来更新。与之相应，如果视图上的数据发生改变，如输入框的值被改变，内部的属性值也会改变，不需要我们手动搜集，这极大的方便了开发。

因为 Vue 是数据双向绑定的框架，而整个框架的由三个部分组成：

1. 数据层（Model）：应用的数据及业务逻辑，为开发者编写的业务代码；
2. 视图层（View）：应用的展示效果，各类 UI 组件，由 template 和 css 组成的代码；
3. 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来。

所以实现双向绑定重点在搞清楚业务逻辑层到底干了什么。

## 原理

下面是来自 Vue 官方的一张解释双向绑定的原理图：

![binding_data](https://012.vuejs.org/images/data.png)

我们可以分析出三个重要部件：

1. 依赖收集器；
2. 观察者；
3. 更新回调。

其大概流程：初始化时 `Watcher`，也就是观察者，将属性带入到依赖收集器。属性一旦发生更新就会 `Notify` 通知观察者，观察者进一步通过回调改变视图或者数据。

## 实现

废话不多说，先来搭建一个简单的模板：

```html
<div id="app">
  {{ banner }} {{ addr.school }}
  <hr />
  <div class="container">
    <div class="name">your name: {{ name }}</div>
  </div>
  <input type="text" v-model="addr.school" />
  <div class="info">school: {{ addr.school }} home: {{ addr.home }}</div>
</div>

<script>
  // 后续继续使用 mv 代表 MyVue 的实例
  const mv = new MyVue({
    el: 'app',
    data: {
      banner: 'MyVue',
      banner2: 'hcsdbiyebv',
      name: 'zrain',
      addr: {
        school: 'CUIT',
        home: 'None'
      }
    }
  })
</script>
```

可以看见模板里有 Vue 的模板插值语法，同时有一个带有 `v-model` 属性的输入框，用于之后视图驱动数据的验证。Js 部分是 Vue2 初始化的模板，目标元素为 `app`，之后传入了一系列待「收集」的属性。

### 初始化实例

实现基本的 Vue 构造：

```javascript
class MyVue {
  constructor(opt) {
    this.$opt = opt
    observerData(this.$opt.data) // 依赖收集
    processApp(this.$opt.el, this) // 处理DOM
  }
}
```

依赖收集功能之后处理，我们先来处理 DOM，也就是将 `data` 内的数据应用到插值语法内。

### 处理 DOM

对于 MVVM 框架，DOM 改变是经常的事，因此要将所有的节点收集起来方便控制：

```javascript {2}
/**
 * 处理dom
 * @param {string | HTMLElement} rootEl 挂载根节点
 * @param {MyVue} vm MyVue实例
 */
function processApp(rootEl, vm) {
  // 新建DOM碎片，用来缓存所有节点
  const domFragment = document.createDocumentFragment()
  // 将根节点绑定到 $el 属性上方便后续节点重新挂载
  vm.$el = typeof rootEl === 'string' ? document.getElementById(rootEl) : rootEl
  // 将节点全部添加到碎片节点
  while (vm.$el.firstChild) domFragment.appendChild(vm.$el.firstChild)

  // ------------
  // 处理插值语法，建立数据响应
  domFragment.childNodes.forEach(processTextNode)
  // ------------

  // 重新挂载
  vm.$el.appendChild(domFragment)
}
```

这里需要注意的是如果没有最后一行重新挂载，页面上是没有 `app` 根节点的。这是 `appendChild` 方法造成的。具体原因可以看[这里](/note/#关于-appendchild)。

接下来就是针对插值语法了，因为插值语法出现在文本节点内，因此需要筛选出文本节点。通过正则表达式判断我们是否需要处理：

```javascript
/**
 *处理文本节点
 * @param {Node} node
 */
function processTextNode(node) {
  // 文本节点类型值为 3
  if (node.nodeType === 3) {
    const nodeValue = node.nodeValue
    // 判断是否存在插值表达式语法
    const reg = /\{\{\s*(\S+)\s*\}\}/g

    // 因为同一个文本节点可能出现多个插值语法，需要每个都进行替换
    node.nodeValue = nodeValue.replace(reg, (_, key) => {
      // resolveData 方法是通过路径（addr.home）获取实例内的值。后续会说明
      return resolveData(vm.$opt.data, key)
    })
  }

  // 递归之重中之重，我们需要便利 app 根节点下的每个文本节点
  node.childNodes.forEach(processTextNode)
}
```

这一步之后页面内的插值语法就会成功替换为 `vm.$opt.data` 内相应的值了。但这些是远远不够的，接下来我们开始处理数据驱动视图部分。

这里说明一下 `resolveData` 方法：通过路径返回所指向对象的值，巧妙的借用了一下 `reduce`：

```javascript
/**
 * 解析目标对象路径值
 * @param {Object} data 目标对象
 * @param {string} path 数据路径
 */
function resolveData(data, path) {
  const pathArr = path.split('.')

  return path.length === 0 ? data : pathArr.reduce((originalData, path) => originalData[path], data)
}
```

### 处理 data

了解过 Vue2 应该知道其内部是通过 `Object.defineProperty` 实现数据变化监听的，我们对其同样处理：

```javascript
/**
 * 观察数据
 * @param {Object} data 待观察数据
 */
function observerData(data) {
  if (!data || typeof data !== 'object') return data
  Object.keys(data).forEach((key) => {
    // 使用递归保证每个属性都会被监听
    let value = observerData(data[key])
    Object.defineProperty(data, key, {
      // 可枚举
      enumerable: true,
      // 可配置
      configurable: true,
      set(newValue) {
        // 对新数据同样进行处理
        value = observerData(newValue)
      },
      get() {
        return value
      }
    })
  })

  return data
}
```

在控制台我们可以看一下是否设置成功（部分展示）：

![](https://res.zrain.fun/images/2022/08/ref_values.png)

我们可以看到所有属性，包括嵌套的都被设置了 getter 和 setter，表明监听成功。

### 观察者与依赖收集器

很明显 Vue2 这里用了观察者模式，我们也可以简单实现一个：

```javascript
class Notifier {
  constructor() {
    this.watcherList = []
  }

  /**
   * 新增订阅者
   * @param {Watcher} watcher 订阅者
   */
  addWatcher(watcher) {
    this.watcherList.push(watcher)
  }

  /**
   * 通知订阅者
   */
  notify() {
    // 通知每个观察者进行更新
    this.watcherList.forEach((watcher) => watcher.update())
  }
}

class Watcher {
  constructor(vm, key, callback) {
    // MyVue实例
    this.vm = vm
    // 观察的属性名
    this.key = key
    // 通知回调
    this.callback = callback
  }

  update() {
    // 获取新值
    const newValue = resolveData(this.vm.$opt.data, this.key)
    this.callback(newValue)
  }
}
```

之后就非常明确了，我们需要将每个 `vm.$opt.data` 里面的内容送到 `Notifier` 里。首先要找对设置的位置，很明显，我们需要在处理文本节点时将时将其收集。

```javascript
function processTextNode(node) {
  // ...

  node.nodeValue = nodeValue.replace(reg, (_, key) => {
    // 添加新的监听者，newValue可用可不用，这里图方便直接从 vm.$opt.data 取
    new Watcher(vm, key, (newValue) => {
      node.nodeValue = nodeValue.replace(reg, (_, key) => resolveData(vm.$opt.data, key))
    })
    return resolveData(vm.$opt.data, key)
  })

  // ...
}
```

其实这个处理方式是不太符合原版的，只考虑到插值语法的属性收集。接下来我们需要将这个 Watcher 添加到 Notify 里面，这里就要仔细考虑 Notify 实例化的位置和添加的时机。这里有两种做法：

1. 在全局或者 MyVue 构造里定义 Notify，之后每当一个 Watcher 被实例化就添加到 Notify 中，这样做的缺点是当 `mv.$opt.data` 内任何一个属性改变是，会触发所有依赖的回调。
2. `mv.$opt.data` 中每个对象一个 Notify 实例，互不影响。这样做的缺点是当嵌套的属性过多将会有大量 Notify 被实例化。

选择那个就要自己权衡了，这里我用第二种方式。实现方式有点巧妙，这也体现了 Js 语言的优势：

```javascript
function observerData(data) {
  // ...

  const notifier = new Notifier()

  Object.keys(data).forEach((key) => {
    let value = observerData(data[key])
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      set(newValue) {
        value = observerData(newValue)
        // 当属性改变时通知这个 Notify 实例内的所有观察者
        notifier.notify()
      },
      get() {
        // 添加观察者到 Notifier
        Notifier.temp && notifier.addWatcher(Notifier.temp)
        return value
      }
    })
  })

  return data
}

class Watcher {
  constructor(vm, key, callback) {
    // ...

    // 添加 Watcher 挂载到 Notifier 的 temp 静态属性上
    Notifier.temp = this
    // 访问属性，触发属性的 getter，我们在 getter 内做手脚
    resolveData(vm.$opt.data, key)
    // 这里主要防止重复添加，多一个保险
    Notifier.temp = null
  }
}
```

到这一步后我们就可以改变内部属性达到更改视图的功能了：

<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 16px;"><video style="width: 100%;" preload muted autoplay loop src="https://res.zrain.fun/images/2022/08/impl_binding.mov"></video></div>

接下来就是实现双向绑定的最后一步了：视图改变数据。

### 绑定与监听

我们需要获取设置了 `v-model` 属性的节点，自然想到我们可以在 `processTextNode` 方法中处理：

```javascript
function processTextNode(node) {
  // ...

  // 一般情况下 v-model 只会出现在 INPUT，TEXTAREA 标签中，这里简化处理
  if (node.nodeType === 1 && node.nodeName === 'INPUT') {
    // 通过 attributes 和 getNamedItem 获取 v-model 所绑定的属性
    const vModel = node.attributes.getNamedItem('v-model')

    if (vModel) {
      // 将属性值填写到输入组件中
      node.value = resolveData(vm.$opt.data, vModel.nodeValue)
      // 添加观察者
      new Watcher(vm, vModel.nodeValue, (newValue) => {
        node.value = resolveData(vm.$opt.data, vModel.nodeValue)
      })
      // 监听输入事件
      node.addEventListener('input', function (e) {
        const args = vModel.nodeValue.split('.')
        const perVal = resolveData(vm.$opt.data, args.length <= 1 ? '' : args.slice(0, args.length - 1).join('.'))
        perVal[args[args.length - 1]] = e.target.value
      })
    }
  }

  // ...
}
```

在 `addEventListener` 中需要注意我们要取倒数第二个属性。到这里就基本复刻了 Vue2 的基础功能之一：双向绑定。下面是效果图：

<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 16px;"><video style="width: 100%;" preload muted autoplay loop src="https://res.zrain.fun/images/2022/08/impl_binding_2.mov"></video></div>

下面是完整代码以及 Demo：

<iframe src="https://codesandbox.io/embed/impl-vue2-binding-cerybq?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="impl_vue2_binding"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
