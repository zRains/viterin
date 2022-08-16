---
toc: false
date: 1649942694485
title: 'interface和type索引签名之问'
scope: ['TS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

## 问题

属于是[经典问题](https://stackoverflow.com/a/64971386/14792586)了：

```typescript
interface MyInterface {
  foobar: string
}

type MyType = {
  foobar: string
}

const exampleInterface: MyInterface = { foobar: 'hello world' }
const exampleType: MyType = { foobar: 'hello world' }

let record: Record<string, string> = {}

record = exampleType // ok
record = exampleInterface // Index signature for type 'string' is missing in type 'MyInterface'.
```

使用 TS 定义对象类型，不写索引签名却给带有索引签名类型的对象赋值时，为什么使用 interface 定义的类型会报错，使用 type 定义的类型就不会报错？

从上面的问题看出，索引签名是重点。[文档](https://jkchao.github.io/typescript-book-chinese/typings/indexSignatures.html#typescript-%E7%B4%A2%E5%BC%95%E7%AD%BE%E5%90%8D)中对其做了很好的解释，这里大致概括一下：

> 索引签名定义了对象中属性名、属性值的类型。

## 思考

有了对索引签名的基本了解，我们来尝试思考下问题的答案。

### 猜测一：是否使用 type 定义类型的对象会默认带索引签名？

这是比较容易能想到的答案，如果使用 type 声明类型的对象默认带索引签名，那么再给带有索引签名类型的属性赋值时，当然不会报错。

```typescript
interface MyInterface {
  foobar: string
}

type MyType = {
  foobar: string
}

const exampleInterface: MyInterface = { foobar: 'hello world' }
const exampleType: MyType = { foobar: 'hello world' }

let record: Record<string, string> = {}

Object.keys(exampleInterface).map((key) => exampleInterface[key]) // error
Object.keys(exampleType).map((key) => exampleType[key]) // error
```

由此可见，两者并不会默认带上索引签名。

### 猜测二：是否「使用 type 定义类型的 val」给「使用 interface 定义类型的 prop」赋值有特殊性？

为了更加直观的验证，列了如下一组排列组合，使用当前行的未定义索引类型去给定义索引类型赋值，报错情况如下：

| 未定义索引类                      | 定义索引类型型                                             | 赋值结果 |
| --------------------------------- | ---------------------------------------------------------- | -------- |
| {{'interface Val { a: number }'}} | {{'interface Prop { [key: string ]: number; a: number'}}   | ❌       |
| {{'type Val = { a: number }'}}    | {{'interface Prop { [key: string ]: number; a: number }'}} | ✅       |
| {{'interface Val { a: number }'}} | {{'type Prop = { [key: string ]: number; a: number }'}}    | ❌       |
| {{'type Val = { a: number }'}}    | {{'type Prop = { [key: string ]: number; a: number }'}}    | ✅       |

## 解答

经过以上两轮验证，似乎验证了在索引签名上 type 比 interface 有一些特殊性。

在 stackoverflow 上有这样一个[回答](https://stackoverflow.com/a/64970740/14792586)：

`Record<string, string>` is the same as `{ [key: string]: string }`. A subset is allowed to be assigned to this index signature type is only possible if all properties of that type are known and can be checked against this index signature. In your case, everything from exampleType is assignable to `Record<string, string>`. This can be only checked for object literal types, as object literal types can't be changed once you declared them. Thus, the index signature is known.

In contrast, interfaces are not final the moment you declare them. There is always the possibility of adding new members to the same interface due to declaration merging.

最后一句的意思大概是这样：`interface`定义之后是可以再向其添加多种类型的属性的（也就是[合并声名](https://typescript.bootcss.com/declaration-merging.html)），你并不能保证在最后一刻都不扩展它。

这让我想到`interface`和`type`的一个明显区别：

```typescript
interface InterFaceType {
  a: number
}
type Type = {
  a: number
}

interface InterFaceType {
  b: string
}
// 此时此刻InterFaceType为 {a: number; b:string}

type Type = { b: string } // 错误，已存在，不可再改变
```

因 interface 可声明合并，声明的变量类型可新增属性，不是终态，所以在给有索引签名的类型赋值时，需增加索引签名限定新增属性的类型。而使用 type 声明的变量类型不可新增属性，已是最终状态，只要其属性符合被赋值变量的类型，就可以直接赋值，不会报错。

> 要让程序干什么，就要你**清楚**告诉它要干什么！

## Refer

[TS 中的 type、interface 关于索引签名的区别 - 掘金](https://juejin.cn/post/7057471253279408135)
