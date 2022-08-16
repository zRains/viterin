---
date: 1648397724000
title: 'Chainable Options'
order: 12
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Chainable Options](https://github.com/type-challenges/type-challenges/blob/main/questions/00012-medium-chainable-options/README.md)

### Describe

Chainable options are commonly used in Javascript. But when we switch to TypeScript, can you properly type it?

In this challenge, you need to type an object or a class - whatever you like - to provide two function `option(key, value)` and `get()`. In option, you can extend the current config type by the given key and value. We should about to access the final result via `get`.

For example

```typescript
declare const config: Chainable

const result = config.option('foo', 123).option('name', 'type-challenges').option('bar', { value: 'Hello World' }).get()

// expect the type of result to be:
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

You don’t need to write any js/ts logic to handle the problem - just in type level.

You can assume that `key` only accepts `string` and the value can be `anything` - just leave it as-is. **Same key won’t be passed twice**.

### Test Cases

```typescript
import { Alike, Expect } from '@type-challenges/utils'

declare const a: Chainable

const result1 = a.option('foo', 123).option('bar', { value: 'Hello World' }).option('name', 'type-challenges').get()

const result2 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 'last name')
  .get()

type cases = [Expect<Alike<typeof result1, Expected1>>, Expect<Alike<typeof result2, Expected2>>]

type Expected1 = {
  foo: number
  bar: {
    value: string
  }
  name: string
}

type Expected2 = {
  name: string
}
```

### Solution

```typescript
type Chainable<P = {}> = {
  option<K extends string, V>(key: K, value: K extends keyof P ? P[K] : V): Chainable<P & { [props in K]: K extends keyof P ? P[K] : V }>
  get(): P
}
```