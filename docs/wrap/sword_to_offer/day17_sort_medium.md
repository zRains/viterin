---
date: 1649866524000
title: '第17天 - 排序（中等）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 40. 最小的 k 个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

### 描述

输入整数数组 arr ，找出其中最小的 k 个数。例如，输入 4、5、1、6、2、7、3、8 这 8 个数字，则最小的 4 个数字是 1、2、3、4。

### 解答

第一个想到的是：使用排序后取前面 k 个数，实现后效率有点低：

```javascript
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function (arr, k) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        arr[j] += arr[j + 1]
        arr[j + 1] = arr[j] - arr[j + 1]
        arr[j] -= arr[j + 1]
      }
    }
  }

  return arr.slice(0, k)
}
```

换了快排，然而只是时间复杂度和空间复杂度交换了一下而已。。。

```javascript
var getLeastNumbers = function (arr, k) {
  const recur = (a) => {
    if (a.length <= 1) return a
    let mid = a.splice(Math.floor(a.length / 2), 1)[0]
    let left = [],
      right = []
    for (let i = 0; i < a.length; i++) {
      if (a[i] < mid) {
        left.push(a[i])
      } else {
        right.push(a[i])
      }
    }

    return [...recur(left), mid, ...recur(right)]
  }

  return recur(arr).slice(0, k)
}
```

---

## [剑指 Offer 41. 数据流中的中位数](https://leetcode-cn.com/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/)

### 描述

如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。

例如，

[2,3,4]  的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

### 解答

之前遇到一个用链表优化的，借此机会试一试，用数组也行，这里故意饶了一下弯子：

```javascript
function Node(val) {
  this.val = val
  this.next = null
}

/**
 * initialize your data structure here.
 */
var MedianFinder = function () {
  this.totalNode = 0
  this.headNode = null
  this.pNode = null
  this.target = null
}

/**
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function (num) {
  let newNode = new Node(num)
  this.totalNode++
  if (!this.headNode) {
    this.pNode = this.headNode = new Node(num)
  }
  this.target = this.totalNode % 2 === 0 ? this.totalNode / 2 - 1 : Math.floor(this.totalNode / 2)
  // 重置为头节点
  this.pNode = this.headNode
  for (let i = 0; i < this.totalNode - 1; i++) {
    if (this.pNode.val <= num && (!this.pNode.next || this.pNode.next.val > num)) {
      let temp = this.pNode.next
      this.pNode.next = newNode
      this.pNode.next.next = temp
      break
    } else if (this.pNode.val > num) {
      newNode.next = this.pNode
      this.headNode = newNode
      break
    }
    this.pNode = this.pNode.next
  }
}

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function () {
  this.pNode = this.headNode
  for (let i = 0; i < this.target; i++) {
    this.pNode = this.pNode.next
  }
  return this.totalNode % 2 === 0 ? (this.pNode.val + this.pNode.next.val) / 2 : this.pNode.val
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
```
