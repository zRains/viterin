---
date: 1649348124000
title: '第11天 - 双指针1（简单）'
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 18. 删除链表的节点](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

### 描述

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。

### 解答

很简单的一个方法，新建一个头节点，如果当前节点的下一个节点的值正好是要找的值，则将当前节点的下一个节点指针指向下下个节点：

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function (head, val) {
  let h = new ListNode(null)
  let result = h
  h.next = head
  while (h) {
    // 需要判断下一个节点是否为空，如果为空val必然不存在
    if (h.next && h.next.val === val) {
      h.next = h.next.next
    }
    h = h.next
  }
  return result.next
}
```

---

## [剑指 Offer 22. 链表中倒数第 k 个节点](https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

### 描述

输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

### 解答

我的想法是先递归到最后一个，同时记录节点个数，回溯的时候再判断是否返回当前节点：

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function (head, k, i = 0, result = []) {
  if (!head) {
    return new ListNode(i)
  }
  let deepNode = getKthFromEnd(head.next, k, i + 1, result)
  if (!result[0] && deepNode.val - k === i) {
    result.push(head)
    return result[0]
  } else {
    return deepNode
  }
}
```

看解析用的双指针，我也来实现一下吧：

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function (head, k) {
  let a = (b = head)
  while (b) {
    if (k-- <= 0) a = a.next
    b = b.next
  }
  return a
}
```

递归速度要快些，双指针内存消耗的比较小。
