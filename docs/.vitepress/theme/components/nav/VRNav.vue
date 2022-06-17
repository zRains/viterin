<template>
  <header class="VRNav">
    <!-- PC端Nav展示 -->
    <VRNavBar />
    <!-- 移动端Nav展示 -->
    <!-- <VRNavScreen :open="isScreenOpen" /> -->
  </header>
</template>

<script setup lang="ts">
import VRNavBar from './VRNavBar.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNav {
  position: relative;
  top: 0;
  left: 0;
  z-index: $z-index-nav;
  width: 100%;
}

// 固定导航栏
@media only screen and (min-width: $b-md) {
  .VRNav {
    position: fixed;
  }
}
</style>
