---
date: 1648397724000
title: 'TC-106: Trim Left'
layout: 'doc'
---

Refer: [Medium - Trim Left](https://github.com/type-challenges/type-challenges/blob/main/questions/00106-medium-trimleft/README.md)

### Describe

Implement `TrimLeft<T>` which takes an exact string type and returns a new string with the whitespace beginning removed.

For example

```typescript
type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>
]
```

### Solution

```typescript
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer P}` ? TrimLeft<P> : S
```
