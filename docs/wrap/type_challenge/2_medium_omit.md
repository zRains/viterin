---
title: 'TC-2: Omit'
layout: doc
---

Refer: [Medium - Omit](https://github.com/type-challenges/type-challenges/blob/master/questions/3-medium-omit/README.md)

### Describe

Implement the built-in `Omit<T, K>` generic without using it.

Constructs a type by picking all properties from T and then removing K

For example

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false
}
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<Expected1, MyOmit<Todo, 'description'>>>, Expect<Equal<Expected2, MyOmit<Todo, 'description' | 'completed'>>>]

// @ts-expect-error
type error = MyOmit<Todo, 'description' | 'invalid'>

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
  completed: boolean
}

interface Expected2 {
  title: string
}
```

### Solution

```typescript
type MyOmit<T, K> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```
