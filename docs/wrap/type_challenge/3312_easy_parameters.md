---
date: 1648397724000
title: 'Parameters'
order: 3312
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - Parameters](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.md)

### Describe

Implement the built-in Parameters generic without using it.

### Test Cases

```typescript
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
const baz = (): void => {}

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>
]
```

### Solution

```typescript
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
```
