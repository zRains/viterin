---
date: 1648397724000
title: 'TC-14: First of Array'
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - First of Array](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md)

### Describe

Implement a generic `First<T>` that takes an Array T and returns it’s first element’s type.

For example

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>
]

type errors = [
  // @ts-expect-error
  First<'notArray'>,
  // @ts-expect-error
  First<{ 0: 'arrayLike' }>
]
```

### Solution

```typescript
// my solution
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]

// other solutions
type First<T extends any[]> = T extends [infer P, ...infer K] ? P : never
type First<T extends any[]> = T extends [] ? never : T[0]
```