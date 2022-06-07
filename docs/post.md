---
title: ShadowDOM
layout: page
---

ShadowDOM 主要解决一个文档中可能需要大量交互的多个 DOM 树建立和维护各自功能边界的问题。MDN 描述：

> ShadowRoot 接口是一个 DOM 子树的根节点, 它与文档的主 DOM 树分开渲染。

顾名思义，它与主文档隔绝，互不影响，不局限于 CSS。ShadowDOM 经常作用与浏览器控件，比如`video | audio`标签。如果直接在开发者工具查看，只能看见单独的一个标签，其中播放，暂停等控件是看不见的。可开启开发者工具 -> setting -> Elements -> show user agent shadow DOM 进行查看

#### ShadowDOM 的意义及用法

在我的理解，它可以帮助我们`高度封装`一个控件。正常情况下，该控件不会被外面的因数干扰，不会被外面的 CSS 选择器无意选中。那么如何快捷的实现这个控件呢？W3C 提出了 ShadowDOM 的概念，ShadowDOM 可以使一些 DOM 节点在特定范围内可见，而在网页 DOM 树中不可见，但是网页渲染的结果包含了这些节点。

![SVG 版本的图表显示了文档、影子根和影子主机的交互。](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM/shadowdom.svg)

#### 创建 ShadowDOM

HTML 部分：

```html
<div class="box"></div>
```

ShadowDOM 只能通过 js 创建：

```js
// 获取要附着ShadowDOM的根元素
let rootDom = document.querySelector('.box')
// 配置ShadowDOM，mode有两个选项：open（标识之后可以通过根元素来操作ShadowDOM），close（相反）
let shadowDom = rootDom.attachShadow({ mode: 'open' })

console.log(rootDom.shadowRoot) // mode:open -> shadow-root(open)
console.log(rootDom.shadowRoot) // mode:closed -> null

// 创建测试元素
let para = document.createElement('p')
para.classList.add('test')
para.innerHTML = '123'
// 添加测试元素
shadowDom.appendChild(para)
```

#### 适配

MDN 相告

> **Note**: Shadow DOM is supported by default in Firefox (63 and onwards), Chrome, Opera, and Safari. The new Chromium-based Edge (79 and onwards) supports it too; the old Edge didn't.

还是不要乱用了，不好适配。

#### 参考文章

[Using shadow DOM - MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

[谈一谈神奇的 ShadowDOM-ShadowRoot - CSDN](https://blog.csdn.net/a460550542/article/details/88996225)
