---
date: 1648397724000
title: 'TC-191: Append Argument'
layout: 'doc'
---

Refer: [Medium - Append Argument](https://github.com/type-challenges/type-challenges/blob/main/questions/00191-medium-append-argument/README.md)

### Describe

For given function type `Fn`, and any type `A` (any in this context means we don’t restrict the type, and I don’t have in mind any type 😉) create a generic type which will take `Fn` as the first argument, `A` as the second, and will produce function type `G` which will be the same as `Fn` but with appended argument `A` as a last one.

For example,

```typescript
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> // expected be (a: number, b: string, x: boolean) => number
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type Case1 = AppendArgument<(a: number, b: string) => number, boolean>
type Result1 = (a: number, b: string, x: boolean) => number

type Case2 = AppendArgument<() => void, undefined>
type Result2 = (x: undefined) => void

type cases = [Expect<Equal<Case1, Result1>>, Expect<Equal<Case2, Result2>>]
```

### Solution

```typescript
type AppendArgument<Fn extends (...arg: any[]) => any, A> = Fn extends (...arg: infer P) => any
  ? (...arg: [...P, A]) => ReturnType<Fn>
  : never
```
