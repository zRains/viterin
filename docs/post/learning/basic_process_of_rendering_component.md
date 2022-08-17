---
date: 1649693724000
title: '一个组件在Vue3中大致经历了什么？'
scope: ['Vue', 'source']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

<CenterImg src="https://res.zrain.fun/images/2022/04/vue%E5%88%9D%E5%A7%8B%E5%8C%96%E5%A4%A7%E8%87%B4%E8%BF%87%E7%A8%8B-e0dbeb0124341a58bfc99f7800c4c3f7.png" alt="vue初始化大致过程" />

### 目录

大致总结一下一个组件在 vue3 驱动下如何渲染到页面，肯定省略了不少，以后再慢慢补充吧。

### `createApp` - 一切的开始

下面这个代码再熟悉不过了。

```javascript
import { createApp } from 'vue'
import App from './App.js'

createApp(App).mount(document.querySelector('#app'))
```

让我们看看`createApp`都做了什么：

```typescript
// mini-vue: runtime-dom/index.ts
let renderer

function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer({...}))
  )
}

export const createApp = (...args) => {
  return ensureRenderer().createApp(...args)
}
```

### `createRenderer` - 渲染器的诞生

从上面代码可以看出`createApp`帮我们创建了一个渲染器，并使用渲染器里的`createApp`加载组件，也就是上面的`App`。而`ensureRenderer`顾名思义就是确定只有一个渲染器，这就使得我们创建多个组件（包括通过`createApp`）使用的都是**同一个**渲染器。让我们看看`createRenderer({...})`做了什么：

<details>
<summary>展开 mini-vue 中的 createRenderer 代码</summary>

```typescript
// mini-vue: runtime-core/renderer.ts
export function createRenderer(options) {
  // 渲染器对dom的操作
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText
  } = options

  // 创建一个渲染器
  const render = (vnode, container) => {
    // 调用 patch
    patch(null, vnode, container)
  }

  // patch函数
  function patch(n1, n2, container = null, anchor = null, parentComponent = null) {
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
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理 element
          processElement(n1, n2, container, anchor, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理 component
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  // 省略了很多很多各种组件处理函数，里面多多少少用到了options里面的方法

  // 返回带mount的createApp
  return {
    createApp: createAppAPI(render)
  }
}
```

</details>

很明显`options`是对元素的操作函数，比如创建 dom，设置 dom 的内容，对 dom 的增删等。其实 vue 里面不止这么点对 dom 的操作，vue 是单独封装在`runtime-core/src/nodeOpts.ts`里面，包括获取父节点，克隆节点，挂载静态内容等。

### `patch` - 一个小型的适配器模式

patch，补丁，修补的意思。而它主要的作用是对不同类型的组件进行不同的处理，因为最后的最后都要当作`ShapeFlags.ELEMENT`类型挂载到 dom 里。

```typescript
// mini-vue: runtime-core/renderer.ts
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
        console.log('处理 element')
        processElement(n1, n2, container, anchor, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        console.log('处理 component')
        processComponent(n1, n2, container, parentComponent)
      }
  }
}
```

首先看到`Text`和`Fragment`类型，由上面的注释可知，最先并不是按照`shapeFlag`来处理的，其实还有 vue 根据子节点设置的组件，他们的`type`是一个独一无二的的**Symbol**：

```typescript
// vue-core: runtime-core/src/vnode.ts
export const Fragment = Symbol(__DEV__ ? 'Fragment' : undefined) as any as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}
export const Text = Symbol(__DEV__ ? 'Text' : undefined)
export const Comment = Symbol(__DEV__ ? 'Comment' : undefined)
export const Static = Symbol(__DEV__ ? 'Static' : undefined)
```

具体运用代码如下：

<details>
<summary>展开 vue-core 中的 normalizeVNode 代码</summary>

```typescript
// vue-core: runtime-core/src/vnode.ts
export function normalizeVNode(child: VNodeChild): VNode {
  if (child == null || typeof child === 'boolean') {
    // empty placeholder
    return createVNode(Comment)
  } else if (isArray(child)) {
    // fragment
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    )
  } else if (typeof child === 'object') {
    // already vnode, this should be the most common since compiled templates
    // always produce all-vnode children arrays
    return cloneIfMounted(child)
  } else {
    // strings and numbers
    return createVNode(Text, null, String(child))
  }
}
```

</details>

这里我们可以看一下有哪些类型，也就是上面的 shapeFlag 枚举：

```typescript
// vue-core: shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1, // 普通元素，也可以理解为原生dom，比如div、h1、section
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件，使用function创建的
  STATEFUL_COMPONENT = 1 << 2, // 状态式组件，基于 options 创建的
  TEXT_CHILDREN = 1 << 3, // vnode 的 children 为 string 类型
  ARRAY_CHILDREN = 1 << 4, // vnode 的 children 为数组类型
  SLOTS_CHILDREN = 1 << 5, // vnode 的 children 为 slots 类型
  TELEPORT = 1 << 6, // 传送组件，被<Teleprot></Teleprot>包裹
  SUSPENSE = 1 << 7, // 异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
```

我当初在想为什么用位移运算来代替枚举，为什么不直接写个常量，比如`STATEFUL_COMPONENT = 1 << 2`可以替换成`STATEFUL_COMPONENT = 4`。网上也没搜出一个所以然，虽然我知道这里的位运算压根儿消耗不了多少性能，可能是为了辨识，方便增加组件的类型。但至于为什么要这样枚举，查看[**这篇文章**](/post/learning/bit_operation_in_shapeFlags)。

> 到现在还是`createRenderer`里面的一小部分。这个函数可以说是相当夸张，在`mini-vue`里大致**600**行，到了`vue-core`直接飙升到**2000**行。如果真去啃岂不是诸神黄昏！！
>
> ![image-20220405205520985](https://res.zrain.fun/images/2022/04/image-20220405205520985-727d65c8faadf9d228ef760773602393.png)

`createRenderer`里面除了`patch`还包含了大量的各种组件处理函数。

### `processComponent` - 初始化组件开始

在 mini-vue 和 vue-core 里这个函数只是短短几行（vue-core 里相较于其它函数来说），这里就截取 mini-vue 里的吧：

```typescript
//mini-vue: runtime-core/renderer.ts
function processComponent(n1, n2, container, parentComponent) {
  // 如果 n1 没有值的话，那么就是 mount
  if (!n1) {
    // 初始化 component，延续上一个函数，parentComponent有可能null。
    mountComponent(n2, container, parentComponent)
  } else {
    updateComponent(n1, n2, container)
  }
}
```

其中，`n1`为`n2`的生成前一个`subTree`，可以理解为后者是前者更新后的 vnode。很简单的逻辑，`n1`为 null 则表明需要挂载，因为你前一次的记录都没有，还怎么更新啊，肯定要先挂载产生一个记录啊。🤣

<CenterImg src="https://res.zrain.fun/images/2022/04/processComponent-4a486fa454ace19989a2c055a01eb98d.png" alt="processComponent" zoom="40%" />

### `mountComponent` - 组件实例被创建

直接上代码：

```typescript
// mini-vue: runtime-core/renderer.ts
function mountComponent(initialVNode, container, parentComponent) {
  const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent))
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}
```

逻辑同样简单，创建`instance`后挂载到 vnode 的`component`属性上，之后交给`setupComponent`（处理 props，slots，编译 template，挂载 render 渲染函数等），`setupRenderEffect`处理响应式。vue-core 在这一段含有大量开发环境的处理

### `createComponentInstance` - 顾名思义

这个函数将创建一个组件的实例，包含大量信息（vnode 可以说也是组件的一个实例，但包含的信息太少了，这里的 instance 可以很方便处理组件内部的信息，比如响应式，props，slots 等）：

<details>
<summary>展开 mini-vue 中的 createComponentInstance 代码</summary>

```typescript
// mini-vue: runtime-core/components.ts
export function createComponentInstance(vnode, parent) {
  const instance = {
    type: vnode.type,
    vnode,
    next: null, // 需要更新的 vnode，用于更新 component 类型的组件
    props: {},
    parent,
    provides: parent ? parent.provides : {}, //  获取 parent 的 provides 作为当前组件的初始化值 这样就可以继承 parent.provides 的属性了
    proxy: null,
    isMounted: false,
    attrs: {}, // 存放 attrs 的数据
    slots: {}, // 存放插槽的数据
    ctx: {}, // context 对象
    setupState: {}, // 存储 setup 的返回值
    emit: () => {}
  }

  // 在 prod 坏境下的 ctx 只是下面简单的结构
  // 在 dev 环境下会更复杂
  instance.ctx = {
    _: instance
  }

  // 赋值 emit
  // 这里使用 bind 把 instance 进行绑定
  // 后面用户使用的时候只需要给 event 和参数即可
  instance.emit = emit.bind(null, instance) as any

  return instance
}
```

</details>

在 dev 坏境下的 ctx 还包含了下面这些属性，在 prod 环境下是无法使用的：

<details>
<summary>展开 vue-core 中的 publicPropertiesMap 定义</summary>

```typescript
// vue-core: runtime-core/src/componentPublicInstance.ts
export const publicPropertiesMap: PublicPropertiesMap = /*#__PURE__*/ extend(Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => (__DEV__ ? shallowReadonly(i.props) : i.props),
  $attrs: (i) => (__DEV__ ? shallowReadonly(i.attrs) : i.attrs),
  $slots: (i) => (__DEV__ ? shallowReadonly(i.slots) : i.slots),
  $refs: (i) => (__DEV__ ? shallowReadonly(i.refs) : i.refs),
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => (__FEATURE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type),
  $forceUpdate: (i) => () => queueJob(i.update),
  $nextTick: (i) => nextTick.bind(i.proxy!),
  $watch: (i) => (__FEATURE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP)
} as PublicPropertiesMap)
```

</details>

可能上面的`instance`并不能感受到**大量**的属性，在 vue-core 里足足有**56**个属性。

![createComponentInstance](https://res.zrain.fun/images/2022/04/createComponentInstance-311fe19abdbd436a0280782c899e14b2.png)

我发现至今有两个地方出现了 uid 标识，一个是在[createAppAPI](#createappapi---将创造能力给我们)，一个就是在这里。两个 uid 的初始声名在不同文件里：

```typescript
// vue-core: runtime-core/src/apiCreateApp.ts
let uid = 0 // 157行

// vue-core: runtime-core/src/components.ts
let uid = 0 // 447行
```

这也可以得出一个结论：虽然可以多次调用`createApp(...)`但创建出来的 app 都是有不同标识的，并且所有 components 的 uid 都各不相同。但一些 app 和 component 允许存在相同 uid 的情况。

### `setupComponent` - instance 加工厂

直接看代码：

```typescript
// mini-vue: runtime-core/components.ts
export function setupComponent(instance) {
  // 1. 处理 props
  // 取出存在 vnode 里面的 props
  const { props, children } = instance.vnode
  initProps(instance, props)
  // 2. 处理 slots
  initSlots(instance, children)
  // 源码里面有两种类型的 component，一种是基于 options 创建的，还有一种是 function 的
  // setupComponent函数处理的是 options 创建的组件
  setupStatefulComponent(instance)
}
```

这里的逻辑和 vue-core 一样的简短，我们可以清楚的看到`setupComponent`处理了`props`和`slots`，盲猜是设置只读让后挂载到`instance`。🤪

> 注意到这个函数似乎只处理`STATEFUL_COMPONENT`类型的组件。从后续分析来看`FUNCTIONAL_COMPONENT`是在 componentFunctional.ts 下面完成的。函数组件要之后分析了。

让我们看看`initProps`做了什么，因为 mini-vue 这部分代码太简略了（只有一行），所以截取了 vue-core 里面的，已删除部分开发环境代码：

<details>
<summary>展开 vue-core 中的 initProps 代码</summary>

```typescript
// vue-core: runtime-core/src/componentProps.ts
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number, // result of bitwise flag comparison
  isSSR = false
) {
  const props: Data = {}
  const attrs: Data = {}

  // 确保所有声明的属性都存在，如果props里面没有，就先加上，直接给上undefined
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined
    }
  }

  if (isStateful) {
    // 处理STATEFUL_COMPONENT类型的组件
    instance.props = isSSR ? props : shallowReactive(props)
  } else {
    // 处理FUNCTIONAL_COMPONENT类型的组件
    if (!instance.type.props) {
      instance.props = attrs
    } else {
      instance.props = props
    }
  }
  instance.attrs = attrs
}
```

</details>

逻辑也很简单，这里需要提一下处理`FUNCTIONAL_COMPONENT`类型的组件，为什么 props 一会儿是`attrs`一会儿是`props`。在[**官方文档**](https://vuejs.org/guide/extras/render-function.html#functional-components)是这样解释的：

> 如果这个 props 选项没有被定义，那么被传入函数的 props 对象就会像 attrs 一样会包含所有 attribute。除非指定了 props 选项，否则每个 prop 的名字将不会基于驼峰命名法被一般化处理。

就这样，`props`被挂载到`instance`上了。

接下来让我们看看`initSlots`又做了什么：

<details>
<summary>展开 mini-vue 中的 initSlots 代码</summary>

```typescript
// mini-vue: runtime-core/componentSlots.ts
export function initSlots(instance, children) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    // 初始化 slots，这instance.slots = {}传参的写法不得让我看半天。。。
    normalizeObjectSlots(children, (instance.slots = {}))
  }
}

const normalizeSlotValue = (value) => {
  // 把 function 返回的值转换成 array ，这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value]
}

const normalizeObjectSlots = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key]
    if (typeof value === 'function') {
      // 把这个函数给到slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props) => normalizeSlotValue(value(props))
    }
  }
}
```

</details>

> 这部分代码和 vue-core 大同小异，后者多了一些边缘处理情况，如使用了不合适的 slot 名称，处理非函数的 slots 等。

可以看出当 vnode 的子节点为 Object，也就表明为 slots 配置。从`typeof value === 'function'`可以知道每个 slot 的值必须是一个**函数**，通过检验后把每个 slot 的值包装为一个**函数数组**，以此来达到支持多个兄弟元素（也就是 shapeFlag.ARRAY_CHILDREN 类型）。在[**创建 Vnodes**](https://staging-cn.vuejs.org/guide/extras/render-function.html#creating-vnodes)这里可以清楚的了解到为什么要怎么做。

### `setupStatefulComponent` - 调用 setup

接下来就是处理组件内部`setup`函数的时候了，主要集中在`setupStatefulComponent`函数内。

> 📢 正如上面所说：setupStatefulComponent 只处理 STATEFUL_COMPONENT 类型的组件！

<details>
<summary>展开 mini-vue 中的 setupStatefulComponent 相关代码</summary>

```typescript
function setupStatefulComponent(instance) {
  // 1. 先创建代理 proxy
  // proxy 对象其实是代理了 instance.ctx 对象
  // 我们在使用的时候需要使用 instance.proxy 对象
  // 因为 instance.ctx 在 prod 和 dev 坏境下是不同的
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
  // 用户声明的对象就是 instance.type
  // const Component = {setup(),render()} ....
  const Component = instance.type
  // 2. 调用 setup

  // 调用 setup 的时候传入 props
  const { setup } = Component
  if (setup) {
    // 设置当前 currentInstance 的值
    // 必须要在调用 setup 之前
    setCurrentInstance(instance)
    const setupContext = createSetupContext(instance)
    // 真实的处理场景里面应该是只在 dev 环境才会把 props 设置为只读的
    const setupResult = setup && setup(shallowReadonly(instance.props), setupContext)
    setCurrentInstance(null)
    // 3. 处理 setupResult
    handleSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance)
  }
}

function createSetupContext(instance) {
  console.log('初始化 setup context')
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: () => {}
  }
}
```

</details>

创建 context 的代理对象并挂载到`proxy`上，之后创建 setup 函数的上下文（也就是我们时常都在用的 setup(props, ctx){...}），设置`currentInstance`最后调用 setup，注意到：

```typescript
// mini-vue: runtime-core/components.ts
setCurrentInstance(instance)
const setupContext = createSetupContext(instance)
const setupResult = setup && setup(shallowReadonly(instance.props), setupContext)
// setup调用完成，立即清除当前组件实例instance
setCurrentInstance(null)
```

上面这段代码提醒我们只能在 setup 函数中调用，至少[**文档里**](https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance)是这么说的：

> getCurrentInstance 只能在 setup 或生命周期钩子中调用。

后面的`handleSetupResult`则是对 setup 函数返回值进行处理，如果为函数类型，则当作`render`函数处理（注意，后面要考 😆），如果是普通对象，则代理这个对象。这里说一下代理的作用：

先来看一下 Proxy 的 handle：

```typescript
// vue-core: reactivity/src/refs.ts
const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  }
}
```

我们可以看到，当 set 被触发时，实际是运用到代理对象的`value`上，而 get 方法中的`unref`源码如下：

```typescript
// vue-core: reactivity/src/refs.ts
export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
```

会帮我们自动解包`value`，于是可以马上猜到，这个是用于模板（template）里的变量，因此模板里设置响应式数据时不用带上`.value`了。

### `finishComponentSetup` - 渲染处理

这个函数主要对 instance 如何渲染做处理，之前在 setup 函数中提到过：如果 setup 函数返回一个函数，则作为 instance 的渲染函数。否则就那`instance.type.template`为模板，通过`compile`将其编译为渲染函数并挂载到`instance.render`上。由此可见 setup 函数定义的渲染要比 template 字段定义的优先级高（毕竟后者还要编译一遍，性能上肯定处于劣势）。

### `setupRenderEffect` - 响应式的开始

响应式可谓是重中之重，因此单独开篇。 🤗

### `createAppAPI` - 将创造能力给我们

来看看`createRenderer`最后返回给我们什么：

```typescript
// mini-vue: runtime-core/createApp.ts
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        // 基于根组件创建 vnode
        const vnode = createVNode(rootComponent)
        // 调用 render，基于 vnode 进行开箱。
        render(vnode, rootContainer)
      }
    }

    return app
  }
}
```

`createAppAPI`返回了`createApp`方法，里面返回创建的 app 实例，包含`mount`和`_component`。而`mount`触发`render`渲染器，组件开始处理并挂载到页面上。实际上还有很多属性`mini-vue`没有添加上去：

<details>
<summary>展开 vue-core 中的 App 属性定义</summary>

```typescript
// vue-core: runtime-core/src/apiCreateApp.ts
const app: App = (context.app = {
  // 组件uid
  _uid: uid++,
  // 当前组件
  _component: rootComponent as ConcreteComponent,
  // 属性
  _props: rootProps,
  // 当前组件容器
  _container: null,
  // 当前组件上下文
  _context: context,
  // 当前app实例
  _instance: null,
  // vue版本
  version,

  get config() {
    return context.config
  },

  set config(v) {
    if (__DEV__) {
      warn(`app.config cannot be replaced. Modify individual options instead.`)
    }
  },
  // 使用插件
  use(plugin: Plugin, ...options: any[]) {},
  // 全局属性混入
  mixin(mixin: ComponentOptions) {},
  // 全局组件注册
  component(name: string, component?: Component): any {},
  // 全局探测器注册
  directive(name: string, directive?: Directive) {},
  // 卸载组件
  unmount() {},
  // 属性提供
  provide(key, value) {}
})
```

</details>

是不是在上面看到很多熟悉的方法。

### `createVNode` - 装箱与开箱

> vnode 是 vue 中表示虚拟 dom 的一个代称，全名为 Virtual DOM。

注意到`mount`里有个`createVNode`方法。这个方法对传入的组件进行**装箱操作**：

<details>
<summary>展开 mini-vue 中的 createVNode 代码</summary>

```typescript
// mini-vue: runtime-core/vnode.ts
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

export function normalizeChildren(vnode, children) {
  if (typeof children === 'object') {
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
    } else {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }
}

// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: any) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
```

</details>

> 为了精简篇幅已将部分注释。

`createVNode`是私有方法，正常使用 vue 时是没有这个 API 的，但另一个熟知的方法`h`就是基于它实现的，这也是 vue 考虑周全的地方。其中的`type`参数可能有多个类型：

**String 类型**

类似于`createVNode("div")`，创建一个普通的 dom 元素，归属`ShapeFlags.ELEMENT`。

**Object 类型**

这个可再分为两种类型：如果是普通对象的话，那么就是用户设置的 options，否则就为组件对象，类似于`createVNode(App)`

我们可以看到`createVNode`是通过`getShapeFlag`进行简单的判断，实际上再源码中判断的类型多的多：

```typescript
// vue-core: runtime-core/src/vnode.ts
const shapeFlag = isString(type)
  ? ShapeFlags.ELEMENT
  : __FEATURE_SUSPENSE__ && isSuspense(type)
  ? ShapeFlags.SUSPENSE
  : isTeleport(type)
  ? ShapeFlags.TELEPORT
  : isObject(type)
  ? ShapeFlags.STATEFUL_COMPONENT
  : isFunction(type)
  ? ShapeFlags.FUNCTIONAL_COMPONENT
  : 0
```

`createVNode`还有这样一个函数：`normalizeChildren`。这个函数主要判断组件的子组件类型，并改变组件的 shapeFlag。

根据`getShapeFlag`（vue 源码里是没有这个函数的，这只是个简单实现，代替上面 shapeFlag 的疯狂判断），当`children`的类型为对象时，如果对象被定义为`ShapeFlags.ELEMENT`，那么它的子组件必不可能为`SLOTS_CHILDREN`类型，否则将 shapeFlag 添加上`ShapeFlags.SLOTS_CHILDREN`的比特位。

vue 源码中的`normalizeChildren`实现更为复杂，考虑了很多类型的组件和情况，已包含个人的注释：

<details>
<summary>展开 vue-core 中的 normalizeChildren 代码</summary>

```typescript
export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  // 如果children为假值，直接置为null
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    // 当children是数组类型时
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.TELEPORT)) {
      // 下面正是mini-vue判断vnode.shapeFlag & ShapeFlags.ELEMENT后的省略部分
      // vue-core在这里考虑了这样一种情况：h('div', null, { default: () => 'hello' })
      // 上面这种情况就是往普通元素内插入文本，我们可以看作每个元素默认视为包含一个<slot/>
      // 换一个角度讲，普通元素的插槽只有默认插槽一个！
      const slot = (children as any).default
      if (slot) {
        // _c 是在slot部分withCtx()添加的，用于表示这个slot是否是一个已编译的slot
        slot._c && (slot._d = false)
        // slot()就表明如果是插槽的话必须是一个函数，不能有这种写法：h('div', null, { default: 'hello' })
        normalizeChildren(vnode, slot())
        slot._c && (slot._d = true)
      }
      return
    } else {
      // 到这里逻辑就和mini-vue类似了，既然你不是ShapeFlags.ELEMENT，那么此时肯定同时属于ShapeFlags.SLOTS_CHILDREN
      type = ShapeFlags.SLOTS_CHILDREN
      // 省略了一部分代码，大部分是对slot的处理
    }
  } else if (isFunction(children)) {
    // 如果children是函数，则讲children包装为属于default的对象，就和上面一样了。个人认为其实这里只是多一个编写选择。
    children = { default: children, _ctx: currentRenderingInstance }
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = String(children)
    // force teleport children to array so it can be moved around
    if (shapeFlag & ShapeFlags.TELEPORT) {
      type = ShapeFlags.ARRAY_CHILDREN
      children = [createTextVNode(children as string)]
    } else {
      type = ShapeFlags.TEXT_CHILDREN
    }
  }
  vnode.children = children as VNodeNormalizedChildren
  vnode.shapeFlag |= type
}
```

</details>

<CenterImg src="https://res.zrain.fun/images/2022/04/normalizeChildren-bbeb480aa1970200d25de09b64ac4711.png" alt="normalizeChildren" zoom="40%" />
