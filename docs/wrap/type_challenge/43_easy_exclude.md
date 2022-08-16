---
date: 1648397724000
title: 'Exclude'
order: 43
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - Exclude](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md)

### Describe

Implement the built-in `Exclude<T, U>`

Exclude from T those types that are assignable to U

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, Exclude<'a' | 'b' | 'c', 'a'>>>,
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, Exclude<'a' | 'b' | 'c', 'a' | 'b'>>>,
  Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>
]
```

### Solution

```typescript
type MyExclude<T, U> = T extends U ? never : T
```