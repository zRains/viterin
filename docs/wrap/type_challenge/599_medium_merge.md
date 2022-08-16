---
date: 1648397724000
title: 'Merge'
order: 599
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Merge](https://github.com/type-challenges/type-challenges/blob/main/questions/00599-medium-merge/README.md)

### Describe

Merge two types into a new type. Keys of the second type overrides keys of the first type.

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  a: number
  b: string
}
type Bar = {
  b: number
  c: boolean
}

type cases = [
  Expect<
    Equal<
      Merge<Foo, Bar>,
      {
        a: number
        b: number
        c: boolean
      }
    >
  >
]
```

### Solution

```typescript
// The intersection type does not seem to pass the type check!
type Merge<F, S> = {
  [P in keyof S]: S[P]
} & {
  [P in keyof F as P extends keyof S ? never : P]: F[P]
}

type Merge<F, S> = {
  [P in keyof (F & S)]: P extends keyof S ? S[P] : P extends keyof F ? F[P] : never
}
```
