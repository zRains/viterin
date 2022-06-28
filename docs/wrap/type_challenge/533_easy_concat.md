---
date: 1648397724000
title: 'TC-533: Concat'
layout: 'doc'
---

Refer: [Easy - Concat](https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/README.md)

### Describe

Implement the JavaScript Array.concat function in the type system. A type takes the two arguments. The output should be a new array that includes inputs in ltr order

For example

```typescript
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], [1]>, [1]>>,
  Expect<Equal<Concat<[1, 2], [3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Concat<['1', 2, '3'], [false, boolean, '4']>, ['1', 2, '3', false, boolean, '4']>>
]
```

### Solution

```typescript
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```