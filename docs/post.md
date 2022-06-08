---
title: Markdown Demo
layout: page
---

#### 最近有点闲，弄点算法之类的东西。听说排序这东西很有讲究，记录几种较为人熟知的 Js 排序算法。改正了参考文章的几处小错误。

[TO]

**相关说明**

| 术语       | 说明                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| 稳定       | 如果 a 原本在 b 前面，而 a=b，排序之后 a 仍然在 b 的前面。                   |
| 不稳定     | 如果 a 原本在 b 的前面，而 a=b，排序之后 a 可能会出现在 b 的后面。           |
| 内排序     | 所有排序操作都在内存中完成。                                                 |
| 外排序     | 由于数据太大，因此把数据放在磁盘中，而排序通过磁盘和内存的数据传输才能进行。 |
| 时间复杂度 | 一个算法执行所耗费的时间。                                                   |
| 空间复杂度 | 运行完一个程序所需内存的大小。                                               |

**算法分类**

- **比较类排序**：通过比较来决定元素间的相对次序，由于其时间复杂度不能突破 O(nlogn)，因此也称为非线性时间比较类排序。
- **非比较类排序**：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此也称为线性时间非比较类排序。

**各类比较**

有的因为涉及到数据结构，便没有在下面记录了。

已记录：:heavy_check_mark: 非比较类排序：:star: 稳定：:large_blue_circle: 不稳定：:red_circle:

| 排序方法                    | 时间复杂度（平均） | 时间复杂度（最坏） | 时间复杂度（最好） | 空间复杂度 |       稳定性        | 排序方式 |
| --------------------------- | :----------------: | ------------------ | ------------------ | ---------- | :-----------------: | -------- |
| :heavy_check_mark: 插入排序 |       O(n²)        | O(n²)              | O(n)               | O(1)       | :large_blue_circle: | 内排序   |
| :heavy_check_mark:希尔排序  |      O(n^1.3)      | O(n²)              | O(n)               | O(1)       |    :red_circle:     | 内排序   |
| :heavy_check_mark:选择排序  |       O(n²)        | O(n²)              | O(n²)              | O(1)       |    :red_circle:     | 内排序   |
| 堆排序                      |      O(n㏒₂n)      | O(n㏒₂n)           | O(n㏒₂n)           | O(1)       |    :red_circle:     | 内排序   |
| :heavy_check_mark:冒泡排序  |       O(n²)        | O(n²)              | O(n)               | O(1)       | :large_blue_circle: | 内排序   |
| :heavy_check_mark:快速排序  |      O(n㏒₂n)      | O(n²)              | O(n㏒₂n)           | O(n㏒₂n)   |    :red_circle:     | 内排序   |
| :heavy_check_mark:归并排序  |      O(n㏒₂n)      | O(n㏒₂n)           | O(n㏒₂n)           | O(n)       | :large_blue_circle: | 外排序   |
| :star:计数排序              |       O(n+k)       | O(n+k)             | O(n+k)             | O(n+k)     | :large_blue_circle: | 外排序   |
| :star:桶排序                |       O(n+k)       | O(n²)              | O(n)               | O(n+k)     | :large_blue_circle: | 外排序   |
| :star:基数排序              |       O(n+k)       | O(n\*k)            | O(n\*k)            | O(n+k)     | :large_blue_circle: | 外排序   |

#### 冒泡排序

- 比较相邻的两个元素，如果前一个比后一个大，则交换位置。

- 第一轮的时候最后一个元素应该是最大的一个。

- 按照步骤一的方法进行相邻两个元素的比较，这个时候由于最后一个元素已经是最大的了，所以最后一个元素不用比较。

例子：

```js
var array = [10, 20, 9, 8, 179, 65, 100]
// 比较轮数
for (var i = 0; i < array.length - 1; i++) {
  // 每轮将最大的元素向后移
  for (var j = 0; j < array.length - 1 - i; j++) {
    if (array[j] > array[j + 1]) {
      let temp = array[j]
      array[j] = array[j + 1]
      array[j + 1] = temp
    }
  }
}
console.log(array)
```

#### 快速排序

快速排序借用了递归操作，在大数据面前是个不错的选择。与冒泡排序差不多，都有在寻找最大的数并将其提前。

- 取出中间的数值作为基准，将其余数分成两部分。一部分都比这个数小，一部分都大于或等于这个数。
- 两边继续重复操作，最后合并。

例子：

```js
function quickSort(array) {
  if (array.length <= 1) return array
  // 取出中间的数
  let center_num = array.splice(Math.floor(array.length / 2), 1)[0]
  let left_arr = []
  let right_arr = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] < center_num) {
      left_arr.push(array[i])
    } else {
      right_arr.push(array[i])
    }
  }
  // 连接列表并开始递归操作
  return [...quickSort(left_arr), center_num, ...quickSort(right_arr)]
}

var array = [2, 1000, 20, 9, 8, 179, 65, 100]

console.log(quickSort(array))
```

#### 插入排序

插入排序的原理大致是逐一选取元素放在已排好数列里的合适位置。

- 从第一个元素开始，该元素可以认为已经被排序

- 取出下一个元素，在已经排序的元素序列中从后向前扫描

- 如果该元素（已排序）大于新元素，将该元素移到下一位置

- 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置

- 将新元素插入到下一位置中

- 重复步骤 2

例子：

```js
function inSort(array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) {
      let target = array[i]
      let index = i - 1
      array[i] = array[index]
      // 这里比较难懂，主要是将数列向后移一位，找到合适的位置（index+1）
      while (index >= 0 && target < array[index]) {
        array[index + 1] = array[index]
        index--
      }
      array[index + 1] = target
    }
  }
}

var array = [2, 1000, 20, 9, 8, 179, 65, 100]
inSort(array)
console.log(array)
```

#### 选择排序

选择排序的主要思想是将数列里面最小的数字选出来放在最前面，以此类推。

- 选出最小的元素。
- 将当前循环元素与最小元素交换位置。
- 重复上述步骤，直到最后一个元素。

例子:

```js
function selectSort(array) {
  let min, temp
  for (let i = 0; i < array.length; i++) {
    min = i
    // 从剩余元素中选取最小的元素，并记录位置(min)
    for (let j = i + 1; j < array.length; j++) {
      if (array[min] > array[j]) min = j
    }
    temp = array[i]
    array[i] = array[min]
    array[min] = temp
  }
}

var array = [2, 1000, 20, 159, 8, 179, 65, 100]
selectSort(array)
console.log(array)
```

#### 希尔排序

希尔排序是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫**缩小增量排序**。

- 选择一个增量序列 t1，t2，…，tk，其中 ti>tj，tk=1；
- 按增量序列个数 k，对序列进行 k 趟排序；
- 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

例子：

```js
function shellSort(arr) {
  let len = arr.length
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 多个分组交替执行
    for (var i = gap; i < len; i++) {
      let j = i
      let current = arr[i]
      while (j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap]
        j = j - gap
      }
      arr[j] = current
    }
  }
  return arr
}

var array = [2, 1000, 20, 159, 8, 179, 65, 100]

console.log(shellSort(array))
```

#### 并归排序

并归排序说实话我看了好久才看懂，感觉有递归就是在刁难我，大致原理是将原数列分成几个小段分别排序，之后再整合成一个排列好的数列。

- 把长度为 n 的输入序列分成两个长度为 n/2 的子序列；
- 对这两个子序列分别采用归并排序；
- 将两个排序好的子序列合并成一个最终的排序序列。

例子：

```js
function mergeSort(arr) {
  var len = arr.length
  if (len < 2) {
    return arr
  }
  var center_index = Math.floor(len / 2)
  var left = arr.slice(0, center_index)
  var right = arr.slice(center_index)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  var result = []
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while (right.length) {
    result.push(right.shift())
  }
  while (left.length) {
    result.push(left.shift())
  }
  return result
}

var array = [2, 1000, 20, 159, 8, 179, 65, 100]

console.log(mergeSort(array))
```
