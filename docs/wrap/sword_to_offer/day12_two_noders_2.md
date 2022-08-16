---
date: 1649434524000
title: '第12天 - 双指针2（简单）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 25. 合并两个排序的链表](https://leetcode-cn.com/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

### 描述

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

### 解答

构造一个头节点，之后进行比较，小的往后加。最后可能出现其中一个链表先遍历完，也很好处理，因为节点都是递增的，因此剩余未遍历的节点肯定都比之前的节点大，直接挂在后面就行了。

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  let p1 = l1,
    p2 = l2,
    newNode = new ListNode(0),
    h = newNode
  while (p1 && p2) {
    if (p1.val < p2.val) {
      h.next = p1
      p1 = p1.next
    } else {
      h.next = p2
      p2 = p2.next
    }
    h = h.next
  }
  h.next = p1 ? p1 : p2
  return newNode.next
}
```

---

## [剑指 Offer 52. 两个链表的第一个公共节点](https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

### 描述

输入两个链表，找出它们的第一个公共节点。

### 解答

同样的，没用双指针，用了一个哈希表：

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  const set = new Set()
  while (headA) {
    set.add(headA)
    headA = headA.next
  }
  while (headB) {
    if (set.has(headB)) {
      return headB
    }
    headB = headB.next
  }
  return null
}
```