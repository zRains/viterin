---
date: 1649520924000
title: '第13天 - 双指针3（简单）'
layout: 'doc'
---

## [剑指 Offer 21. 调整数组顺序使奇数位于偶数前面](https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

### 描述

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

### 解答

第一次用了一个笨方法，效率极低：

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function (nums) {
  let result = []
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) result.push(nums[i])
    else result.unshift(nums[i])
  }
  return result
}
```

上面代码空间复杂度`O(N)`，涉及到数组操作。下面用了双指针，效率上有很大提升：

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function (nums) {
  let s = 0,
    e = nums.length - 1
  if (nums.length <= 1) return nums
  while (true) {
    if (s === e) {
      return nums
    }
    if (nums[s] % 2 === 1) {
      s++
    } else if (nums[e] % 2 === 0) {
      e--
    } else {
      nums[s] = nums[s] + nums[e]
      nums[e] = nums[s] - nums[e]
      nums[s] = nums[s] - nums[e]
    }
  }
}
```

---

## [剑指 Offer 57. 和为 s 的两个数字](https://leetcode-cn.com/problems/he-wei-sde-liang-ge-shu-zi-lcof/)

### 描述

输入一个递增排序的数组和一个数字 s，在数组中查找两个数，使得它们的和正好是 s。如果有多对数字的和等于 s，则输出任意一对即可。

### 解答

双指针轻轻松松：

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let s = 0,
    e = nums.length - 1
  while (s < e) {
    if (nums[s] + nums[e] > target) {
      e--
    } else if (nums[s] + nums[e] < target) {
      s++
    } else {
      return [nums[s], nums[e]]
    }
  }
}
```

---

## [剑指 Offer 58 - I. 翻转单词顺序](https://leetcode-cn.com/problems/fan-zhuan-dan-ci-shun-xu-lcof/)

### 描述

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

### 解答

有点投机取巧了：

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  let res = s.match(/(?<=\s*)(\S+)(?=\s*)/g)
  return res ? res.reverse().join(' ') : ''
}
```
