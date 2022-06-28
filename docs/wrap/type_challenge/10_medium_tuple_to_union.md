---
date: 1648397724000
title: 'TC-10: Tuple to Union'
layout: 'doc'
---

Refer: [Medium - Tuple to Union](https://github.com/type-challenges/type-challenges/blob/main/questions/00010-medium-tuple-to-union/README.md)

### Describe

Implement a generic `TupleToUnion<T>` which covers the values of a tuple to its values union.

For example

```typescript
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<TupleToUnion<[123, '456', true]>, 123 | '456' | true>>, Expect<Equal<TupleToUnion<[123]>, 123>>]
```

### Solution

```typescript
// my solution
type TupleToUnion<T extends any[]> = T extends [infer P, ...infer K] ? (K['length'] extends 1 ? P | K[0] : P | TupleToUnion<K>) : never
type TupleToUnion<T extends any[]> = T[number]

// other solution
type TupleToUnion<T extends readonly unknown[]> = T extends [infer First, ...infer Rest] ? First | TupleToUnion<Rest> : never
```
