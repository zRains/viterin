---
date: 1648397724000
title: 'TC-62: Type Lookup'
layout: 'doc'
---

Refer: [Medium - Type Lookup](https://github.com/type-challenges/type-challenges/blob/main/questions/00062-medium-type-lookup/README.md)

### Describe

Sometimes, you may want to lookup for a type in a union to by their attributes.

In this challenge, we would like to get the corresponding type by searching for the common `type` field in the union `Cat | Dog`. In other words, we will expect to get Dog for `LookUp<Dog | Cat, 'dog'>` and Cat for `LookUp<Dog | Cat, 'cat'>` in the following example.

```typescript
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type Animal = Cat | Dog

type cases = [Expect<Equal<LookUp<Animal, 'dog'>, Dog>>, Expect<Equal<LookUp<Animal, 'cat'>, Cat>>]
```

### Solution

```typescript
// correct
type LookUp<U extends { type: string }, T extends string> = U extends { type: T } ? U : never

// wrong
type LookUp<U extends { type: string }, T extends string> = U['type'] extends T ? U : never
// It will be turn into: string extends 'dog' ? U : never, and always be never.
```
