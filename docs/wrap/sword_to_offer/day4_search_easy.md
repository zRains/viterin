---
date: 1648743324000
title: '第4天 - 查找算法（简单）'
layout: 'doc'
---

## [剑指 Offer 03. 数组中重复的数字](https://leetcode-cn.com/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/)

### 描述

找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0 ～ n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

### 解答

哈希的作用之处，用了 JS 的`Map`。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function (nums) {
  const numMap = new Set()
  for (let i = 0; i < nums.length; i++) {
    if (numMap.has(nums[i])) {
      return nums[i]
    } else {
      numMap.add(nums[i])
    }
  }
}
```
