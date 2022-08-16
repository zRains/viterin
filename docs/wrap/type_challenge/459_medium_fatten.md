---
date: 1648397724000
title: 'TC-459: Flatten'
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Flatten](https://github.com/type-challenges/type-challenges/blob/main/questions/00459-medium-flatten/README.md)

### Describe

In this challenge, you would need to write a type that takes an array and emitted the flatten array type.

For example:

```typescript
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[{ foo: 'bar'; 2: 10 }, 'foobar']>, [{ foo: 'bar'; 2: 10 }, 'foobar']>>
]
```

### Solution

```typescript
type Flatten<T extends any[], C extends any[] = []> = T extends [infer P, ...infer K]
  ? P extends any[]
    ? Flatten<[...P, ...K], C>
    : Flatten<K, [...C, P]>
  : C
```
