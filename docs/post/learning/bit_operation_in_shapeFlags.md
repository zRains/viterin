---
toc: false
date: 1649942694483
title: 'Vue3位运算的巧妙之处'
scope: ['Vue']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

## 问题

在看~~深入~~尝试理解 Vue 时，发现一个“**反人类**”操作，源码里对不同组件的标识是这样的：

```typescript
// vue-core: shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1, // 1
  FUNCTIONAL_COMPONENT = 1 << 1, // 2
  STATEFUL_COMPONENT = 1 << 2, // 4
  TEXT_CHILDREN = 1 << 3, // 8
  ARRAY_CHILDREN = 1 << 4, // 16
  SLOTS_CHILDREN = 1 << 5, // 32
  TELEPORT = 1 << 6, // 64
  SUSPENSE = 1 << 7, // 128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 256
  COMPONENT_KEPT_ALIVE = 1 << 9, // 512
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 6
}
```

## 解决

为什么不直接从 1 开始依次递增呢？看到后面源码`patch`部分才能理解这里的精妙之处。

### 按位与（&）和按位或（|）

与操作：当两个比特位都为 1 时，结果就为 1，其余情况均为 0。

<CenterImg src="https://res.zrain.fun/images/2022/04/bit%20operation1-6cf5016a8296c3f620251c3a6f5a777c.png" alt="bit operation1" zoom="30%" />

或操作：当其中一个比特位为 1 或者两个都为 1，结果就是 1，否则为 0。

<CenterImg src="https://res.zrain.fun/images/2022/04/bit%20operation1%20-1--fb49bca971ed23123bd0ab6a2073fd06.png" alt="bit operation2" zoom="30%" />

下面是 mini-vue 的`createVNode`函数：

> 代码来自 mini-vue，做了一些改动。和 Vue 相差并不大。

```javascript
export const createVNode = function (type: any, props?: any, children?: string | Array<any>) {
  const vnode = {
    el: null,
    component: null,
    key: props?.key,
    type,
    props: props || {},
    children,
    shapeFlag: getShapeFlag(type)
  }

  // 基于 children 再次设置 shapeFlag
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  normalizeChildren(vnode, children)

  return vnode
}

// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: any) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
```

可以看到，`createVNode`对组件的`shapeFlag`做了两次处理：一次是在开始时通过组件数据判断类型，之后再通过组件的`children`使用一次或操作。

接下来是`patch`部分，对不同组件进行不同处理：

```javascript
function patch(n1, n2, container = null, anchor = null, parentComponent = null) {
  // 基于 n2 的类型来判断
  // 因为 n2 是新的 vnode
  const { type, shapeFlag } = n2
  switch (type) {
    case Text:
      processText(n1, n2, container)
      break
    // 其中还有几个类型比如： static fragment comment
    case Fragment:
      processFragment(n1, n2, container)
      break
    default:
      // 这里就基于 shapeFlag 来处理
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理 element
        processElement(n1, n2, container, anchor, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // 处理 component
        processComponent(n1, n2, container, parentComponent)
      }
  }
}
```

这里有一个需要注意的点，一个组件+组件的子组件可以有多种类型，就比如说下面示例：

```html
<p>this is a text element</p>
```

而它的`subTree`是这样的：

```javascript
const vnode = {
  type: 'p',
  shapeFlag: 9, // 使用什么才能标识它是一个元素，而它的子节点是文本呢？这在ShapeFlags可没有
  children: 'this is a text element'
}
```

通过`createVNode`我们清楚的看到使用**或**操作重新生成了一个标识`9`。但为什么要这样做呢？

在`patch`阶段，通过`与`操作判断是否属于这个组件类型。在上面的位运算操作中我们可以想到只要两个数中某两个相同位置的比特位为 1，那么这个判断就成立：

<img src="https://res.zrain.fun/images/2022/04/bit%20operation1-c273ab00f3b0bc4bf4f2da2ad6a93436.png" alt="bit operation3" />
也就是说，在`createVNode`里对`shapeFlag`再次操作是为了让这个组件有**更高**的标识，让他既可以被`ELEMENT`所识别，又可以被`TEXT_CHILDREN`识别。使用位运算，就不需要类似于

```javascript
if ([ELEMENT, TEXT_CHILDREN].includes(vnode.shapeFlag)) {
  // ...
}
```

的操作了。现在也逐渐明白为什么要写成`1 << 2`形式：即保证每个组件类型都有一个独一无二的比特位对应。