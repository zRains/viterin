---
date: 1649002524000
title: 'D7 - 搜索与回溯算法2（简单）'
order: 7
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 26. 树的子结构](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/)

### 描述

输入两棵二叉树 A 和 B，判断 B 是不是 A 的子结构。(约定空树不是任意一个树的子结构)

B 是 A 的子结构， 即 A 中有出现和 B 相同的结构和节点值。

例如，给定的树 A:

```text
    3
   / \
  4   5
 / \
1   2
```

给定的树 B：

```text
   4 
  /
 1
```

返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

### 解答

这个题我首先想到是将整个链表`降维处理`，就如上面的例子，可以降成如下数组：

```javascript
const treeA = [1, 4, 2, 3, null, 5]
const treeB = [1, 4]
```

可以判断 1`treeA`的子串`[1,4]`和`treeB`一致，就可以表明有此结构。但没有实现。我太菜了 😂。

看了一下题解发现一个巧妙的解法：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function (A, B) {
  if (A == null || B == null) return false
  return dfs(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
}

function dfs(A, B) {
  if (B == null) return true
  if (A == null) return false
  return A.val == B.val && dfs(A.left, B.left) && dfs(A.right, B.right)
}
```

首先是特殊情况：`A`或`B`其中一个头节点为`null`即可返回`false`。之后则是一个二叉树的`先序遍历`，如果父节点相同表明可以开始判断剩余的子节点是否一致，如果匹配失败则开始递归`A`的左子节点，`dfs(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)`可以保证`A`的子节点全被被遍历到。这个方式效率有点低，毕竟时间复杂度为`O(MN)`。

---

## [剑指 Offer 27. 二叉树的镜像](https://leetcode-cn.com/problems/er-cha-shu-de-jing-xiang-lcof/)

### 描述

请完成一个函数，输入一个二叉树，该函数输出它的镜像。

例如输入：

```text
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

镜像输出：

```text
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

### 解答

可见这种结构就知道属于递归：

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
 * @return {TreeNode}
 */
var mirrorTree = function (root) {
  if (!root) {
    return null
  }
  // 记录一下左子节点
  let nodeRight = root.right
  root.right = mirrorTree(root.left)
  root.left = mirrorTree(noteRight)
  return root
}
```

---

## [剑指 Offer 28. 对称的二叉树](https://leetcode-cn.com/problems/dui-cheng-de-er-cha-shu-lcof/)

### 描述

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

例如，二叉树  [1,2,2,3,4,4,3] 是对称的。

```text
    1
   / \
  2   2
 / \ / \
3  4 4  3

```

但是下面这个  [1,2,2,null,3,null,3] 则不是镜像对称的:

```text
    1
   / \
  2   2
   \   \
   3    3
```

### 解答

我一开始想到的是使用昨天[剑指 Offer 32 - II. 从上到下打印二叉树 II](/wrap/sword_to_offer/day6_search_and_trackBack_easy_1)，将不存在的左右子节点置为 null，之后先判断是否是偶数，然后检测一下是否为回文。

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
var isSymmetric = function (root) {
  if (!root) return true
  const mapper = (r, res = [], d = 0) => {
    if (res[d]) res[d].push(r ? r.val : null)
    else res[d] = [r ? r.val : null]
    if (!r) {
      return null
    }
    mapper(r.left, res, d + 1)
    mapper(r.right, res, d + 1)
    return res
  }
  const nodeMapper = mapper(root)
  for (let i = 0; i < nodeMapper.length; i++) {
    let nodeLength = nodeMapper[i].length
    if (nodeLength % 2 !== 0 && i !== 0) return false
    for (let j = 0; j < Math.floor(nodeLength / 2); j++) {
      if (nodeMapper[i][j] !== nodeMapper[i][nodeLength - 1 - j]) {
        return false
      }
    }
  }
  return true
}
```

在题解中看到了用递归+回溯的方法：

```javascript
var isSymmetric = function (root) {
  return root == null ? true : recur(root.left, root.right)
}

function recur(L, R) {
  // L R同时为null，表明已经到了最后一层的下一层
  if (L === null && R === null) return true
  // L R其中一个为null，表明其中一个分支先遍历完成，即可判断为不对称
  if (L === null || R === null || L.val !== R.val) return false
  // 同时判断左右节点
  return recur(L.left, R.right) && recur(L.right, R.left)
}
```
