---
date: 1652872376408
title: '初探V8垃圾回收'
scope: ['browser', 'V8']
buckets: ['post', 'browser']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

V8 的垃圾回收策略主要是基于**分代式垃圾回收机制**，其根据**对象的存活时间**将内存的垃圾回收进行不同的分代，然后对不同的分代采用不同的垃圾回收算法。

## V8 的内存结构

大致分为 5 个部分：

- New Space（新生代）

大多数的对象开始都会被分配在这里，这个区域相对较小但是垃圾回收特别频繁，该区域被分为两半，一半用来分配内存，另一半用于在垃圾回收时将需要保留的对象复制过来。

- Old Space（老生代）

新生代中的对象在存活一段时间后就会被转移到老生代内存区，相对于新生代该内存区域的垃圾回收频率较低。老生代又分为`老生代指针区`和`老生代数据区`，前者包含大多数可能存在指向其他对象的指针的对象，后者只保存原始数据对象，这些对象没有指向其他对象的指针。

- Large Object Space（大对象区）

存放体积超越其他区域大小的对象，每个对象都会有自己的内存，垃圾回收不会移动大对象区。

- Code Space（代码区）

代码对象，会被分配在这里，唯一拥有执行权限的内存区域。

- Map Space（Map 区）

存放 Cell 和 Map，每个区域都是存放相同大小的元素，结构简单。

<CenterImg src="https://res.zrain.fun/images/2022/06/V8_areas-49a7a79929f9ebe772220d18cd2374e1.png" alt="V8_areas" zoom="50%" />

New Space（新生代）被划分为了两个部分，其中一部分叫做 Inactive New Space（未激活新生代），表示暂未激活的内存区域，另一部分为激活状态。下面我们来看一看最常用的新生代与老生代。

## 新生代

内存占用：64 位 - 32MB； 32 位 - 16MB。

在 V8 引擎的内存结构中，新生代主要用于存放存活时间较短的对象。新生代内存是由两个 **semispace（半空间）** 构成的，内存最大值在 64 位系统和 32 位系统上分别为 32MB 和 16MB，在新生代的垃圾回收过程中主要采用了 **Scavenge** 算法。

在 Scavenge 算法的具体实现中，主要采用了 **Cheney** 算法，它将新生代内存一分为二，每一个部分的空间称为 **semispace**，也就是我们在上图中看见的 New Space 中划分的两个区域，其中处于激活状态的区域我们称为 From 空间，Inactive New Space 的区域我们称为 To 空间。这两个空间中，始终只有一个处于使用状态，另一个处于闲置状态。

我们的程序中声明的对象首先会被分配到 From 空间，当进行垃圾回收时，如果 From 空间中尚有存活对象，则会被复制到 To 空间进行保存，非存活的对象会被自动回收。当复制完成后，From 空间和 To 空间完成一次角色互换，To 空间会变为新的 From 空间，原来的 From 空间则变为 To 空间。

大致模拟一下流程：

假设我们在`From`空间中分配了三个对象 A、B、C

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_new_space_example_part_1-b1aca7863cebd3148690cbf67c8a9372.png" alt="v8_new_space_example_part_1" zoom="40%" />

当程序主线程任务第一次执行完毕后进入垃圾回收时，发现对象 A 已经没有其他引用，则表示可以对其进行回收，同时将依然活跃的 B，C 对象复制一份到 To 空间:

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_new_space_example_part_2-8e9bc2e878b77a941b6b46dda31899e5.png" alt="v8_new_space_example_part_2" zoom="40%" />

清空 From 空间中的内容：

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_new_space_example_part_3-c82e5da670e5802181e009d0400a6396.png" alt="v8_new_space_example_part_3" zoom="40%" />

接着 From 空间和 To 空间进行一次角色互换，注意并不涉及**复制交换操作**：

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_new_space_example_part_4-2e932d72c647e0c9a5e1d1c43f31deb7.png" alt="v8_new_space_example_part_4" zoom="40%" />

到此，一轮垃圾回收操作完成，From 空间开始接纳新的对象。

通过以上的流程图，我们可以很清楚地看到，Scavenge 算法的垃圾回收过程主要就是将存活对象在 From 空间和 To 空间之间进行复制，同时完成两个空间之间的角色互换，因此该算法的缺点也比较明显，浪费了一半的内存用于复制。

## 老生代

内存占用：64 位 - 1400MB； 32 位 - 700MB。

在老生代中，因为管理着大量的存活对象，如果依旧使用 Scavenge 算法的话，很明显会浪费一半的内存，因此已经不再使用 Scavenge 算法，而是采用新的算法进行管理：

- 引用计数（几乎被废弃）
- Mark-Sweep（标记清除）
- Mark-Compact（标记整理）。

### 引用计数

检测是否有变量引用这个对象，一旦发现引用计数为 0，这个对象便会被清除，但 Js 中还存在循环引用问题，这将导致对象会一直有被应用，无法被回收。因此为了避免循环引用导致的内存泄漏问题，截至 2012 年所有的现代浏览器均放弃了这种算法，转而采用另外两种算法。

### Mark-Sweep

分为 “标记” 和 “清除” 两个阶段，在标记阶段会遍历堆中的所有对象，然后标记活着的对象，在清除阶段中，会将死亡的对象进行清除。Mark-Sweep 算法主要是通过判断某个对象是否可以被访问到，从而知道该对象是否应该被回收，具体步骤如下：

1. 垃圾回收器会在内部构建一个**根列表**，用于从根节点出发去寻找那些可以被访问到的变量。比如在 JavaScript 中，**window** 全局对象可以看成一个根节点。
2. 垃圾回收器从所有根节点出发，遍历其可以访问到的子节点，并将其标记为活动的，根节点不能到达的地方即为非活动的，将会被视为垃圾。
3. 垃圾回收器将会释放所有非活动的内存块，并将其归还给操作系统。

以下几种情况都可以作为根节点：

- 全局对象。
- 本地函数的局部变量和参数。
- 当前嵌套调用链上的其他函数的变量和参数。

![img](https://res.zrain.fun/images/2022/02/16ee468e85a1084d-tplv-t2oaga2asx-watermark-62ff287c37ae72c0de24665a69240725.webp)

### Mark-Compact

Mark-Sweep 算法存在一个问题，就是在经历过一次标记清除后，内存空间可能会出现不连续的状态，因为我们所清理的对象的内存地址可能不是连续的，所以就会出现内存碎片的问题，导致后面如果需要分配一个大对象而空闲内存不足以分配，就会提前触发垃圾回收，而这次垃圾回收其实是没必要的，因为我们确实有很多空闲内存，只不过是不连续的。

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_mark_sweep_problem-306b592950957c91ced58013a664fc09.png" alt="v8_mark_sweep_problem" zoom="40%" />

A，B，C 被回收后产生 2 个不连续空间。这时得想办法合并空闲空间。

Mark-Compact 主要就是用来解决内存的碎片化问题的，回收过程中将死亡对象清除后，在整理的过程中，会将活动的对象往堆内存的一端进行移动，移动完成后再清理掉边界外的全部内存：

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_mark_compact_example-26bc03a843f6fb8335ebf9e0f8c3bf25.png" alt="v8_mark_compact_example" zoom="40%" />

至此就完成了一次老生代垃圾回收的全部过程。

由于 JS 的单线程机制，垃圾回收的过程会阻碍主线程同步任务的执行，待执行完垃圾回收后才会再次恢复执行主任务的逻辑，这种行为被称为 **Stop The World（全停顿）**。在标记阶段同样会阻碍主线程的执行，一般来说，老生代会保存大量存活的对象，如果在标记阶段将整个堆内存遍历一遍，那么势必会造成严重的卡顿。

### Incremental Marking

为了减少垃圾回收带来的停顿时间，V8 引擎又引入了 **Incremental Marking（增量标记）** 的概念，即将原本需要一次性遍历堆内存的操作改为增量标记的方式，先标记堆内存中的一部分对象，然后暂停，将执行权重新交给 JS 主线程，待主线程任务执行完毕后再从原来暂停标记的地方继续标记，直到标记完整个堆内存。

## 对象晋升

当一个对象在经过多次复制之后依旧存活，那么它会被认为是一个生命周期较长的对象，在下一次进行垃圾回收时，该对象会被直接转移到老生代中，这种对象从新生代转移到老生代的过程我们称之为**晋升**。

对象晋升的条件主要有以下两个：

- 对象是否经历过一次 Scavenge 算法
- To 空间的内存占比是否已经超过**25%**

<CenterImg src="https://res.zrain.fun/images/2022/06/v8_object_promotion-e5063ed675fb1b0a40bfb49121c20e01.png" alt="v8_object_promotion" zoom="40%" />

之所以有 25%的内存限制是因为 To 空间在经历过一次 Scavenge 算法后会和 From 空间完成角色互换，会变为 From 空间，后续的内存分配都是在 From 空间中进行的，如果内存使用过高甚至溢出，则会影响后续对象的分配，因此超过这个限制之后对象会被直接转移到老生代来进行管理。

### 如何避免内存泄漏

- 减少全局挂载

当在全局用`var`声名变量时将会挂载到`window`（浏览器环境），如果未及时清除（置 null），将会长久驻留再老生代。

- 清除定时器

`setTimeout`或者`setInterval`都会长久运行（未手动清除的话）。

- 减少闭包使用

闭包可以很方便的私有化变量，但私有变量会长久存在。如果不会频繁使用声名为普通局部变量更为合适。

- 清除 DOM 引用

```js
const elements = {
  button: document.getElementById('button')
}

function removeButton() {
  document.body.removeChild(document.getElementById('button'))
}
```

在这个示例中，我们想调用`removeButton`方法来清除`button`元素，但是由于在`elements`字典中存在对`button`元素的引用，所以即使我们通过`removeChild`方法移除了`button`元素，它其实还是依旧存储在内存中无法得到释放，只有我们手动清除对`button`元素的引用才会被垃圾回收：

```js
delete elements.button
```

- WeakMap 和 WeakSet

利用弱引用可以让不被引用的对象自动被回收，通常存放可能被删除的 DOM 节点。
