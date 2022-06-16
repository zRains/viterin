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
    <VRContent>
      <!-- <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>

      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-ads-before><slot name="aside-ads-before" /></template>
      <template #aside-ads-after><slot name="aside-ads-after" /></template> -->
    </VRContent>

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
