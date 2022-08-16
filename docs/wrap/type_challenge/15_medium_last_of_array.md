---
date: 1648397724000
title: 'TC-15: Last of Array'
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Last of Array](https://github.com/type-challenges/type-challenges/blob/main/questions/00015-medium-last/README.md)

### Describe

Implement a generic `Last<T>` that takes an Array T and returns its last element.

For example

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<Last<[3, 2, 1]>, 1>>, Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>]
```

### Solution

```typescript
// my solution (It may be a little complicated 🤣)
type Last<T extends any[]> = T extends [infer P, ...infer K] ? (K['length'] extends 1 ? K[0] : K['length'] extends 0 ? P : Last<K>) : never

// other solution (In js, rest element must be last element!)
type Last<T extends any[]> = T extends [...infer _, infer Z] ? Z : never
```
