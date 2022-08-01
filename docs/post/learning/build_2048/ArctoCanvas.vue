<template>
  <div ref="CANVASBOX" class="ArctoCanvas">
    <canvas class="arcToCanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const CANVASBOX = ref<HTMLCanvasElement>()

onMounted(() => {
  const CANVAS = CANVASBOX.value!.querySelector('.arcToCanvas') as HTMLCanvasElement
  const CTX = CANVAS.getContext('2d')!
  const CH = 350
  let CW = 400

  const resizeObserver = new ResizeObserver((entries) => {
    CW = entries[0].contentRect.width
    fixCanvas()
    initDraw()
  })

  resizeObserver.observe(CANVASBOX.value!)

  function drawArc(x: number, y: number) {
    // 绘制虚线
    CTX.beginPath()
    CTX.strokeStyle = '#95a5a6'
    CTX.setLineDash([5, 3])
    CTX.moveTo(150, 50)
    CTX.lineTo(x, y)
    CTX.lineTo(200, 300)
    CTX.stroke()
    CTX.closePath()
    // 绘制曲线
    CTX.beginPath()
    CTX.strokeStyle = '#34495e'
    CTX.setLineDash([])
    CTX.moveTo(150, 50)
    CTX.arcTo(x, y, 200, 300, 30)
    CTX.stroke()
    CTX.closePath()
  }

  function fixCanvas() {
    // 调整Canvas
    CANVAS.style.height = `${CH}px`
    CANVAS.style.width = `${CW}px`
    CANVAS.height = CH * window.devicePixelRatio
    CANVAS.width = CW * window.devicePixelRatio
    CTX.scale(window.devicePixelRatio, window.devicePixelRatio)
    // Canvas基础样式
    CTX.lineWidth = 2
    CTX.font = 'normal 600 12px "Merriweather"'
    CTX.textAlign = 'center'
    CTX.textBaseline = 'middle'
    CTX.lineJoin = 'round'
  }

  function mouseUp() {
    CANVAS.removeEventListener('mousemove', mouseMove)
    CANVAS.removeEventListener('mouseup', mouseUp)
  }

  function mouseOut() {
    CANVAS.removeEventListener('mousemove', mouseMove)
    CANVAS.removeEventListener('mouseout', mouseOut)
  }

  function mouseMove(e: MouseEvent) {
    const [x, y] = getMousePos(CANVAS, e)
    // 清理画布
    CTX.fillStyle = '#f6f8fa'
    CTX.fillRect(0, 0, CW, CH)
    // 绘制arc
    drawArc(x, y)
    drawPoint(x, y, undefined, undefined, '控制点1')
    drawPoint(150, 50, undefined, '#34495e', '基础点')
    drawPoint(200, 300, undefined, undefined, '控制点2')
  }

  function mouseDown() {
    CANVAS.addEventListener('mousemove', mouseMove)
    CANVAS.addEventListener('mouseup', mouseUp)
    CANVAS.addEventListener('mouseout', mouseOut)
  }

  function getMousePos(c: HTMLCanvasElement, e: MouseEvent) {
    const rect = c.getBoundingClientRect()
    return [Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top)]
  }

  function drawPoint(x: number, y: number, r = 4, c = '#27ae60', m = '') {
    // 绘制新的点
    CTX.beginPath()
    CTX.fillStyle = c
    CTX.fillText(`${m}(${x},${y})`, x, y - 15)
    CTX.arc(x, y, r, 0, Math.PI * 2)
    CTX.fill()
    CTX.closePath()
  }

  function initDraw() {
    CTX.fillStyle = '#f6f8fa'
    CTX.fillRect(0, 0, CW, CH)
    drawArc(300, 50)
    drawPoint(300, 50, undefined, undefined, '控制点1')
    drawPoint(150, 50, undefined, '#34495e', '基础点')
    drawPoint(200, 300, undefined, undefined, '控制点2')
  }

  CANVAS.addEventListener('mousedown', mouseDown)
  fixCanvas()
  initDraw()
})
</script>
