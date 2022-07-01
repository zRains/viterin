---
date: 1650039324000
title: '第19天 - 搜索与回溯算法4（中等）'
layout: 'doc'
---

## [剑指 Offer 64. 求 1+2+…+n](https://leetcode-cn.com/problems/qiu-12n-lcof/)

### 描述

求 `1+2+...+n` ，要求不能使用乘除法、for、while、if、else、switch、case 等关键字及条件判断语句（A?B:C）。

### 解答

第一次可带**脑筋急转弯**这个标签的题。先上上等差数列求和公式：

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var sumNums = function (n) {
  return (n * (1 + n)) / 2
}
```

用了**乘除法**不符合题意，pass！

我们可以借助递归和短路：

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var sumNums = function (n) {
  n !== 1 && (n += sumNums(n - 1))
  return n
}
```

符合题意，有点像[TC](/wrap/type_challenge/)挑战了哈哈。😆
