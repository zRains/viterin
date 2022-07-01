---
date: 1648484124000
title: '第1天 - 栈与队列（简单）'
layout: 'doc'
---

## [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

### 描述

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead  操作返回 -1 )

### 解答

```javascript
var CQueue = function () {
  this.queue = []
}

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function (value) {
  this.queue.splice(this.queue.length, 0, value)
}

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function () {
  if (this.queue.length === 0) return -1
  return this.queue.splice(0, 1)
}
```

---

## [剑指 Offer 30. 包含 min 函数的栈](https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof/)

### 描述

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

### 解答

由于要求复杂度为`O(1)`，简单使用 JS 的数组的`unshift & shift`是达不到这个要求的，除非数组里面保存一个状态对象。因此可以考虑使用链表来实现。考虑到栈先进后出的特点，我们可以在每个节点保存当前的最小值，之后重置头节点为当前新创建的节点，并链接之前的头节点。而最小值也可以向上传递。

```javascript
function node(val, min, next) {
  this.val = val
  this.min = min
  this.next = next
}

/**
 * initialize your data structure here.
 */
var MinStack = function () {
  this.nodeHead = null
}

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
  if (!this.nodeHead) {
    this.nodeHead = new node(x, x, null)
  } else {
    // 关键代码，实现了最小值的向上传递
    this.nodeHead = new node(x, Math.min(this.nodeHead.min, x), this.nodeHead)
  }
}

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  this.nodeHead = this.nodeHead.next
}

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.nodeHead.val
}

/**
 * @return {number}
 */
MinStack.prototype.min = function () {
  return this.nodeHead.min
}
```
