---
date: 1650808533377
title: 'Canvas从零开始实现2048'
link: '/post/learning/build_2048/index'
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
import ArcToCanvas from './ArctoCanvas.vue'
</script>

<div style="height:150px;background:#eee4da;text-align:center;user-select:none;line-height:150px;font-size:3em;color:#776e65;font-weight:600;margin-bottom:16px">2048</div>

前些阵子些许无聊，借此空闲时间想用 Canvas 实现一个小游戏，选来选去最后决定是 2048（太难容易没巩固的效果，太难打击自信心 🤣）。但让我没想到的是其中 Canvas 涉及的东西并不多。下面补充一下 2048 的[游戏规则](https://zhidao.baidu.com/question/1994394486771253027/answer/3040502574)：

1. 开始时随机出现一个格子。
2. 手指向一个方向滑动，所有格子会向那个方向运动。
3. 相同数字的两个格子，相撞时数字会相加（格子合并），且只可出现一次**同时**合并。
4. 每次滑动时，空白处会随机刷新出一个数字的格子，值为 2 或 4。
5. 当界面不可运动时（当界面全部被数字填满时），游戏结束；当界面中最大数字是 2048 时，游戏胜利。

## 新建操作画布

> 工欲善其事，必先利其器。 --- 《论语》

为了防止出现绘制模糊的问题，参考了[Canvas 为什么变得这么模糊？](/post/learning/why_canvas_blur/)里的代码。新建 Canvas 代码如下：

```javascript
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')
const CH = 500
const CW = 500

// 调整Canvas
CANVAS.style.height = CH + 'px'
CANVAS.style.width = CW + 'px'
CANVAS.height = CH * window.devicePixelRatio
CANVAS.width = CW * window.devicePixelRatio
CTX.scale(window.devicePixelRatio, window.devicePixelRatio)

// Canvas基础样式
CTX.lineWidth = 4
CTX.font = 'normal 600 30px "JetBrains Mono"'
```

## 绘制游戏背景

参考最火热的 2048 在线试玩[网站](https://play2048.co/)，决定实现[如下效果](https://blog.csdn.net/fatansitic/article/details/51981298)：

<CenterImg src="https://res.zrain.fun/images/2022/04/2048%E8%83%8C%E6%99%AF-70559f88d1437061e1a8f5b2ba53c426.png" alt="2048背景" zoom="45%" />

给人最直观的感受就是，呃。。。这个背景全是由大小不一的圆角矩形组成的。但 Canvas 里没有直接绘制圆角矩形的函数，这就需要东拼西凑了。

### 实现一

使用 `arc` 和 `lineTo`。

观察发现圆角矩形四个角都是 1/4 个圆，只是各自的朝向不同罢了：

<CenterImg src="https://res.zrain.fun/images/2022/06/fillet_implementation_1-bec3610ce0e64df60fe3e47bc78a4743.png" alt="fillet_implementation_1" zoom="40%" source="https://app.diagrams.net/#R7VrbctowEP0aZtIHMrZlu%2FgxENLOpOm0Q2ea9k3YwtZEtlxZBOjXVzdjfEmTtBBIax7AWt1We86upDUDMEnX7xjMkxsaITJwrGg9AJcDx7GdwBE%2FUrLREj%2FwtSBmODKNKsEM%2F0RGaBnpEkeoqDXklBKO87owpFmGQl6TQcboqt5sQUl91hzGqCWYhZC0pV9xxBMtHTlvK%2Fl7hOOknNn2A12TwrKxWUmRwIiudkRgOgATRinXT%2Bl6gog0XmkX3e%2FqgdqtYgxl%2FCkdht%2BXt9702%2B2Ha%2FvmGizu7I%2Bfo6FB5x6SpVmwUZZvSgusEszRLIehLK8EygMwTnhKRMkWj7DItd0XeI3EVOMFzfgVTDGRiN8gxvAKCVsgZupmdMnUWAnnAkTHAxfiS6gtv2SD4jymNCYI5rg4D2mqKsJCNb1a6JHFY%2BfYmj%2B2VGyBCZlQQplaBkDqI%2BSMLrNIaqrULzijd2inHfBBAOQ6jGUQ42j9oMntLZDCAxBNEWdCOct0cAKDvSG%2F7ZvyqqKSYxlZskOjrRAa%2BsbbsSuExYMB%2BRmAg8cBF6MI75Kmei70ddOeChFeCEi%2FA0f%2FUDAGj8Mo4k2ucIObnGK5znFxh3go1bWMf8xM84ISOd240GbzxaPqg9j0XpioMIgqmVqKNx54lw0ny2im%2FAuJUeBcjWspUnDId8o5YlgYQUJ1GSI5x6dKMi4ymH%2Bhn7TCatJ%2FllTAapDqbZtUbgep3EORyu6Dw5%2Fg6IITCw6220eH188q99Sig9dHhz0cHbZR%2F2jRwe%2Bjw6tnVfPsAOwjR4dyCX10%2BKuzw9GjQwlbHx1eM6vcU4sOT7lZZNGFTNiJ0pzQ8O5LgrN6WKjwsk4IL4EJ29waFVXhm9Tw3CuLl2ujsS5ttqXoCpNybdocKGplIxuYC5OV63rI2CY3wCGLEf9NO9DNoR2OeB0cKWUMEcjxfV3dLuKYGbTjVRuY1zjeNrmnl2l67aY1GwO5jZ0waIyjzdAaR9F4u%2Bq%2FYHb7rsVa1BaezOtUrqcdTXzrCHmQ4DjbhjMhkHEBh5BcmIoURxF5aEs9TYfZx%2FHHefxyBDrI6xwswLUvR2eCBxPpKG96Prx4ftZ52jEKHIwP7UvWmdal58Sx0nJH58QzkvYho0Uxh%2Bzxu1L9EBthJm5OmGbq6L2U6zwZTBsv5NzpZBqM9uT%2FfgPrzhdtXfvBwd6zWS2wzcS94x96M7DrZHBc77iOD56QG%2FkfHV%2Fd37XKw8Da08lw1AB%2FdPRI0M6omJNAHwgOfEto7AqggwsvGwjaaZDyllBuDtawPx4e5crgdBwZghclR9dbW59ws%2FwaHfwfS1pWDHVqVRjasu18raxT1ounWP6Wdw%2FNLsU4PfKclU3EL0wl4tm8UDtNk5C6w0DjWPXqeXrga0zzNNPB09F%2BeCqK1d8RdYKs%2BlMnmP4C" />

最后使用 lineTo 把各自端点连接起来就好了。

```javascript
/**
 * 绘制圆角矩形
 * @param {number} h 高度
 * @param {number} w 宽度
 * @param {number} r 圆角半径
 */
function drawRoundRect(h, w, r) {
  cxt.beginPath()
  cxt.arc(r, r, r, Math.PI, (Math.PI * 3) / 2)
  cxt.lineTo(w - r, 0)
  cxt.arc(w - r, r, r, (Math.PI * 3) / 2, Math.PI * 2)
  cxt.lineTo(w, h - r)
  cxt.arc(w - r, h - r, r, 0, Math.PI / 2)
  cxt.lineTo(r, h)
  cxt.arc(r, h - r, r, Math.PI / 2, Math.PI)
  cxt.closePath()
}
```

### 实现二

使用 `arcTo`。

CanvasRenderingContext2D.arcTo() 是 Canvas 2D API 根据控制点和半径绘制圆弧路径，使用当前的描点(前一个 moveTo 或 lineTo 等函数的止点)。根据当前描点与给定的控制点 1 连接的直线，和控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的切线，画出两条切线之间的弧线路径。

<small>\*以上文字来自 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arcTo" target="_blank" rel="noreferrer">MDN</a></small>

为此我写了一个可互动的示例：

<ArcToCanvas/>

<small>\*使用鼠标改变控制点 1 🙌</small>

借助这个方式，可以封装一个绘制圆角矩形的方法，毕竟用武之地还很多：

```javascript
/**
 * 绘制圆角矩形
 * @param {number} x 绘画起始点x
 * @param {number} y 绘画起始点y
 * @param {number} h 高度
 * @param {number} w 宽度
 * @param {number} r 圆角半径
 * @param {string} c 背景颜色
 */
function drawRoundRect(x, y, h, w, r, c) {
  let offsetH = x + w,
    offsetW = y + h
  CTX.beginPath()
  CTX.moveTo(x + r, y)
  CTX.lineTo(offsetH - r, y)
  CTX.arcTo(offsetH, y, offsetH, offsetW - r, r)
  CTX.lineTo(offsetH, offsetW - r)
  CTX.arcTo(offsetH, offsetW, offsetH - r, offsetW, r)
  CTX.lineTo(x + r, offsetW)
  CTX.arcTo(x, offsetW, x, offsetW - r, r)
  CTX.lineTo(x, y + r)
  CTX.arcTo(x, y, x + r, y, r)
  CTX.fillStyle = c
  CTX.fill()
  CTX.closePath()
}
```

其实也可以用**实现二**的，但考虑到定位有些麻烦便偷了个懒 🤣。顺便说一下，一个数字的容器我称之为 **Cell** 而容纳和管理这些 Cell 的容器我称之为 **CellBox**。

## 实现 CellBox

先来设置 CellBox 应该具有的属性，身为“管理者”必然有诸多的配置：

```javascript
class CellBox {
  constructor() {
    /**
     * 行数
     * @type {number}
     * @public
     */
    this.row = 4
    /**
     * 列数
     * @type {number}
     * @public
     */
    this.col = 4
    /**
     * 存储cell的二维数组
     * @type {(Cell | number)[][]}
     * @public
     */
    this.cellArr = []
    /**
     * 存储空的坐标
     * @type {(()=>boolean)[][]}
     * @public
     */
    this.animeProcessArr = []
    /**
     * 是否正在动画
     * @type {boolean}
     * @public
     */
    this.animing = false
    this.init()
  }
}
```

其中，`cellArr` 是一个二维数组，第一维存储行，第二维存储列。关于为什么 `cellArr` 的类型有两种情况（Cell 或者 number），这和 Cell 移动动画和绘制有莫大的关联。如果不需要实现动画，就可以免去保存要被执行动画的 Cell。具体对应：

- Cell：当前为边缘 Cell 或判定为并不需要（动画）移动的单元格。

- 0：当前的位置没有 Cell。

- 正数 k：当前位置将会有值为 k 是单元格占据。

- 负数数 k：当前位置将会有值为 k 是单元格占据，并且已经执行了一遍合并操作。

下面列出向上移动要发生的所有情况和处理对策：

1. 靠顶合并

判定 Cell[1,0]可以向上移动，将其为位置置为 0，并为 Cell[1,0]保存动画函数和回调。

```text
  C2  |  0   |  0   |  0           C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------      ------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           0   |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------  OR  ------|------|------|------  ->  ------|------|------|------
  0   |  0   |  0   |  0           C2  |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------      ------|------|------|------      ------|------|------|------
  0   |  0   |  0   |  0           0   |  0   |  0   |  0           0   |  0   |  0   |  0
```

2. 非靠顶合并

判定[1,0]和[2,0]可同时向上移动，循环控制中保证顺应操作方向的 Cell 优先处理。两个为置都置为 0，并将[0,0]置为 Cell[1,0]的值，也就是 2。轮到 Cell[2,0]时发现可以和[0,0]位置的 Cell 合并，并将[0,0]置为-4（表明已发生过合并操作） 。动画回调将[0,0]置为 Cell[2,0]。

```text
  0   |  0   |  0   |  0           0   |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------      ------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           C2  |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------  OR  ------|------|------|------  ->  ------|------|------|------
  C2  |  0   |  0   |  0           0   |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------      ------|------|------|------      ------|------|------|------
  0   |  0   |  0   |  0           C2  |  0   |  0   |  0           0   |  0   |  0   |  0
```

3. 三顶合并-1

优先合并朝向操作方向的 Cell。

```text
  C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           C2  |  0   |  0   |  0
------|------|------|------  ->  ------|------|------|------
  C2  |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  0   |  0   |  0   |  0           0   |  0   |  0   |  0
```

4. 三顶合并-2

**非靠顶合并**后，Cell[2,0]发现[0,0]的值为负数，判定不可合并，将[1,0]置为 4。

```text
  C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------  ->  ------|------|------|------
  C4  |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  0   |  0   |  0   |  0           0   |  0   |  0   |  0
```

5. 四顶合并

根据规则三，允许同时合并的情况。根据**三顶合并-2**，[0,0]和[1,0]不可再合并。

```text
  C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           C4  |  0   |  0   |  0
------|------|------|------  ->  ------|------|------|------
  C2  |  0   |  0   |  0           0   |  0   |  0   |  0
------|------|------|------      ------|------|------|------
  C2  |  0   |  0   |  0           0   |  0   |  0   |  0
```

准备好理论操作后，开始实践！

根据规则一，我们需要在 4x4 的 CellBox 中随机生成一个带数字（2 或 4）的 Cell，我借助下面的函数实现：

```javascript
/**
 * 生成一个随机或测试Cell
 * @param {Coord} t 测试Cell生成坐标
 * @param {number} n 测试Cell数字
 */
genRandomCell(t, n) {
  const emptyCells = []
  for (let x = 0; x < this.row; x++) {
    for (let y = 0; y < this.col; y++) {
      // 如果为0，可以在这个位置生成新的Cell
      if (this.cellArr[x][y] === 0) emptyCells.push([x, y])
    }
  }
  let eLen = emptyCells.length
  if (eLen !== 0) {
    let [x, y] =
      t ||
      emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1)[0]
    // 随机数的生成偷了个懒
    let cell = new Cell(x, y, n || Math.random() > 0.5 ? 2 : 4)
    this.cellArr[x][y] = cell
    cell.draw()
  }
}
```

这里我添加了一个方便测试的功能，能指定在坐标[x,y]里生成指定数字 n。

接下来就是移动 Cell 的方法了，我拿向上移动的操作单独分析，其它操作大同小异。因为一次操作会影响所有已存在的 Cell，因此我们需要遍历，其中的 `moveCell` 方法会为每一个需要移动的 Cell 构造一个动画函数，方便在 Canvas 渲染。

```javascript
/**
 * 向上移动全部Cell
 */
moveAllToTop(){
  // row从1开始，因为row=0是肯定不能再向上移动的，等待他们的只有可能的合并操作 🤣
  for (let x = 1; x < this.row; x++) {
    for (let y = 0; y < this.col; y++) {
      this.moveCell(this.cellArr[x][y], 'moveToTop')
    }
  }
}

// 省略向下、向左、向右操作
```

接下来就是处理 Cell 动画的部分了，首先借助 `requestAnimationFrame` 封装一个动画执行函数：

```javascript
/**
 * @param {Function} fn 动画函数
 * @param {duration} fn 执行时间
 */
function RAF(fn, duration = Infinity) {
  let stopAnime = false,
    rid
  const stop = () => (stopAnime = true) && cancelAnimationFrame(rid)
  const run = () => duration > 0 && requestAnimationFrame(anime)
  function anime(time) {
    fn(time)
    if (!stopAnime) {
      rid = requestAnimationFrame(anime)
    }
  }
  return {
    stop,
    run
  }
}
```

接着就可以实现 CellBox 的绘制函数了：

```javascript
/**
 * 绘制canvas
 */
draw() {
  CTX.clearRect(0, 0, CW, CH)
  drawRoundRect(0, 0, CH, CW, 10, '#bbada0')
  // 开启方格移动动画
  if (this.animeProcessArr.length !== 0) {
    // 标识动画正在执行
    this.animing = true
    const anime = RAF(() => {
      let stopAnime = true
      CTX.clearRect(0, 0, CW, CH)
      drawRoundRect(0, 0, CH, CW, 10, '#bbada0')
      this.reDrawCells()
      this.animeProcessArr.forEach(f => (stopAnime = f() && stopAnime))
      this.animing = !stopAnime
      if (stopAnime) {
        // 当本次操作所有动画函数执行完就停止动画
        anime.stop()
        this.genRandomCell()
        this.animeProcessArr = []
      }
    })
    anime.run()
  } else this.reDrawCells()
}
```

对了，不要忘了绑定操作事件，不然用户怎么操作啊 🤣：

```javascript
/**
 * 绑定键盘事件
 */
bindKeyboardEvent() {
  window.addEventListener('keydown', e => {
    // 有动画正在进行，阻止用户的所有操作
    if (this.animing) return
    switch (e.code) {
      case 'ArrowUp':
        this.moveAllToTop()
        this.draw()
        break
      case 'ArrowDown':
        this.moveAllToBottom()
        this.draw()
        break
      case 'ArrowLeft':
        this.moveAllToLeft()
        this.draw()
        break
      case 'ArrowRight':
        this.moveAllToRight()
        this.draw()
        break
    }
  })
}
```

到这里 CellBox 的主要函数已实现完毕。

## 实现 Cell

Cell 中的核心函数无非就是判断 Cell 是否移动，并设置相应的回调。这里仍然用向上移动操作分析。

下面是我定义的 Cell 的构造函数：

```javascript
/**
 * @param {number} x 绝对坐标
 * @param {number} y 绝对坐标
 * @param {number} score 显示的数字
 */
constructor(x, y, score) {
  this.x = x
  this.y = y
  this.merged = false
  this.score = score
}
```

其中的**绝对坐标**只是表明当前 Cell 在 CellBox.cellArr 的坐标，在绘制时还需计算出相对坐标：

```javascript
draw() {
  // 计算相对坐标
  let offsetX = 20 + this.y * 120,
    offsetY = 20 + this.x * 120
  drawRoundRect(offsetX, offsetY, 100, 100, 10, '#cdc1b4')
  CTX.fillStyle = '#555'
  CTX.fillText(this.score, offsetX + 50, offsetY + 50)
}
```

接下来看一下移动核心的实现：

```javascript
/**
 * Cell向上移动
 * @param {(Cell | number)[][]} cells CellBox.cellArr
 * @param {(()=>boolean)[][]} animeProcessArr CellBox的动画集合
 */
moveToTop(cells, animeProcessArr) {
  /**
   * 获取最终移动目标位置
   * @param {(Cell | number)[][]} c CellBox.cellArr
   * @param {number} x 递归到的x
   * @param {number} y 递归到的y
   * @returns {Coord | null} 返回当前Cell应该移动到的最终位置
   */
  const recur = (c, x, y) => {
    if (x === 0) {
      c[0][this.y] = this.score
      return [0, this.y]
    }
    if (c[x - 1][y] === 0) {
      // 表明当前并无Cell，直接上移
      c[x][y] = 0
      // 继续递归，直至不能再向上移动
      return recur(c, x - 1, y)
    } else if (
      (c[x - 1][y] instanceof Cell &&
        c[x - 1][y].score === this.score &&
        !c[x - 1][y].merged) ||
      c[x - 1][y] === this.score
    ) {
      c[x][y] = 0
      // 如果是一个标记数，则设置为2倍的负数，否则设置merged属性为true。皆表明合并操作已进行
      c[x - 1][y] instanceof Cell
        ? (c[x - 1][y].merged = true)
        : (c[x - 1][y] = -2 * this.score)
      this.merged = true
      return [x - 1, y]
    }

    if (this.x === x) {
      // 表明在当前位置无法移动，因此无需构造动画函数
      return null
    } else {
      // 不可再向上移动了，返回最终位置，并设置标记数
      c[x][y] = this.score
      return [x, y]
    }
  }
  this.addToAnimeProcess(cells, animeProcessArr, recur(cells, this.x, this.y))
}

/**
 * 将移动Cell动画添加到animeProcess
 * @param {Cell[][]} cells CellBox.cellArr
 * @param {(()=>boolean)[]} animeProcessArr CellBox的动画集合
 * @param {Coord|null} target 当前Cell应该移动到的最终位置
 */
addToAnimeProcess(cells, animeProcessArr, target) {
  if (target) {
    animeProcessArr.push(
      createCellAnime(this, target, () => {
        // 如果已被标记合并，直接边为两倍
        this.score *= this.merged ? 2 : 1
        // 设置目标位置为当前Cell
        cells[target[0]][target[1]] = this
        // 重置合并标记
        this.merged = false
      })
    )
  }
}
```

这里我卡了很久，最后的实现效率也比较低，但至少靠自己实现了移动的核心逻辑，还是有所收获的，其实最后的判断是否“Game Over”我还没实现（DFS 应该可以）🤪。另外其它的操作方向大同小异。完整代码及其预览查看 CodePen：

<iframe height="600" style="width: 100%;" scrolling="no" title="2048" src="https://codepen.io/pocket-gad/embed/preview/wvpLmXo?default-tab=result&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/pocket-gad/pen/wvpLmXo">
  2048</a> by zRain (<a href="https://codepen.io/pocket-gad">@zRain</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 总结

Canvas 真是太有趣了（苦笑）。
