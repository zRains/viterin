---
date: 1649088924000
title: 'D8 - 动态规划（简单）'
order: 8
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 10- I. 斐波那契数列](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/)

### 描述

写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

```text
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

### 解答

70 次左右已经超过 JS 数值类型的安全范围了，需要提前对每个计算进行模运算（Python 好像不需要，数值大小取决于运行内存）：

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  const result = [0, 1]
  if (n <= 1) return result[n]
  for (let i = 0; i < n - 1; i++) {
    let temp = result[0]
    result[0] = result[1]
    result[1] = (temp + result[1]) % 1000000007
  }
  return result[1]
}
```

---

## [剑指 Offer 10- II. 青蛙跳台阶问题](https://leetcode-cn.com/problems/qing-wa-tiao-tai-jie-wen-ti-lcof/)

### 描述

一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级台阶。求该青蛙跳上一个 n  级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

### 解答

这题和上面的斐波那契数列一样，只是起始数字不一样。

此类求 多少种可能性 的题目一般都有 递推性质 ，即`f(n)`和`f(n−1)…f(1)`之间是有联系的。

设跳上`n`级台阶有`f(n)`种跳法。在所有跳法中，青蛙的最后一步只有两种情况： 跳上 1 级或 2 级台阶。

- 当为 1 级台阶： 剩`n-1`个台阶，此情况共有`f(n-1)`种跳法；
- 当为 2 级台阶： 剩`n-2`个台阶，此情况共有`f(n-2)`种跳法。

`f(n)`为以上两种情况之和，即`f(n)=f(n-1)++f(n−2)` 。

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var numWays = function (n) {
  const result = [1, 1]
  if (n <= 1) return result[n]
  for (let i = 0; i < n - 1; i++) {
    let temp = result[0]
    result[0] = result[1]
    result[1] = (temp + result[1]) % 1000000007
  }
  return result[1]
}
```

## [剑指 Offer 63. 股票的最大利润](https://leetcode-cn.com/problems/gu-piao-de-zui-da-li-run-lcof/)

### 描述

假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

```text
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```

### 解答

自己用了两层循环，效率自然低，看了评论区才知道人与人的差距是多么大。

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  const pLen = prices.length
  let result = 0
  for (let i = 0; i < pLen - 1; i++) {
    for (let j = i + 1; j <= pLen - 1; j++) {
      if (prices[i] < prices[j]) {
        result = Math.max(result, prices[j] - prices[i])
      }
    }
  }
  return result
}
```

使用动态规划，执行时间直接是原先的五分之一，

```javascript
let maxProfit = function (prices) {
  const pLen = prices.length
  let cost = Infinity
  let result = 0
  for (let i = 0; i < pLen; i++) {
    // 获取最少花费购买金额
    cost = Math.min(cost, prices[i])
    // 判断当前利润是否大于之前的利润
    result = Math.max(result, prices[i] - cost)
  }
  return result
}
```
