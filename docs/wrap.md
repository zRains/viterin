---
title: 什么是BFC
---

#### 什么是 BFC

**BFC(Block Formatting Context)**：块级格式化上下文。
BFC 决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。当设计到可视化布局的时候，BFC 提供了一个环境，HTML 元素在这个环境中按照一定的规则进行布局。一个环境中的元素不会影响到其他环境中的布局。

#### BFC 的原理（渲染规则）

1. BFC 元素垂直方向的边距会发生重叠。属于不同 BFC 外边距不会发生重叠
2. BFC 的区域不会与浮动元素的布局重叠。
3. BFC 元素是一个独立的容器，外面的元素不会影响里面的元素。里面的元素也不会影响外面的元素。
4. 计算 BFC 高度的时候，浮动元素也会参与计算(清除浮动)

#### 如何创建 BFC

1. overflow 不为 visible;
2. float 的值不为 none；
3. position 的值不为 static 或 relative；
4. display 属性为 inline-blocks,table,table-cell,table-caption,flex,inline-flex;

#### BFC 可以包含浮动的元素

浮动的元素会脱离普通文档流：

```html
<div style="border: 1px solid #000;">
  <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

![img](https://cdn.jsdelivr.net/gh/zrains/images/2022/02/v2-371eb702274af831df909b2c55d6a14b_720w-3bfa11d721af2ce894ecece8672b092d.png)

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果使触发容器的 BFC，那么容器将会包裹着浮动元素。

```html
<div style="border: 1px solid #000;overflow: hidden">
  <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

![img](https://cdn.jsdelivr.net/gh/zrains/images/2022/02/v2-cc8365db5c9cc5ca003ce9afe88592e7_720w-06a29c7dd5f6a82c7fefacd1f5378a03.png)

#### BFC 可以阻止元素被浮动元素覆盖

一个文字环绕效果：

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">
  我是一个没有设置浮动, 也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;
</div>
```

![img](https://cdn.jsdelivr.net/gh/zrains/images/2022/02/v2-dd3e636d73682140bf4a781bcd6f576b_720w-6f5b73783d5c385220e725ae2bf73f19.png)

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 **overflow: hidden**，就会变成：

![img](https://cdn.jsdelivr.net/gh/zrains/images/2022/02/v2-5ebd48f09fac875f0bd25823c76ba7fa_720w-5ebd48f09fac875f0bd25823c76ba7fa.png)
