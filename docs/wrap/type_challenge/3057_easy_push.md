---
date: 1648397724000
title: 'Push'
order: 3057
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - Push](https://github.com/type-challenges/type-challenges/blob/main/questions/03057-easy-push/README.md)

### Describe

Implement the generic version of Array.push

For example

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

### Test Cases

```typescript
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Push<[], 1>, [1]>>,
  Expect<Equal<Push<[1, 2], '3'>, [1, 2, '3']>>,
  Expect<Equal<Push<['1', 2, '3'], boolean>, ['1', 2, '3', boolean]>>,
  Expect<Equal<Push<['1', 2, '3'], '3'>, ['1', 2, '3']>>
]
```

### Solution

Question: `Push<['1', 2, '3'], '3'>` why not equal to `['1', 2, '3', '3']` in **Push** operation?

> It fixed in [#7947](https://github.com/type-challenges/type-challenges/pull/7947).

```typescript
// my solution
type Push<T extends any[], U> = T['length'] extends 0 ? [U] : T extends [...infer P, infer K] ? (K extends U ? T : [...T, U]) : never

// other solutions
type Push<T extends any[], U> = [U] extends [T[number]] ? T : [...T, U]
```

The reason of wrapped `U` and `T[number]` is refer to [here](/post/learning/distributive_conditional_type).
