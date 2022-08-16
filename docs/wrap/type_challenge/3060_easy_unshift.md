---
date: 1648397724000
title: 'Unshift'
order: 3060
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - Unshift](https://github.com/type-challenges/type-challenges/blob/main/questions/03060-easy-unshift/README.md)

### Describe

Implement the type version of Array.unshift

For example

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

### Test Cases

```typescript
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Unshift<[], 1>, [1]>>,
  Expect<Equal<Unshift<[1, 2], 0>, [0, 1, 2]>>,
  Expect<Equal<Unshift<['1', 2, '3'], boolean>, [boolean, '1', 2, '3']>>,
  Expect<Equal<Unshift<['1', 2, '3'], '3'>, ['1', 2, '3']>>
]
```

### Solution

```typescript
type Unshift<T extends any[], U> = [U] extends [T[number]] ? T : [U, ...T]
```