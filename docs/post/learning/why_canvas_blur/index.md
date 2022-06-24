---
toc: false
date: 1649942694484
title: 'Canvas为什么变得这么模糊？'
link: '/post/learning/why_canvas_blur/index'
file: 'index'
scope: ['browser', 'canvas']
buckets: ['post', 'learning']
draft: false
visible: true
lang: 'zh'
layout: 'page'
advanced: true
---

<script setup>
import CanvasBlurExample from './CanvasBlurExample.vue'
import DevicePixelRatio from './DevicePixelRatio.vue'
</script>

当我使用 canvas 进行绘制时，发现总是会变的模糊不清（肯定不是因为我的近视 🤣），就像加了一层滤镜。就如下面这个例子，我画了一些东西：

<CanvasBlurExample/>

可能看不出模糊的效果，下面这是修复后的：

<CanvasBlurExample fixed/>

是不是清晰了许多？为了理解上述产生的问题，我们需要了解两个概念：

- 设备像素比
- canvas 的 css 宽高与上下文宽高

## 设备像素比，DPR

你当前设备的 DPR: <DevicePixelRatio />。

什么是设备像素比（devicePixelRatio, DPR）？举个简单的例子，在 iPhone3G 时代，屏幕宽度是 320px，其宽度上的物理像素也是 320px；而到了 4s 时代，屏幕宽度依然是 320px，但是宽度上的物理像素却变成了 640px，是宽度的两倍。屏幕宽度没变，物理像素却增加了，所以为了屏幕显示的内容不改变，原先需要一个像素绘制的点，现在会用两个像素来绘制。

<CenterImg src="https://res.zrain.fun/images/2022/06/devicePixelRatio-9457e9e1d4e57b9002490854c0de3098.png" alt="devicePixelRatio" zoom="65%" source="https://app.diagrams.net/#R7Zthb%2BIgGMc%2FjS9vaaGt%2BnLqdksuu%2BziJZfcO67FlgxLQ3G6ffqDFq2VLrpkTmrYC4cP8ADP%2F1ctj3QAp8vNd46K7JElmA6Al2wGcDYAwAdjIP8py2ttiYJxbUg5SXSjxjAnb1gbPW1dkQSXrYaCMSpI0TbGLM9xLFo2xDlbt5stGG2PWqAUG4Z5jKhp%2FUMSkdXWERg29gdM0mw7sh%2Fp9S3RtrFeSZmhhK33TPBuAKecMVGXlpsppip427jU%2Fe7fqd1NjONcnNLh708vjdYPb8GP2a%2FNYzgfv6Lsm%2FbyguhKL1hPVrxuI8DZKk%2BwcuIN4GSdEYHnBYpV7VpqLm2ZWFL5zpfFBcvFPVoSquR%2BxJyTNZaBwFzXzdmKV10zIaSCIIS38kXOWb2oBuVNylhKMSpIeROzZVURl1XT%2B0XtWRY7fdfw%2BNU8CKVTRhmv1gBx9SftpeDsGe%2FVwAiOoVzcRAcCc4E370bY3%2BkmgcdsiQWX0%2FF0BxBoKjTr%2FlBLv27I8aF2m%2B1TM9YNkaY13fluBJUFrekH9B0d11dyWVRioteCEbXSSfmMRZxpxVUo57p5yagablLWoY5kseqD%2Bd2LDFKpKahs1VLCySCcHeiRs1xJwbH0gv5VftU4nAkk9t4XmBMZBCXvLMZqjKfGMilzVPxmT%2FWEq0EbTm0C8VOwCo5iFXgmVcG5oBo7qPoPVQTtgmr7he%2Bo6jNVI2AZVSfc4DiqLKcKep5lVAWOqv5T5Y8toyp0VPWfKjiyjKrIoCpSK9oYbMlFi%2FZuvr1b1ih00IEoSfOd8tKgQkhiRG91xZIkiRqmM33QTjDYwELwWXdDBxu3wGQh6mABno2FoWPhQiwEo9FNaBkNZnKoooFsMC0dEe8SAc6TLYTwwjyAE3bgLhl88gUfHk%2BwfHEyGJibYR%2B4K%2F7LrvhDJC5%2FxQO34%2Bj9jiMILMuOAOio6j9VoW1UuZzbFVAV2UaVy7ldAVVD73BvfXGuzKyb46p3XI18y6gy83eOqt5RNfat%2B7Ryx8T6z1Xo2ceVOyl2BVz5wDautgkxx1WfuQLQOq7cabEr4Arax5XLs18BV0FgHVcu034FXIWhdVyZuXa5BqmaDKLnG4i5H4rPfHAMdgDxpT8UQzNN3gBhfuY4ID779JiRM7o8Eh%2FIGS0o3tyqh3FlNHCe6OIspqgsSdwmxT4NwQGqHzlChBPj8eKjmu8pGnYourVxTJEgL233XTLrEeov0%2Bag8vaYkQYKRPL2ZtT2UlbR1R0bXgxfh0cQunwJxFMsDF8Ve7vFd%2BEo3zYPSdfNm0fN4d1%2F" />

为了表示这种屏幕的特性，浏览器全局对象下就有了这样一个属性——devicePixelRatio 设备像素比，它的计算方式是：

<p style="text-align:center;font-size:1.1em;font-weight:bold">devicePixelRatio = 物理像素 / 屏幕宽度的像素</p>

所以 3G 的设备像素比为 1 ， 4s 为 2，而现在 iPhone 的 plus 型号手机的设备像素比为 3，甚至部分出现了比值为 4 的安卓设备。

回到 canvas 上的问题上，当我们想要绘制一条 1px 的线时，由于当前浏览器的设备像素比是 2，所以实际上是通过 2 个像素点来绘制的，但是即便是 2 个像素绘制的线条也不应该出现模糊的问题，而现在确实模糊了，这又是为什么呢？

## Canvas 宽高与上下文宽高

修复前渲染出的代码是这样的：

```html
<canvas height="200" width="800"></canvas>
```

其实，canvas 标签中的 width 和 height 属性并不是 css 中的宽高，而是 canvas 绘图上下文（绘图区域）的宽高，当不设置 canvas 的 css 宽高时，canvas 会将 width 和 height 的值作为 css 宽高，而 css 宽高使元素在页面上的可见尺寸。

但是 canvas 的上下文宽高略奇怪，它可不管像素比是 1 是 2 还是 3，它就是会将整个 canvas 绘图区域塞进 css 宽高中并且填满，绘图的时候会将绘制的图形的宽高按照塞进 css 时宽与高的缩放比率分别进行缩放（所以如果缩放比率不同，就会导致绘制的图形变形），当然，这不是导致模糊的原因，这个只会引起形变。下面这个才是导致模糊的元凶：

canvas 绘图时，会从两个物理像素的中间位置开始绘制并向两边扩散 0.5 个物理像素。当设备像素比为 1 时，一个 1px 的线条实际上占据了两个物理像素（每个像素实际上只占一半），由于不存在 0.5 个像素，所以这两个像素本来不应该被绘制的部分也被绘制了，于是 1 物理像素的线条变成了 2 物理像素，视觉上就造成了模糊。

## 解决模糊

首先分别声明 canvas 的 css 宽高和上下文宽高，同时上下文宽高应该是 css 宽高的 devicePixelRatio 倍：

```html
// 假设devicePixelRatio = 2，上面canvas里的DPR是你当前设备的真实DPR 🙌
<style>
  canvas {
    width: 200px;
    height: 200px;
  }
</style>
<canvas id="canvas" width="400" height="400"></canvas>
```

虽然是 1px 的边框，但是由于绘制在 400px \* 400px 的区域上，而画布又等比缩放在 200px \* 200px 的 canvas 标签内，导致 1px 变成了 0.5 px，但因为无法绘制 0.5px 所以依然是通过 2 个物理像素绘制。

下一步，我们需要将 canvas 的绘图区域扩大一倍（因为 devicePixelRatio = 2），这样才能让视觉上的效果正常：

```javascript
CTX.scale(2, 2)
```

此时原先 0.5px 的线条变成了 1px，依然通过 2 个物理像素绘制，所以虽然扩大了一倍，但是边框宽度并不会改变。而且因为两个像素是可以绘制的，因此模糊 的问题就解决了。

canvas 部分代码：

```javascript
const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')
const CH = window.innerHeight
const CW = window.innerWidth

CANVAS.style.height = CH + 'px'
CANVAS.style.width = CW + 'px'
CANVAS.height = CH * window.devicePixelRatio
CANVAS.width = CW * window.devicePixelRatio
CTX.scale(window.devicePixelRatio, window.devicePixelRatio)
```

## Refer

[Canvas 绘图模糊问题解析 - 知乎](https://zhuanlan.zhihu.com/p/31426945)
