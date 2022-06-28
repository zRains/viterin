---
date: 1648397724000
title: 'TC-268: If'
layout: 'doc'
---

Refer: [Easy - If](https://github.com/type-challenges/type-challenges/blob/main/questions/00268-easy-if/README.md)

### Describe

Implement a utils If which accepts condition C, a truthy return type T, and a falsy return type F. C is expected to be either true or false while T and F can be any type.

For example:

```typescript
type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<If<true, 'a', 'b'>, 'a'>>, Expect<Equal<If<false, 'a', 2>, 2>>]

// @ts-expect-error
type error = If<null, 'a', 'b'>
```

### Solution

```typescript
type If<C, T, F> = C extends true ? T : F
```
