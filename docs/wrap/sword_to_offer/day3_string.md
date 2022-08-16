---
date: 1648656924000
title: '第3天 - 字符串（简单）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 05. 替换空格](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)

### 描述

请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

### 解答

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function (s) {
  return s.replace(/\s/g, '%20')
}
```

---

## [剑指 Offer 58 - II. 左旋转字符串](https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

### 描述

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字 2，该函数将返回左旋转两位得到的结果"cdefgab"。

### 解答

基础题。

```javascript
/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = function (s, n) {
  return s.substring(n) + s.substring(0, n)
}
```

---

## [剑指 Offer 53 - I. 在排序数组中查找数字 I](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

### 描述

统计一个数字在排序数组中出现的次数。

### 解答

想要效率高，就得用`二分查找`找到目标数字再开始计数。这种有序数组要首先想到`二分查找`。

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let i = 0,
    j = nums.length - 1,
    count = 0
  while (i <= j) {
    let m = Math.floor((i + j) / 2)
    if (nums[m] <= target - 1) i = m + 1
    else j = m - 1
  }
  while (nums[(j = j + 1)] === target) {
    count++
  }
  return count
}
```

---

## [剑指 Offer 50. 第一个只出现一次的字符](https://leetcode-cn.com/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/)

### 描述

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

### 解答

遍历整个字符串，使用`Map`统计每个字符出现的次数。

```javascript
/**
 * @param {string} s
 * @return {character}
 */
var firstUniqChar = function (s) {
  const temp = new Map()
  for (let i = 0; i < s.length; i++) {
    if (temp.has(s[i])) {
      temp.set(s[i], temp.get(s[i]) + 1)
    } else {
      temp.set(s[i], 1)
    }
  }
  for (const [k, v] of temp) {
    if (v === 1) {
      return k
    }
  }
  return ' '
}
```
