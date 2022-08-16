---
date: 1649607324000
title: 'D14 - 搜索与回溯算法1（中等）'
order: 14
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 12. 矩阵中的路径](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/)

### 描述

给定一个  m x n 二维字符网格  board 和一个字符串单词  word 。如果  word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

例如，在下面的 3×4 的矩阵中包含单词 "ABCCED"（单词中的字母已标出）。

![ju-zhen-zhong-de-lu-jing-lcof](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

### 解决

脑子一抽，第一次使用的是用哈希表存储 board 里的全部字符的位置，之后一个一个匹配。看下一个字符是不是在附近。太麻烦了而且效率较低，后来看了解析，用了深度优先搜索：

```javascript
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (dfs(board, word, i, j, 0)) return true
    }
  }
  return false
}

function dfs(board, word, i, j, k) {
  if (i >= board.length || i < 0 || j >= board[0].length || j < 0 || board[i][j] !== word[k]) return false
  if (k === word.length - 1) return true
  // 当前字符匹配成功，走过的先置为空字符，防止重复利用。
  board[i][j] = ''
  // 判断各个方向
  const result =
    dfs(board, word, i + 1, j, k + 1) ||
    dfs(board, word, i - 1, j, k + 1) ||
    dfs(board, word, i, j + 1, k + 1) ||
    dfs(board, word, i, j - 1, k + 1)
  // 还原矩阵
  board[i][j] = word[k]
  return result
}
```

---

## [剑指 Offer 13. 机器人的运动范围](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/)

### 描述

地上有一个 m 行 n 列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于 k 的格子。例如，当 k 为 18 时，机器人能够进入方格 [35, 37] ，因为 3+5+3+7=18。但它不能进入方格 [35, 38]，因为 3+5+3+8=19。请问该机器人能够到达多少个格子？

### 解答

参考了上一题的解题思路，这个不用遍历了：

```javascript
/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var movingCount = function (m, n, k) {
  const resMap = new Set()
  dfs(m, n, 0, 0, k, resMap)
  console.log(resMap)
  return resMap.size
}

/**
 * @param {number} m
 * @param {number} n
 * @param {number} i
 * @param {number} j
 * @param {number} k
 * @param {Map} resMap
 */
function dfs(m, n, i, j, k, resMap) {
  if (i < 0 || i >= m || j < 0 || j >= n) return
  let targetSum = sum(i) + sum(j)
  if (targetSum > k || resMap.has(`${i}${j}`)) return
  resMap.add(`${i}${j}`)
  dfs(m, n, i - 1, j, k, resMap)
  dfs(m, n, i + 1, j, k, resMap)
  dfs(m, n, i, j - 1, k, resMap)
  dfs(m, n, i, j + 1, k, resMap)
}

/**
 * @param {number} x
 */
function sum(x) {
  let res = 0
  while (x > 0) {
    res += x % 10
    x = Math.floor(x / 10)
  }
  return res
}
```
