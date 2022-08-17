---
doc: false
date: 1652878926351
title: '简单实现防抖和节流'
order: 2
visible: true
lang: 'zh'
layout: 'doc'
---

防抖和节流的区别：防抖是将多次执行变为最后一次执行，节流是将多次执行变为每隔一段时间执行。

### 防抖

```typescript
function debounce(fn: (...args: any[]) => void, delay = 300) {
  let timer: number = 0
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, arguments), delay)
  }
}
```

### 节流

```typescript
function debounce(fn: (...args: any[]) => void, delay = 300) {
  let timer: number = 0
  return function () {
    if (!timer) {
      timer = setTimeout(() => fn.apply(this, arguments), delay)
    }
  }
}
```
