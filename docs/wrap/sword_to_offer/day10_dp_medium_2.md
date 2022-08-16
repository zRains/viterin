---
date: 1649261724000
title: '第10天 - 动态规划2（中等）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 46. 把数字翻译成字符串](https://leetcode-cn.com/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof/)

### 描述

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

### 解答

之前用了找规律方法（有点像在找状态转移方程）的偏方法，老是有几个测试用例不通过，看来还是要一步步来啊。方法用的求余，如果不这样做将会浪费 O(N)大小的字符列表空间。

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function (num) {
  if (num < 10) return 1
  if (num <= 25) return 2
  let a = 1,
    b = 1,
    perNum = num % 10
  while (num !== 0) {
    num = Math.floor(num / 10)
    let cutNum = num % 10
    let currNum = cutNum * 10 + perNum
    let temp = 10 <= currNum && currNum <= 25 ? a + b : a
    b = a
    a = temp
    perNum = cutNum
  }
  return a
}
```
