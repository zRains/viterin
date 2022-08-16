---
date: 1649780124000
title: 'D16 - 排序（简单）'
order: 16
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 45. 把数组排成最小的数](https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/)

### 描述

输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

### 解答

这题最大的难点就是如何排序：

若拼接字符串 x + y > y + x ，则 x “大于” y ；

反之，若 x + y < y + x ，则 x “小于” y ；

```javascript
/**
 * @param {number[]} nums
 * @return {string}
 */
var minNumber = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length - 1 - i; j++) {
      if (`${nums[j + 1]}${nums[j]}` <= `${nums[j]}${nums[j + 1]}`) {
        nums[j] += nums[j + 1]
        nums[j + 1] = nums[j] - nums[j + 1]
        nums[j] -= nums[j + 1]
      }
    }
  }

  return nums.join('')
}
```

---

## [剑指 Offer 61. 扑克牌中的顺子](https://leetcode-cn.com/problems/bu-ke-pai-zhong-de-shun-zi-lcof/)

### 描述

从**若干副扑克牌**中随机抽 5 张牌，判断是不是一个顺子，即这 5 张牌是不是连续的。2 ～ 10 为数字本身，A 为 1，J 为 11，Q 为 12，K 为 13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

### 解答

有点坑，leetcode 的测试点全的很。。。

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function (nums) {
  let i,
    j,
    diff = 0,
    perf = 0
  for (i = 0; i < nums.length; i++) {
    for (j = 0; j < nums.length - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        nums[j] += nums[j + 1]
        nums[j + 1] = nums[j] - nums[j + 1]
        nums[j] -= nums[j + 1]
      }
    }
  }
  diff = nums[0] === 0 ? 0 : nums[0] - 1
  for (i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1] && nums[i] !== 0) return false
    if (nums[i] === 0) {
      perf++
    } else {
      diff += nums[i + 1] - nums[i] - 1
    }
  }
  return diff <= perf
}
```
