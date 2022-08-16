---
date: 1649693724000
title: 'D15 - 搜索与回溯算法2（中等）'
order: 15
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 34. 二叉树中和为某一值的路径](https://leetcode-cn.com/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/)

### 描述

给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

> 叶子节点 是指没有子节点的节点。

### 解答

第一次使用先序遍历，一直向下传递当前数组，效率实在太低了，自己都看不下去了：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} target
 * @return {number[][]}
 */
var pathSum = function (root, target) {
  let result = []
  const check = (r, t, res = []) => {
    if (!r.left && !r.right) {
      if (r.val === t) result.push([...res, r.val])
      return t === 0
    }
    if (r.left) check(r.left, t - r.val, [...res, r.val])
    if (r.right) check(r.right, t - r.val, [...res, r.val])
    return false
  }
  root && check(root, target)
  return result
}
```

我看了一下解析，思路一样，为什么效率差这么大？🤣

---

## [剑指 Offer 36. 二叉搜索树与双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

### 描述

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

为了让您更好地理解问题，以下面的二叉搜索树为例：

![bstdlloriginalbst-1](https://assets.leetcode.com/uploads/2018/10/12/bstdlloriginalbst.png)

我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。

下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。

![bstdlloriginalbst-2](https://assets.leetcode.com/uploads/2018/10/12/bstdllreturndll.png)

特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。

> 二叉搜索树( binary search tree)是一棵二叉树，可能为空; 一棵非空的二叉搜索树满足以下特征:
>
> 1. 每个元素有一个关键字，并且任意两个元素的关键字都不同;因此，所有的关键字都是唯一的。
> 2. 在根节点的左子树中，元素的关键字(如果有的话)都小于根节点的关键字。（降序排列）。
> 3. 在根节点的右子树中，元素的关键字(如果有的话)都大于根节点的关键字。（升序排列）。
> 4. 根节点的左、右子树也都是二叉搜索树。

### 解答

我们可以利用上述二叉搜索树的特征，使用中序遍历，这样就可以获得一个递增的节点列表，将其存入数组，之后遍历修改左右节点。

```javascript
/**
 * // Definition for a Node.
 * function Node(val,left,right) {
 *    this.val = val;
 *    this.left = left;
 *    this.right = right;
 * };
 */
/**
 * @param {Node} root
 * @return {Node}
 */
var treeToDoublyList = function (root) {
  const stack = []
  const recur = (r) => {
    if (!r) {
      return null
    }
    recur(r.left)
    stack.push(r)
    recur(r.right)
  }
  recur(root)
  let nodeLen = stack.length
  for (let i = 0; i < nodeLen; i++) {
    stack[i].left = stack[i - 1] || stack[nodeLen - 1]
    stack[i].right = stack[i + 1] || stack[0]
  }
  return stack[0]
}
```

---

## [剑指 Offer 54. 二叉搜索树的第 k 大节点](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

### 描述

给定一棵二叉搜索树，请找出其中第 k 大的节点的值。

### 解答

既然这个找最大，那就先去右子节点，在根节点，最后是左子节点。当找到结果时中断递归：

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
 * @param {number} k
 * @return {number}
 */
var kthLargest = function (root, k) {
  let result
  const recur = (r) => {
    if (!r || result) {
      return null
    }
    recur(r.right)
    if (--k === 0) result = r.val
    recur(r.left)
  }
  recur(root)
  return result
}
```
