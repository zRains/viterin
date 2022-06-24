---
toc: false
date: 1649942694483
title: 'JS连续赋值执行分析'
link: '/post/learning/js_continuous_assignment'
file: 'js_continuous_assignment'
scope: ['JS']
buckets: ['post', 'learning']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

## 问题

一个很经典的问题，下面一段代码输出是？

```javascript
let a = { n: 2 }
let b = a
a.x = a = { l: 2 }

console.log(a.x)
console.log(b.x)
```

## 思考

我第一次是这样想的：

- 最初`a`和`b`共同指向同一个堆地址，即`{ n: 2 }`。
- 当遇到连续赋值时，先看最右边，执行`a = { l: 2 }`，此时`a`已经指向新的堆地址，即`{ l: 2 }`。
- 之后执行`a.x = a`，这样看来产生了循环引用。
- 最后得出`a.x`的值为`{ l: 2, x: a }`，而`b.x`的值为`{ l: undefined }`

## 解决

但看了答案才发现自己再第三点想错了，下面用图说明：

当执行完`let b = a`时，变量情况如下：

<CenterImg src="https://res.zrain.fun/images/2022/06/js_continuous_assignment_part_1-1053778e4998c1b17a5f77e70989a918.png" alt="js_continuous_assignment_part_1" zoom="60%" source="https://app.diagrams.net/#R7VZNj5swEP01HBsRnITkuJuPbdVGqpRK3fbmwATcGIYaJ0B%2FfQcwAUqz3ZW26lbtBTzPM7Zn3vjJFltG%2BZ3iSbhFH6Tl2H5usZXlOGNn4dCvRIoamU0WNRAo4RunFtiJb2BA26An4UPac9SIUoukD3oYx%2BDpHsaVwqzvdkDZ3zXhAQyAncflEP0ofB3W6NxxW%2Fw1iCBsdh7PTH4Rb5xNJmnIfcw6EFtbbKkQdT2K8iXIsnhNXeq4zZXZy8EUxPoxAV5xfhOs9%2Fz8dbt7e5Th3WfhvZqZs%2BmiSRh8yt%2BYMcb0u1V4in0ol7HJQqVDDDDm8h1iQuCYwC%2BgdWHY4yeNBIU6kmYWcqHvO%2BNP5VKjqbFWuVm5MgpjHDDWGx4JWQJbUEpkQCUFZeZ2eFJeuV2oNfWCM2U39KHsy0%2FpkI4CxEACT0Q68jCqJry0ct0c6pVp%2BNO160TG1Xlj%2F6bsI7L3Er3jh1DENbwRskmwrmJZuqvkGChtjn2NkabJuQpAP%2BDHLi1Edw8wAq0oH1uB5Fqc%2B%2Bfg5hIEF7%2B2T2hgWuUJbWPWPXN5MjvxQSP1uyYLhYZdwqvcM9KKfoe8FLYPxOkSJaoqB%2Bb5sJ%2FvCU%2B1wiN0ZtiMLZh%2Fof4MSkP%2BMPlDspoAZiSiaFTT2FmrOK6Bwo7YTOzfRK%2F7YlWBKqqK%2B65hohbTBmgDK6sX%2BR6UoBKV1P%2FTIuP8DSLjDERm%2F19knk9k5n9YZNiAXsu9pa6nmttjy10NNUhKevXBr3nmaVI%2FBQ8iL3vjpRI%2FWS%2FXi%2Fnz0OvMf6B38jh63afTS2b7aq3mOm9%2Ftv4O" />

之后执行`a.x = a = {n:2}`，首先进行一遍**左查找**。这里得提一个概念：结合性。

### 结合性

所谓结合性，是指表达式中同一个运算符出现多次时，是左边的优先计算还是右边的优先计算。赋值表达式是右结合的。这意味着：

```js
A1 = A2 = A3 = A4
```

等价于

```js
A1 = A2 = A3 = A4
```

回到问题，此时语句可变成：

```js
a.x = a = { n: 2 }
```

首先对`a.x`进行左查找，发现`x`不存在，那就先赋个`undefined`：

<CenterImg src="https://res.zrain.fun/images/2022/06/js_continuous_assignment_part_2-308084d8cf9275c33d0ad6fdfb3272ab.png" alt="js_continuous_assignment_part_2" zoom="60%" source="https://app.diagrams.net/#R7VfbjpswEP2aPDYieHPhcTebbKs2UqVU6rZvBibgxjDUOAH69R2DCaFstl1pq27VvmDPmfFl5hxGMGLLpLxTPIs3GIIcuU5YjtjtyHUnrufSYJCqQWberAEiJUIb1AFb8Q0s6Fj0IELIe4EaUWqR9cEA0xQC3cO4Ulj0w3Yo%2B6dmPIIBsA24HKIfRajjBl248w5%2FDSKK25MnM6%2FxJLwNtpnkMQ%2BxOIPYasSWClE3s6RcgjTFa%2BvSrFtf8J4upiDVv7IgqI5vopXPj18327d7Gd99FsErS0auqzZhCCl%2Fa6aY0nCj8JCGYLZxyEKlY4ww5fIdYkbghMAvoHVl2eMHjQTFOpHWC6XQ92fzT2ar8dRat6XduTYqa%2Bww1WueCGmADSglCqCSgrK%2BLR5UYI6LtSYtuFN2TQ%2FK3jxMQD6OECMJPBP5OMCkdgR5HbreNTvT9MG9m0Qm9X3T8NroiGxfYrD%2FEIu0gddCtgk2VTSlu0iOhfL22pcYaUXOVQT6kTh2khC9e4AJaEX5OAok1%2BLYvwe3L0F0iut0QhMrlSfIxu575PJgT%2BIDIfVVU8RCwzbjde4F9Yq%2BQl4K2zvidIkSVZ0DC0LwFz7huVa4hzMPmzGPhSfqj6A0lI%2BTPySrXcBsi6jarmntous4cwvFZ83myvlN9M5fbFegiqrq%2Ftywq7xpC3QLa6u38j0oQSUy1P%2FTTcb9G5qMO2gy%2Fv8m83xNZvGHmwwb0EuSp4I7lMdM0uk3vqJZZGZl7ZnxxDCa%2BrkZDPE7kRL5g2YlJX0ews8FwfOs%2BWbcidKI6KUq5Gq1XHmL59GBu%2FhBB2yoA%2B8BHXhP1wGZ3edt7Tv7SWCr7w%3D%3D" />

然后现在进行右查找，右查找是个赋值表达式`a = {n: 2}`，所以得先处理这个赋值表达式。而前面的`a.x`还在等待后面表达式处理返回的结果。

<CenterImg src="https://res.zrain.fun/images/2022/06/js_continuous_assignment_part_3-bb1b8afda6a0fb7f8367863f6bafcccc.png" alt="js_continuous_assignment_part_3" zoom="60%" source="https://app.diagrams.net/#R7VjbbptAEP0aP9bCbIzhMXHstGojVXKlpnlbYAzbLAxd1jbu13cWFtuUXKWkcdS8wM7Z68w5zKwYsGlWXShepJcYgxy4TlwN2PnAdUdu4NLLINsG8QKvARIlYjtoDyzEb7CgY9GViKHsDNSIUouiC0aY5xDpDsaVwk132BJld9eCJ9ADFhGXffS7iHXaoL472eMfQSRpu%2FPIC5qejLeDrSdlymPcHEBsNmBThaibVlZNQZrgtXFp5s3v6N0dTEGuHzMh2q4%2FJbOQr39dLj7fyPTiWkQfLBml3rYOQ0z%2BWzPHnF5nCld5DGYZhyxUOsUEcy6%2FIBYEjgj8CVpvLXt8pZGgVGfS9kIl9NVB%2B4dZaji21nllV66NrTWWmOs5z4Q0wCUoJTZAIQVl%2Bxa4UpHZLtWatOCO2Sk9yHvzMAPKYYKYSOCFKIcRZnVHVNZD58tmZWreunbjyKg%2Bbx6fGh2RHUqMbr6lIm%2FguZCtg00UTejuJMdCZXvsuxhpRc5VAvqecWwnIfr2ADPQivxxFEiuxbp7Dm4%2FgmQ3bq8TalipPEE2dt01lyu7U9gTUlc1m1RoWBS89n1DuaKrkGNhe0mcTlGiqn1gUQyhHxJeaoU3cNDDPBaweEf9GpSG6n7y%2B2TZCbsUYXOkO7H2Zp9xWig9SDYnzgvROznarEARVdurQ8POCsYtsJ9YW52ZX0EJCpGh%2Fr9OMu5bSDJuL8nwYfWeZp4tzTD2ymmG9Qgm0VPAHfLDk7T7WaiolZhWVfd4PDOM5mFpXob4pciJ%2FF66kpIuiPCwIHhZNLfGpaiMiI5VISez6Szwn0cHbPJXufH7Oghu0UHwUjpo7%2Fpvqd48UG2ORUb%2FurD4jywswWsWFr9fWN7LyvPdXkevXFaCHr2DyZlsKgs1z9%2BrxZOqhT%2Fu0uv06fVuodd7Or1k7n%2BH1H0HP5XY7A8%3D" />

重要的是，此时的`a.x`已经指向了内存中的`{ n: 1, x: undefined }`中的`x`，目前他正等待被赋值，所以下面在处理赋值表达式`a = {n: 2}`时候，即使 a 发生了指向的变化，**但也不再影响此刻的`a.x`了**，因为已经对`a.x`进行了指向的确定，只不过他现在正在等待被赋值。

因为赋值操作符的返回值，是返回右边的部分，对`a.x`的赋值操作也变成了：

```javascript
a.x = { l: 2 }
```

现在答案应该清楚了：

```javascript
console.log(a.x) // undefined
console.log(b.x) // { l: 2 }
```

## Rrfer

[javascript 面试题，关于连续赋值的坑？ - 知乎](https://www.zhihu.com/question/41220520)

[由 ES 规范学 JavaScript(二)：深入理解“连等赋值”问题 - 思否](https://segmentfault.com/a/1190000004224719)
