<template>
  <div class="Layout">
    <!-- 导航栏 -->
    <VRNav />
    <!-- 功能栏 -->
    <VRToolNav />
    <!-- 侧边栏 -->
    <VRSidebar />
    <!-- 遮罩层 -->
    <VRMask :is-show="isOpen" @click="close" />
    <!-- 主体内容 -->
    <VRContent />
    <!-- 页脚 -->
    <VRFooter />
  </div>
</template>

<script setup lang="ts">
import VRContent from './components/VRContent.vue'
import VRFooter from './components/VRFooter.vue'
import VRNav from './components/nav/VRNav.vue'
import VRSidebar from './components/doc/VRSidebar.vue'
import VRMask from './components/VRMask.vue'
import VRToolNav from './components/nav/VRToolNav.vue'
import useSidebar from './composables/sidebar'

const { isOpen, close } = useSidebar()
</script>

<style lang="scss">
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
