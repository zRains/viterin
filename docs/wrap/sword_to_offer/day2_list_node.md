---
date: 1648570524000
title: 'D2 - 链表（简单）'
order: 2
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 06. 从尾到头打印链表](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

### 描述

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

### 解答

最开始想到的是递归：递归到最后一个节点，之后一边回溯一边记录，最后输出。但如果链表过长，可能导致性能问题：

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
 * @return {number[]}
 */
var reversePrint = function (head) {
  if (head) {
    return head.next ? reversePrint(head.next).concat(head.val) : [head.val]
  } else {
    return []
  }
}
```

之后看题解发现也可以用`stack`方式实现（是不是我像太复杂了 🤣），首先遍历链表，把每个值记录到（push）数组中，最后打印输出（pop）。

---

## [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

### 描述

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

### 解答

经典中的节点，但总是忘。先定义一个`先前节点`，由于未知，就自然置为`null`，之后保存下一节点的地址，此时再将`当前节点`设置为当前节点。

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
 * @return {ListNode}
 */
var reverseList = function (head) {
  let pev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = pev
    pev = curr
    curr = next
  }
  return pev
}
```

---

## [剑指 Offer 35. 复杂链表的复制](https://leetcode-cn.com/problems/fu-za-lian-biao-de-fu-zhi-lcof/)

### 描述

请实现 copyRandomList 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 next 指针指向下一个节点，还有一个 random 指针指向链表中的任意节点或者 null。

### 解答

本题要求我们对一个特殊的链表进行深拷贝。如果是普通链表，我们可以直接按照遍历的顺序创建链表节点。而本题中因为随机指针的存在，当我们拷贝节点时，「当前节点的随机指针指向的节点」可能还没创建，因此我们需要变换思路。一个可行方案是，我们利用回溯的方式，**让每个节点的拷贝操作相互独立**。对于当前节点，我们首先要进行拷贝，然后我们进行「当前节点的后继节点」和「当前节点的随机指针指向的节点」拷贝，拷贝完成后将创建的新节点的指针返回，即可完成当前节点的两指针的赋值。

```javascript
var copyRandomList = function (head, cachedNode = new Map()) {
  if (head === null) {
    return null
  }
  if (!cachedNode.has(head)) {
    cachedNode.set(head, { val: head.val })
    Object.assign(cachedNode.get(head), {
      // 注意顺序：next在先的目的是正常遍历节点，并把节点结果存储到cachedNode
      next: copyRandomList(head.next, cachedNode),
      // random在后的目的是此时整个链表已经遍历完毕,可以直接从cachedNode获取
      random: copyRandomList(head.random, cachedNode)
    })
  }
  return cachedNode.get(head)
}
```
