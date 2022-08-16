---
date: 1648397724000
title: 'TC-4: Pick'
difficulty: 'easy'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Easy - Pick](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md)

### Describe

Implement the built-in Pick<T, K> generic without using it.

Constructs a type by picking the set of properties K from T

For example

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  // @ts-expect-error
  MyPick<Todo, 'title' | 'completed' | 'invalid'>
]

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}
```

### Solution

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```
