---
date: 1648397724000
title: 'TC-108: Trim'
layout: 'doc'
---

Refer: [Medium - Trim](https://github.com/type-challenges/type-challenges/blob/main/questions/00108-medium-trim/README.md)

### Describe

Implement `Trim<T>` which takes an exact string type and returns a new string with the whitespace from both ends removed.

For example

```typescript
type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Trim<'str'>, 'str'>>,
  Expect<Equal<Trim<' str'>, 'str'>>,
  Expect<Equal<Trim<'     str'>, 'str'>>,
  Expect<Equal<Trim<'str   '>, 'str'>>,
  Expect<Equal<Trim<'     str     '>, 'str'>>,
  Expect<Equal<Trim<'   \n\t foo bar \t'>, 'foo bar'>>
]
```

### Solution

```typescript
type Trim<S extends string> = S extends `${' ' | '\n' | '\t'}${infer P}` | `${infer P}${' ' | '\n' | '\t'}` ? Trim<P> : S
```
