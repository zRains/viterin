---
date: 1649175324000
title: '第9天 - 动态规划1（中等）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 42. 连续子数组的最大和](https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/)

### 描述

输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为 **O(n)**。

### 解答

| 常见解法 | 时间复杂度 | 空间复杂度 |
| -------- | ---------- | ---------- |
| 暴力搜索 | O(N^2)     | O(1)       |
| 分治思想 | O(NlogN)   | O(logN)    |
| 动态规划 | O(N)       | O(1)       |

动态规划对我这种小白实属降维打击。

转移方程： 若`dp[i-1] <= 0`，说明`dp[i - 1]`对`dp[i]`产生负贡献，即`dp[i-1] + nums[i]`还不如`nums[i]`本身大。

当`dp[i - 1] > 0`时：执行`dp[i] = dp[i-1] + nums[i]`；

当`dp[i - 1] <= 0`时：执行`dp[i] = nums[i]`；

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */

var maxSubArray = function (nums) {
  let result = nums[0]
  for (let i = 1; i < nums.length; i++) {
    nums[i] = nums[i] + Math.max(nums[i - 1], 0)
    result = Math.max(result, nums[i])
  }
  return result
}
```

---

## [剑指 Offer 47. 礼物的最大价值](https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof/)

### 描述

在一个 m\*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

### 解答

这回总算有点头目了，题目规定一个格子只能从左边或者上边到达。由此可得：

- 当`i = j = 0`时为起始元素。
- 当`i = 0; j != 0`时为矩阵第一行元素，只能从左边到达。
- 当`i != 0; j = 0`时为第一列元素，只能从上边到达。
- 当`i != 0; j != 0`时处于内部，可以从左边或上边到达。

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxValue = function (grid) {
  const m = grid.length,
    n = grid[0].length
  let result = grid[0][0]
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) {
      } else if (i === 0 && j !== 0) {
        grid[i][j] += grid[i][j - 1]
      } else if (i !== 0 && j === 0) {
        grid[i][j] += grid[i - 1][j]
      } else if (i !== 0 && j !== 0) {
        grid[i][j] += Math.max(grid[i - 1][j], grid[i][j - 1])
      }
      result = grid[i][j]
    }
  }
  return result
}
```
