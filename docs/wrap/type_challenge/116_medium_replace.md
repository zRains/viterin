---
date: 1648397724000
title: 'TC-116: Replace'
layout: 'doc'
---

Refer: [Medium - Replace](https://github.com/type-challenges/type-challenges/blob/main/questions/00116-medium-replace/README.md)

### Describe

Implement `Replace<S, From, To>` which replace the string `From` with `To` once in the given string `S`.

For example

```typescript
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Replace<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', 'foo'>, 'foofoobar'>>,
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'foobarbar', 'bra', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'', '', ''>, ''>>
]
```

### Solution

```typescript
type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer P}${From}${infer K}`
  ? `${P}${To}${K}`
  : S
```
