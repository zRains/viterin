---
date: 1648829724000
title: '第5天 - 查找算法（中等）'
layout: 'doc'
---

## [剑指 Offer 04. 二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/)

### 描述

在一个 n \* m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

### 解答

若使用暴力法遍历矩阵 `matrix` ，则时间复杂度为 O(NM)O(NM) 。暴力法未利用矩阵 **“从上到下递增、从左到右递增”** 的特点，显然不是最优解法。

我们可以将二维数组的索引元素置于左下角：

![二维数组中的查找-1](https://res.zrain.fun/images/2022/04/6a083897417b51e94ed84e3483d334078d851e691eb8655b45432372ecdea9d6-Picture2-3c1ea7bf7256b33edcedcb9ad1db44bb.png)

这就有一个特性：每行最小的在第一个，如果要查找的数比这个还小，就能推断出这个数一定不在这一行，这时便可消去这一行。重复上一步骤，直到刚好小于目标值的那一行。
由于列是**从上到下递增**，利用这个特性，如果当前数字小于目标值，说明上面的数字肯定达不到要求，这时就可消除此列：

![二维数组中的查找-2](https://res.zrain.fun/images/2022/04/116704601a28972d17b32cc641485a1ab707930504a720160e121b092e9f7084-Picture6-e7e14551a5524b4bb4e8785a53d6563c.png)

如此往复，就可找到目标值：

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function (matrix, target) {
  const m = matrix.length
  if (m === 0) return false
  const n = matrix[0].length
  let x = m - 1,
    y = 0
  while (x >= 0 && y <= n - 1) {
    if (matrix[x][y] > target) {
      x--
    } else if (matrix[x][y] < target) {
      y++
    } else {
      return true
    }
  }
  return false
}
```

<small>\* 引用自[Krahets - 面试题 04. 二维数组中的查找（标志数，清晰图解）](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/solution/mian-shi-ti-04-er-wei-shu-zu-zhong-de-cha-zhao-zuo/)</small>

---

## [剑指 Offer 11. 旋转数组的最小数字](https://leetcode-cn.com/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/)

### 描述

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。

给你一个可能存在重复元素值的数组  numbers ，它原来是一个升序排列的数组，并按上述情形进行了一次旋转。请返回旋转数组的最小元素。例如，数组  `[3,4,5,1,2]` 为 `[1,2,3,4,5]` 的一次旋转，该数组的最小值为 1。

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` 旋转一次 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

### 解答

很简单，判断前一个数字是否大于最后一个数字，如果是，则表明这里是旋转后的拼接点：

```javascript
/**
 * @param {number[]} numbers
 * @return {number}
 */
var minArray = function (numbers) {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > numbers[i + 1]) {
      return numbers[i + 1]
    }
  }
  return numbers[0]
}
```

---

## [剑指 Offer 50. 第一个只出现一次的字符](https://leetcode-cn.com/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/)

### 描述

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

### 解答

不用说，绝对是哈希表。这里用了 JS 的`Map`。

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
