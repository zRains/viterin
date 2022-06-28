---
date: 1648397724000
title: 'TC-298: Length of String'
layout: 'doc'
---

Refer: [Medium - Length of String](https://github.com/type-challenges/type-challenges/blob/main/questions/00298-medium-length-of-string/README.md)

### Describe

Compute the length of a string literal, which behaves like `String#length`.

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LengthOfString<''>, 0>>,
  Expect<Equal<LengthOfString<'kumiko'>, 6>>,
  Expect<Equal<LengthOfString<'reina'>, 5>>,
  Expect<Equal<LengthOfString<'Sound! Euphonium'>, 16>>
]
```

### Solution

```typescript
type LengthOfString<S extends string, C extends any[] = []> = S extends `${infer P}${infer K}` ? LengthOfString<K, [...C, P]> : C['length']
```
