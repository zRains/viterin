---
date: 1648397724000
title: 'TC-119: Replace All'
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Replace All](https://github.com/type-challenges/type-challenges/blob/main/questions/00119-medium-replaceall/README.md)

### Describe

Implement `ReplaceAll<S, From, To>` which replace the all the substring `From` with `To` in the given string `S`.

For example

```typescript
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ReplaceAll<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobar', 'bag', 'foo'>, 'foobar'>>,
  Expect<Equal<ReplaceAll<'foobarbar', 'bar', 'foo'>, 'foofoofoo'>>,
  Expect<Equal<ReplaceAll<'t y p e s', ' ', ''>, 'types'>>,
  Expect<Equal<ReplaceAll<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<ReplaceAll<'barfoo', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
  Expect<Equal<ReplaceAll<'', '', ''>, ''>>
]
```

### Solution

```typescript
type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer P}${From}${infer K}`
  ? `${ReplaceAll<P, From, To>}${To}${ReplaceAll<K, From, To>}`
  : S
```
