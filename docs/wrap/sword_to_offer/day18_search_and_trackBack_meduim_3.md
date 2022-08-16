---
date: 1649952924000
title: 'D18 - 搜索与回溯算法3（中等）'
order: 18
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 55 - I. 二叉树的深度](https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/)

### 描述

输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树的深度。

例如：

给定二叉树 [3,9,20,null,null,15,7]，

```text
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度 3 。

### 解答

一个感觉不是我自己想出来的方法：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  return root == null ? 0 : Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}
```

---

## [剑指 Offer 55 - II. 平衡二叉树](https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/)

### 描述

输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的**左右子树的深度**相差不超过 1，那么它就是一棵平衡二叉树。

### 解答

先序遍历 + 判断深度 （从顶至底），有了上一题的经验，直接判断每个子节点左右数的深度的差值就行了：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
  if (!root) return true
  return nodeBalanced(root) && isBalanced(root.left) && isBalanced(root.right)
}

function nodeBalanced(root) {
  const recur = (r) => (!r ? 0 : Math.max(recur(r.left), recur(r.right)) + 1)
  return Math.abs(recur(root.left) - recur(root.right)) <= 1
}
```

看了下解析，正好有这种解法，但作者对其评价是：

> 此方法容易想到，但会产生大量重复计算，时间复杂度较高。

后序遍历 + 剪枝 （从底至顶）解法：

> 此方法为本题的最优解法，但剪枝的方法不易第一时间想到。

```javascript
var isBalanced = function (root) {
  const recur = (r) => {
    if (r == null) return 0
    let left = recur(r.left)
    if (left == -1) return -1
    let right = recur(r.right)
    if (right == -1) return -1
    return Math.abs(left - right) < 2 ? Math.max(left, right) + 1 : -1
  }
  return recur(root) !== -1
}
```