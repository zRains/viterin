---
date: 1648397724000
title: 'TC-11: Tuple to Object'
layout: 'doc'
---

Refer: [Easy - Tuple to Object](https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.md)

### Describe

Give an array, transform into an object type and the key/value must in the given array.

For example

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

// expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
type result = TupleToObject<typeof tuple>
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type cases = [
  Expect<Equal<TupleToObject<typeof tuple>, { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y' }>>
]

// @ts-expect-error
type error = TupleToObject<[[1, 2], {}]>
```

### Solution

When the type of T is Object, We can use `keyof` to get all keys in T. However, if the T's type is array, we can use the type `number` to get all values.

```typescript
type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P
}
```
