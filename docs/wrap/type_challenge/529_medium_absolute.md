---
date: 1648397724000
title: 'TC-529: Absolute'
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Absolute](https://github.com/type-challenges/type-challenges/blob/main/questions/00529-medium-absolute/README.md)

### Describe

Implement the `Absolute` type. A type that take string, number or bigint. The output should be a positive number string

For example

```typescript
type Test = -100
type Result = Absolute<Test> // expected to be "100"
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Absolute<0>, '0'>>,
  Expect<Equal<Absolute<-0>, '0'>>,
  Expect<Equal<Absolute<10>, '10'>>,
  Expect<Equal<Absolute<-5>, '5'>>,
  Expect<Equal<Absolute<'0'>, '0'>>,
  Expect<Equal<Absolute<'-0'>, '0'>>,
  Expect<Equal<Absolute<'10'>, '10'>>,
  Expect<Equal<Absolute<'-5'>, '5'>>,
  Expect<Equal<Absolute<-1_000_000n>, '1000000'>>,
  Expect<Equal<Absolute<9_999n>, '9999'>>
]
```

### Solution

```typescript
type Absolute<T extends number | string | bigint> = `${T}` extends `${'-'}${infer K}` ? K : `${T}`
```
