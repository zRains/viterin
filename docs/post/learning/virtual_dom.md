---
date: 1650601098818
title: '简单实现Virtual DOM'
scope: ['JS', 'browser']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<CenterImg src="https://res.zrain.fun/images/2022/04/Virtual%20DOM-1466bad2aa13335eb14901523f771623.png" alt="Virtual DOM" zoom="38%" />

在 Vue、React 等各种工业级前端框架中我常会听到 Virtual DOM 这一概念，在看 mini-vue 源码时对其有一些了解但不够细致。借此机会详细了解一下它的作用，并简单实现一个 Virtual DOM。

## 它是什么？

虚拟 DOM（Virtual DOM，以下简称 vdom）是 JS 按照 DOM 的结构来创建的虚拟树型结构对象，是对 DOM 的一个抽象，但比 DOM 更加轻量型。vdom 上的一个节点称为虚拟节点（Virtual Node，以下简称 vnode），它实际上对应真实 DOM 中的一个节点。我们可以看一下一个真实的节点对象包含哪些属性：

```javascript
const node = document.getElementById('binaryBox')

const getAllProperties = (e, props = []) =>
  e.__proto__
    ? getAllProperties(e.__proto__, props.concat(Object.getOwnPropertyNames(e)))
    : [...new Set(props.concat(Object.getOwnPropertyNames(e)))]

console.log(getAllProperties(node))
```

![dom的属性](https://res.zrain.fun/images/2022/04/dom%E7%9A%84%E5%B1%9E%E6%80%A7-832660ee6d226076f4650c958de925a2.png)

我们可以看到一个真实节点足足有近 300 个属性。而一个 vnode 可以表示为如下结构：

```javascript
const dom = {
  // 选择器
  sel: 'div',
  // 数据
  data: {
    class: { container: true }
  },
  // DOM
  elm: undefined,
  // 和 Vue :key 一样是一种优化
  key: undefined,
  // 子节点
  children: []
}
```

显然简洁许多，这也是操作 vdom 的性能比操作原生 DOM 性能好的原因之一。

## 为什么要使用 vdom？

1. 前端优化方面，避免频繁操作 DOM，频繁操作 DOM 会可能让浏览器回流和重绘，性能也会非常低，还有就是手动操作 DOM 还是比较麻烦的，要考虑浏览器兼容性问题，当前 jQuery 等库简化了 DOM 操作，但是项目复杂了，DOM 操作还是会变得复杂，数据操作也变得复杂。
2. 并不是所有情况使用 vdom 都提高性能，是针对在复杂的的项目使用。如果简单的操作，使用 vdom,要创建 vdom 对象等等一系列操作，还不如普通的 DOM 操作。
3. vdom 可以实现跨平台渲染，服务器渲染 、小程序、原生应用都使用了 vdom。
4. 使用 vdom 改变了当前的状态不需要立即的去更新 DOM 而且更新的内容进行更新，对于没有改变的内容不做任何操作，通过前后两次差异进行比较。
5. vdom 可以维护程序的状态，跟踪上一次的状态。

可见 vdom 的强大之处。

## snabbdom 介绍

snabbdom 是一个开源的项目，Vue 里面的 vdom 当初是借鉴了 snabbdom，我们可以通过了解其 vdom 来理解 Vue 的 vdom。

### 简单使用

```javascript
// 导入 snabbdom
import { h, init, thunk } from 'snabbdom'
// init() 方法返回一个 patch 函数 用来比较两个 vdom 的差异然后更新到真实的 DOM 里
// 这里暂时传入一个空数组 []
let patch = init([])
// h 方法是用来创建 vdom
// 第一个参数是 vdom 标签
// 第二个参数是 vdom 的数据
// 第三个参数是 vdom 的子虚拟 DOM
// 它有好几种传参方式 h 函数做了重载这里就用上面的传参
// 而且可以进行嵌套使用
let vnode = h('div#box', '测试', [h('ul.list', [h('li', '我是一个li'), h('li', '我是一个li'), h('li', '我是一个li')])])
// 获取到 html 的 div#app
let app = document.querySelector('#app')
// 用来比较两个 vdom 的差异然后更新到真实的 DOM 里
let oldNode = patch(app, vnode)
// 再来模拟一个异步请求
setTimeout(() => {
  let vNode = h('div#box', '重新获取了数据', [
    h('ul.list', [h('li', '我是一个li'), h('li', '通过path判断了差异性'), h('li', '更新了数据')])
  ])
  // 再来进行比较差异判断是否更新
  patch(oldNode, vNode)
}, 3000)
```

过了 3 秒进行对比 vdom 的 差异来添加到真实 DOM ，这里改变了第二个和第三个 li 用 h 函数渲染成 vdom 和 oldNode 不一样所以进行了对比更新。

### 模块

| 模块名         | 简介                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| attributes     | DOM 自定义属性，包括两个布尔值 `checked` `selected`，通过`setAttribute()` 设置 |
| props          | 是 DOM 的 property 属性，通过 `element[attr] = value` 设置                     |
| dataset        | 是 `data-` 开头的属性 data-src...                                              |
| style          | 行内样式                                                                       |
| eventListeners | 用来注册和移除事件                                                             |

## vdom 转换

在 snabbdom 中，vdom 的初始化由`h`函数完成，我们来看一个转换前后对比：

**真实 DOM 结构**

```html
<div class="container">
  <p>Real DOM</p>
  <ul class="list">
    <li>1</li>
    <li>2</li>
  </ul>
</div>
```

**vdom**

<details>
<summary>展开转换后的 vdom 代码</summary>

```javascript
const vd = {
  // 选择器
  sel: 'div',
  // 数据
  data: {
    class: { container: true }
  },
  // DOM
  elm: undefined,
  // 和 Vue :key 一样是一种优化
  key: undefined,
  // 子节点
  children: [
    {
      elm: undefined,
      key: undefined,
      sel: 'p',
      data: { text: '哈哈' }
    },
    {
      elm: undefined,
      key: undefined,
      sel: 'ul',
      data: {
        class: { list: true }
      },
      children: [
        {
          elm: undefined,
          key: undefined,
          sel: 'li',
          data: {
            text: '1'
          },
          children: undefined
        },
        {
          elm: undefined,
          key: undefined,
          sel: 'li',
          data: {
            text: '1'
          },
          children: undefined
        }
      ]
    }
  ]
}
```

</details>

在之前提到的 snabbdom 中 patch 方法就是对新的 vdom 和老的 vdom 进行 diff（精细化比较）。

而不是像原生操作 DOM 把所有的 DOM 都拆掉然后全部重新渲染。

## 实现一个简单的 snabbdom

### patch 函数

在 snabbdom 中我们通过 init() 返回了一个 patch 函数，通过 patch 进行吧比较两个 vdom 然后添加的真实的 DOM 树上，中间比较就是我们等下要说的 Diff。

先来了解下 patch 里面做了什么：

<CenterImg src="https://res.zrain.fun/images/2022/06/patch_process-bf99050847114b2cc010c9edc25d79d7.png" alt="patch_process" source="https://app.diagrams.net/#R7V1dk6I4FP01PI4FBAI8%2BrlTNTs7XdVbuz1PWwhR2UZiIba6v34TvjHYja0kdk%2FmoYdcQiTk5JybmysqYLw%2B%2FBa7m9V37KNQ0VX%2FoICJouua7ujkP2o5ZhbowMywjAM%2Fr1QZHoP%2FUG5Uc%2Bsu8NG2UTHBOEyCTdPo4ShCXtKwuXGM981qCxw2P3XjLhFjePTckLX%2BHfjJKrPaulXZv6JguSo%2BWYNOdmbtFpXznmxXro%2F3NROYKmAcY5xkR%2BvDGIX04RXPJbtuduZseWMxipIuF3x7tv75Mvk2WX89HMzF2npaHv0vWj482%2BRY9Bj55AHkRRwnK7zEkRtOK%2BsoxrvIR7RZlZSqOr9jvCFGjRj%2FRUlyzEfT3SWYmFbJOszPokOQPNHLB2Ze%2Blk7MznkLaeFY15Y4CiZuesgpIbvKI6DPSKPGMX5uUe8iz36caskIdjQTTAkf8jToH9ohe1gifEyRO4m2A48vE5PeNu06myRtUwOW9vOOqKldxj5Q4orUp6H2Hv%2BcxVEmXkWhGUHoyQ%2B1npIiz%2BLXtFC1ce0VHQyGww6AmcHOTdti%2B6eHdl8srjxEiWv1YMlFskkRniNyA2RC2MUuknw0rwRN59Ny7JeeekDDsgt6mo%2B83XVGTgaLP9ZRtbCsZgnarPF7D7zRioUk4PaXVWmFNuX4Dz7tBc33OU9enATb8WAvwnt%2FSpI0OPGTR%2F0nhBcE8bCIEmANsYhjtN7Bp6P5vac2LdJjJ9R7QyAwAF%2BiasXFCfo8DqyWCAUF1hqYwSNvLivsWJuWtUI0VDPI6cxyJeOKIQimUur8VbFYu3MRQsPKA5Iv%2BnwVdP%2BqV6otfQKQXwoFrwhm9kd2QyaV7LZVZi0GZZhMFrDUhu7ECdhQ4vBFo93c0S6Mpq73vMyBe6PXRIGEcovJ1WG0TJtVzPvCBon7LRYeJ7j8GYnSzc70ZPVFz05DBQmwWLBwIH0OGkyTPMxRZiOd%2BOZ5iY3DJZkyk088oTScaDPLyCO6zA%2FsQ58PyW9Npw1ifBeoHMLINhmEwiABYLZAgS9LyBorOtBWPJTOB50ante31PbsJtTW%2Bs4tXvzPApE3b%2FncS%2Fzmre3oBldFz9noMfHXShus%2B4vTE1lpCo2jLCPlKmtjCbKcEyt9kxxbGVqKCNiHNJTRFUdcgAVe6Q4M2qxh4pNmrDo35HzKTjG85BJdLNnjgHgbY7RVJ4kU2L97klGLmUuJCfYlZwMkeSkGyIBeElk8L3BNgnAtwBoCVVHyKgjDv2%2FUmHUYUiXTfOYHC3pEZVBIo%2FDGZVKR1WG8EqpXOH1fLe9Y5l8a9W9WNh276tuAwwAaCqnxsYFtaIOl5W3LjQwKImrR%2BKyuhKXLZK4AEsn0nX7tQAIrt1Uu045rfPKmamiPY3Q%2Fj1SmlrscdGMukVhatSJ8RkdpY6%2BT0c1Z%2BA0%2FjU0tQxO1jW1LeTl9KapQint06YJ3JKauu6QaY5IajKA1MZfHICGLlQb2T3avrSRWkhNsrqkcVxNGbIhPSmPneRR1xt6CMwWPbQgRz0EQqOzco3ZI405HWmslsMpQkc%2FzB6k1NGeAGgI3R4obrOmo5fJJrGMFdtJE2DopqemONM0QktOW1Io3xmPNQZ2Mx5bZk804rEta0e7N60U6vLz0Mq0dJrheS9A5M1fRaziTf4SGqM1WYqR%2Bvlr4c8UGqMtbvNa%2FfRWQeiTpyQ19GaLzZNYrNXQU6i2ZAZBrnrKIuePH8xgy8TiGycWl99ILByrliCEwTOxGOgSB3eAA9MyBiwl8EUCm0f6c%2FooocAbCtBpAYLBEQgF6qRX%2B9m8WtA1Zw8IzdkDbM5emrtOfFdVmTo0D29opL6rRT3Uljy8NteXpr5n7ZjK0EwvhzRLXma83y7jXTdEZ7wDNmtFflHqmi9KtQ0p1y9KGayHKkf0mkkKLMEjagr9UoB0MPpzMIyuX5kzgUgHA374jXdNAvBKAF6bwJZeSvrmHmsVNvTNM9tayyfvswHOybLfPnnb0kl9%2BHp9cpDdQTUVbvCWG4MNBJzZX6XOtKqMxt1izZbijGhOU5niJEPL75Jz3WG2Z52W7Vm9RdJhb04au2STwSMBwSOtBQl8g0dsZqQEggAggJZsf75AYFN75MYCBxx0eM8J122FYoNL4oAzDhgvoS2SwxcK7EuMpDZwwYJ5ioW2GBBXeTDZqJ7EggB9MFXBfkKxJJHBwM8WizFzyuk%2FFnMdEwGGicr3Z7VsDtIwBrEYWUgEpjGNbDPSOLP1mH%2B1q0zMa7SgQ3dNCSeabzfl4%2F%2Fg2xp89h5PN6ramKw1R72%2FfQ1TuroCJM0wOkgaTz8Xfpj9rXtBAXdp6poIA4XuU5ntiTDZqx1P5aTK4bYqUbKnaa4L0R%2BTvrWqDNiTOqMRTaQ5L3Ble1KS3rvTDluCL7oKB8WrVfioEhuRlaokJADTBge%2BARg2JitTaS4ZVGi%2B7Wrw%2Ff0KGUYRMrtB8YtUBRDM1vx9roEUdh0rJ%2FdFk%2Fs0EV%2F0K%2BIhu56UI3qNP2b193NDpFj9CFuWiVP9lB2Y%2Fg8%3D" />

按照上面的流程，我们实现 patch 时，需要借助下面的函数。

### vnode 函数

返回一个 vnode，而 `h` 函数就是靠其构建一个完整的 Virtual DOM 的。

```javascript
/* vnode.js */

/**
 * vnode
 * @param {string} sel 选择器
 * @param {object} data 数据
 * @param {array} children 子节点
 * @param {string} text 文本
 * @param {dom} elm DOM
 * @returns object
 */
function vnode(sel, data, children, text, elm) {
  return { sel, data, children, text, elm }
}
```

### h 函数

我们现在来简单实现一个 snabbdom。

snabbdom 使用 TS 编写, 所以 `h` 函数中做了方法重载使用起来灵活：

```typescript
export declare function h(sel: string): VNode
export declare function h(sel: string, data: VNodeData): VNode
export declare function h(sel: string, children: VNodeChildren): VNode
export declare function h(sel: string, data: VNodeData, children: VNodeChildren): VNode
```

这里写的 h 函数只实现主要功能，没有实现重载，直接实现 3 个参数的 h 函数：

```javascript
/**
 * h
 * @param {string} a sel
 * @param {object} b data
 * @param {any} c 是子节点 可以是文本，数组
 */
function h(a, b, c) {
  // 先判断是否有三个参数
  if (arguments.length < 3) throw new Error('请检查参数个数')
  // 1.第三个参数是文本节点
  if (typeof c === 'string' || typeof c === 'number') {
    // 调用 vnode 这直接传 text 进去
    // 返回值 {sel,data,children,text,elm} 再返回出去
    return vnode(a, b, undefined, c, undefined)
  } // 2.第三个参数是数组 [h(),h()] [h(),text] 这些情况
  else if (Array.isArray(c)) {
    // children 用收集返回结果
    let children = []
    // 先判断里面是否全是 h()执行完的返回结果 是的话添加到 chilren 里
    for (let i = 0; i < c.length; i++) {
      // h() 的返回结果 是{} 而且 包含 sel
      if (!(typeof c[i] === 'object' && c[i].sel)) throw new Error('第三个参数为数组时只能传递 h() 函数')
      // 满足条件进行push [{sel,data,children,text,elm},{sel,data,children,text,elm}]
      children.push(c[i])
    }
    // 调用 vnode 返回 {sel,data,children,text,elm} 再返回
    return vnode(a, b, children, undefined, undefined)
  } // 3.第三个参数直接就是函数 返回的是 {sel,data,children,text,elm}
  else if (typeof c === 'object' && c.sel) {
    // 这个时候在 使用h()的时候 c = {sel,data,children,text,elm} 直接放入children
    let children = [c]
    // 调用 vnode 返回 {sel,data,children,text,elm} 再返回
    return vnode(a, b, children, undefined, undefined)
  }
}
```

我们可以看看初始化的结果：

```javascript
let vn = h('div', {}, h('ul', {}, [h('li', {}, '我是一个li'), h('li', {}, '我是一个li'), h('li', {}, '我是一个li')]))
console.log(vn)
```

<details>
<summary>展开初始化结果</summary>

```javascript
{
    "sel": "div",
    "data": {},
    "children": [
        {
            "sel": "ul",
            "data": {},
            "children": [
                {
                    "sel": "li",
                    "data": {},
                    "text": "我是一个li"
                },
                {
                    "sel": "li",
                    "data": {},
                    "text": "我是一个li"
                },
                {
                    "sel": "li",
                    "data": {},
                    "text": "我是一个li"
                }
            ]
        }
    ]
}
```

</details>

就此我们已经简单实现了一个 vdom 初始化方法。

### sameVnode 函数

这是一个辅助函数，比两个 vdom 的 key 和 sel，以此来判断两个 vnode 是否是一样的：

```javascript
/**
 * sameVnode
 * @param {ReturnType<vnode>} vnode1 虚拟节点1
 * @param {ReturnType<vnode>} vnode2 虚拟节点2
 * @returns {boolean}
 */
export default function sameVnode(vnode1, vnode2) {
  return (vnode1.data ? vnode1.data.key : undefined) === (vnode2.data ? vnode2.data.key : undefined) && vnode1.sel === vnode2.sel
}
```

### createElm 函数

递归生成真实的节点及其子节点：

```javascript
/**
 * createElm
 * @param {ReturnType<vnode>} vnode 要创建的节点
 */
function createElm(vnode) {
  // 拿出 新创建的 vnode 中的 sel
  let node = document.createElement(vnode.sel)
  // 存在子节点
  // 子节点是文本
  if (vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // 直接添加文字到 node 中
    node.textContent = vnode.text

    // 子节点是数组
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    let children = vnode.children
    // 遍历数组
    for (let i = 0; i < children.length; i++) {
      // 获取到每一个数组中的 子节点
      let ch = children[i]
      // 递归的方式 创建节点
      let chDom = createElm(ch)
      // 把子节点添加到 自己身上
      node.appendChild(chDom)
    }
  }
  // 更新vnode 中的 elm
  vnode.elm = node
  // 返回 DOM
  return node
}
```

### patchVnode 函数

比较两个相同的 vdom：

```javascript
/**
 * patchVnode
 * @param {ReturnType<vnode>} oldVnode 老的虚拟节点
 * @param {ReturnType<vnode>} newVnode 新的虚拟节点
 * @returns
 */
function patchVnode(oldVnode, newVnode) {
  // 1.判断是否相同对象
  console.log('同一个虚拟节点')
  if (oldVnode === newVnode) return
  // 2.判断newVnode上有没有text
  // 这里为啥不考虑 oldVnode呢，因为 newVnode有text说明就没children
  if (newVnode.text && !newVnode.children) {
    // 判断是text否相同
    if (oldVnode.text !== newVnode.text) {
      console.log('文字不相同')
      // 不相同就直接把 newVnode中text 给 elm.textContent
      oldVnode.elm.textContent = newVnode.text
    }
  } else {
    // 3.判断oldVnode有children, 这个时候newVnode 没有text但是有 children
    if (oldVnode.children) {
      // ...这里新旧节点都存在children 这里要使用 updateChildren 下面进行实现
    } else {
      console.log('old没有children，new有children')
      // oldVnode没有 children ,newVnode 有children
      // 这个时候oldVnode 只有text 我们把 newVnode 的children拿过来
      // 先清空 oldVnode 中text
      oldVnode.elm.innerHTML = ''
      // 遍历 newVnode 中的 children
      let newChildren = newVnode.children
      for (let i = 0; i < newChildren.length; i++) {
        // 通过递归拿到了 newVnode 子节点
        let node = createElm(newChildren[i])
        // 添加到 oldVnode.elm 中
        oldVnode.elm.appendChild(node)
      }
    }
  }
}
```

按照流程图进行编码，现在要处理 newVnode 和 oldVnode 都存在 children 的情况了。在这里我们要进行精细化比较，也就是我们经常说的 diff。

## Refer

[从了解到深入 Virtual DOM 和实现 Diff 算法 - 稀土掘金](https://juejin.cn/post/6990582632270528525)
