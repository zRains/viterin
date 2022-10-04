---
toc: false
date: 1660200428044
title: '力扣100题'
scope: ['algorithm']
draft: false
visible: true
lang: 'zh'
layout: 'page'

head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

题目摘自于[BiliBili](https://www.bilibili.com/video/BV1eg411w7gn)

## [爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

### 描述

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

### 解决

可以理解为当爬到第 n 个台阶时的方法个数为$f(n) = f(n - 1) + f(n - 2)$，即爬 1 阶到 n-1 阶与爬 2 阶到 n-1 阶方法数的总和：

<CenterImg src="https://res.zrain.fun/images/2022/08/leetcode_100_climb%20stairs.png" alt="leetcode_100_climb_stairs" zoom="60%"/>

从上图看出$f(3) = f(2) + f(1)$，可以进一步得出下面的递归公式：

$$
f(n) = \begin{cases}
1 & n = 1 \\
2 & n = 2 \\
f(n - 1) + f(n - 2) & n \geqslant 3
\end{cases}
$$

我们可以得出以下代码：

```rust
impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        if n == 1 {
            return 1;
        }

        if n == 2 {
            return 2;
        }

        Solution::climb_stairs(n - 1) + Solution::climb_stairs(n - 2)
    }
}
```

但提交时会发现超时，最后发现以上递归出现了大量重复计算，以$f(6)$为例：

<CenterImg src="https://res.zrain.fun/images/2022/08/leetcode_100_climb%20stairs_2.png" alt="leetcode_100_climb_stairs_2" zoom="60%" />

其中$f(4)f(3)$进行了重复的求值，可以使用 `HashMap` 进行优化：

```rust
use std::{cell::RefCell, collections::HashMap, rc::Rc};

impl Solution {
    pub fn recur(n: i32, map: Rc<RefCell<HashMap<i32, i32>>>) -> i32 {
        if map.borrow().contains_key(&n) {
            return map.borrow().get(&n).unwrap().clone();
        } else {
            let result =
                Solution::recur(n - 1, Rc::clone(&map)) + Solution::recur(n - 2, Rc::clone(&map));

            map.borrow_mut().insert(n, result);

            return result;
        }
    }

    pub fn climb_stairs(n: i32) -> i32 {
        let mut map = HashMap::from([(1, 1), (2, 2)]);

        Solution::recur(n, Rc::new(RefCell::new(map)))
    }
}
```

另外递归也可以转换为递推，递归在数据量大时可能会出现栈溢出的情况，转换为递推往往是一种不错的优化：

```rust
impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        if n == 1 {
            return 1;
        }

        if n == 2 {
            return 2;
        }

        let mut result = 0;
        let mut pre = 2;
        let mut pre_pre = 1;

        for _ in 3..=n {
            result = pre + pre_pre;
            pre_pre = pre;
            pre = result;
        }

        result
    }
}
```

## [斐波那契数列](https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/)

Ref: [剑指 Offer 10- I. 斐波那契数列](/wrap/sword_to_offer/day8_dp_easy.html#剑指-offer-10-i-斐波那契数列)

## [两数之和](https://leetcode.cn/problems/two-sum/)

### 描述

给定一个整数数组 nums  和一个整数目标值 target，请你在该数组中找出和为目标值 target  的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。你可以按任意顺序返回答案。

### 解决

首先想到的是暴力解法，用两层循环检查每两数之和。显而易见这种解法效率不高，时间复杂度为$O(n^2)$，🐶 见了都摇头。另一种较为高效的解法是找当前数字的差值，如果没有则将此数和其索引保存以供后续数字查找：

<CenterImg src="https://res.zrain.fun/images/2022/08/two_sum_example.png" alt="two_sum_example" zoom="60%"/>

以待查找数组 `[2, 7, 11, 5]` 为例来查找目标数字 13：

1. 遍历到 2，发现 map 中并没有 `13 - 2 = 9`，于是把 2 放入 map，开始下一个数。
2. 如此下去，当遍历到 11 时，发现存在 `13 - 11 = 2` 于是返回当前索引和 map 中匹配数字到索引。

具体实现如下：

```rust
use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map = HashMap::<i32, i32>::new();
        for (idx, num) in nums.iter().enumerate() {
            let diff = target - num;

            if map.contains_key(&diff) {
                return vec![idx as i32, map.get(&diff).unwrap().clone()];
            } else {
                map.insert(num.clone(), idx as i32);
            }
        }

        vec![0, 0]
    }
}
```

## [合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)

### 描述

给你两个按**非递减顺序**排列的整数数组  nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。

请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。

注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

### 解决

首先是最简单的办法，直接通过循环将 nums2 中的数据拷贝到 nums1 中，最后通过排序算法。但都没用到非递减顺序这个条件。

之后是通过申请一个大小为两数组大小总和的新数组，通过双指针进行操作，下图是每一个时刻到状态：

<CenterImg src="https://res.zrain.fun/images/2022/08/merge_sorted_array.png" alt="merge_sorted_array" zoom="60%"/>

代码实现：

```rust
impl Solution {
    pub fn merge(nums1: &mut Vec<i32>, m: i32, nums2: &mut Vec<i32>, n: i32) {
        let total = (m + n) as usize;
        let mut n1_idx: usize = 0;
        let mut n2_idx: usize = 0;
        let mut temp_arr = vec![0; total];

        for idx in 0..total {
            if n1_idx >= m as usize {
                temp_arr[idx] = nums2[n2_idx];
                n2_idx += 1;
            } else if n2_idx >= n as usize {
                temp_arr[idx] = nums1[n1_idx];
                n1_idx += 1;
            } else if nums1[n1_idx] > nums2[n2_idx] {
                temp_arr[idx] = nums2[n2_idx];
                n2_idx += 1;
            } else {
                temp_arr[idx] = nums1[n1_idx];
                n1_idx += 1;
            }
        }

        *nums1 = temp_arr;
    }
}
```

当两个数组遍历完时，rustlt 就是我们想要的结果。但此方法声明了一个新数组，空间复杂度为$O(n)$，其实也可以不用申请额外空间：

```rust
impl Solution {
    pub fn merge(nums1: &mut Vec<i32>, m: i32, nums2: &mut Vec<i32>, n: i32) {
        if n == 0 {
            return;
        }

        if m == 0 {
            *nums1 = nums2.clone();
            return;
        }

        let total = m + n;
        let mut m1 = m - 1;
        let mut n1 = n - 1;

        for idx in 0..total {
            if m1 < 0 {
                nums1[(total - 1 - idx) as usize] = nums2[n1 as usize];
                n1 -= 1;
            } else if n1 < 0 {
                break;
            } else if nums2[n1 as usize] >= nums1[m1 as usize] {
                nums1[(total - 1 - idx) as usize] = nums2[n1 as usize];
                n1 -= 1;
            } else {
                nums1[(total - 1 - idx) as usize] = nums1[m1 as usize];
                m1 -= 1;
            }
        }
    }
}
```

## [环形链表](https://leetcode.cn/problems/linked-list-cycle/)

### 描述

给你一个链表的头节点 head ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递  。仅仅是为了标识链表的实际情况。

如果链表中存在环  ，则返回 true 。 否则，返回 false 。

### 解决

首先想到的是通过 HashMap 储存遍历到的每个点，当再次遍历到记录的节点时便可以判定存在环。当然，题目的进阶难度是不使用额外的存储空间，这里便学到一种新的解法：弗洛伊德解法。

解法思想：快慢双指针。两个不同便利速度的指针同时从头节点出发，当快指针追上满指针时便可判定存在环，当快指针便利到 null 时，便可判定链表不存在环。

<CenterImg src="https://res.zrain.fun/images/2022/08/linked_list_cycle.png" alt="linked_list_cycle" zoom="60%"/>

上图是移动一次后的状况（通常，慢指针正常遍历，快指针比慢指针每次多**一个**节点），显然，当下次运动后，快慢指针会在节点 2 处相遇，这时我们就可判定存在环。代码如下：

```javascript
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  let p1 = head
  let p2 = head

  if (!head || !head.next) return false

  while (p1 && p2) {
    p1 = p1.next
    p2 = p2.next ? (p2.next.next ? p2.next.next : null) : null

    if (p1 === p2) return true
  }

  return false
}
```

## [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

### 描述

给定一个链表的头节点  head ，返回链表开始入环的第一个节点。  如果链表无环，则返回  null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。

### 解决

这个问题可以用上一题的 HashMap 轻松解决，碰到的第一个重复节点便是入环的第一个节点。但照样，进阶做法是使用$O(1)$的空间复杂度。我们依然可以参照弗洛伊德解法先判断是否有环，之后我们再动一些手脚：

我们使用两个指针，$\text{fast}$ 与 $\text{slow}$。它们起始都位于链表的头部。随后，$\text{slow}$ 指针每次向后移动一个位置，而 $\text{fast}$ 指针向后移动两个位置。如果链表中存在环，则 $\text{fast}$ 指针最终将再次与 $\text{slow}$ 指针在环中相遇。

<CenterImg src="https://res.zrain.fun/images/2022/08/linked_list_cycle_ii.png" alt="linked_list_cycle_ii" zoom="30%"/>

如上图所示，设链表中环外部分的长度为 $a$。$\text{slow}$ 指针进入环后，又走了 $b$ 的距离与 $\text{fast}$ 相遇。此时，$\text{fast}$ 指针已经走完了环的 $n$ 圈，因此它走过的总距离为：

$$
a + n(b + c) + b = a + (n + 1)b + nc
$$

根据题意，任意时刻，$\text{fast}$ 指针走过的距离都为 $\text{slow}$ 指针的 2 倍。因此，我们有：

$$
a + (n + 1)b + nc = 2(a + b) \rightarrow a = c + (n - 1)(b + c)
$$

我们会发现：从相遇点到入环点的距离加上 $n - 1$ 圈的环长，恰好等于从链表头部到入环点的距离。也就是说，当快慢指针相遇时，将慢指针重置到链表头，同时将快指针也改为慢指针，同时遍历，它们必定会在入环点相遇。代码如下：

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function (head) {
  let p1 = head
  let p2 = head

  if (!head || !head.next) return null

  while (p1 && p2) {
    p1 = p1.next
    p2 = p2.next ? (p2.next.next ? p2.next.next : null) : null
    if (p2 === null) return null
    if (p1 === p2) break
  }

  p1 = head

  while (p1 !== p2) {
    p1 = p1.next
    p2 = p2.next
  }

  return p1
}
```
