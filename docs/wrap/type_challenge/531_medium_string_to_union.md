---
date: 1648397724000
title: 'String to Union'
order: 531
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - String to Union](https://github.com/type-challenges/type-challenges/blob/main/questions/00531-medium-string-to-union/README.md)

### Describe

Implement the String to Union type. Type take string argument. The output should be a union of input letters

For example

```typescript
type Test = '123'
type Result = StringToUnion<Test> // expected to be "1" | "2" | "3"
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<StringToUnion<''>, never>>,
  Expect<Equal<StringToUnion<'t'>, 't'>>,
  Expect<Equal<StringToUnion<'hello'>, 'h' | 'e' | 'l' | 'l' | 'o'>>,
  Expect<Equal<StringToUnion<'coronavirus'>, 'c' | 'o' | 'r' | 'o' | 'n' | 'a' | 'v' | 'i' | 'r' | 'u' | 's'>>
]
```

### Solution

```typescript
type StringToUnion<T extends string, C = never> = T extends `${infer P}${infer K}`
  ? K['length'] extends 0
    ? C | P
    : StringToUnion<K, C | P>
  : C
```
