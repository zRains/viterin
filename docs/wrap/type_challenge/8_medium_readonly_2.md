---
date: 1648397724000
title: 'TC-8: Readonly-2'
difficulty: 'medium'
visible: true
lang: 'en'
layout: 'doc'
---

Refer: [Medium - Readonly-2](https://github.com/type-challenges/type-challenges/blob/main/questions/00008-medium-readonly-2/README.md)

Relation: [Easy - Readonly](/wrap/type_challenge/7_easy_readonly)

### Describe

Implement a generic `MyReadonly2<T, K>` which takes two type argument T and K.

K specify the set of properties of T that should set to Readonly. When K is not provided, it should make all properties readonly just like the normal `Readonly<T>`.

For example

```javascript
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

### Test Cases

```typescript
import { Alike, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'title' | 'description'>, Expected>>
]

interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

interface Expected {
  readonly title: string
  readonly description?: string
  completed: boolean
}
```

### Solution

```typescript
// my solution
type MyReadonly2<T, K = keyof T> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}

// other solution
type MyReadonly2<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>> // trick🤔
```