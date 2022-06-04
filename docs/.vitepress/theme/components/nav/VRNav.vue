<template>
  <header class="VPNav">
    <!-- PC端Nav展示 -->
    <VRNavBar />
    <!-- 移动端Nav展示 -->
    <VRNavScreen />
  </header>
</template>

<script setup lang="ts">
import VRNavBar from './VRNavBar.vue'
import VRNavScreen from './VRNavScreen.vue'
</script>

<style lang="scss"></style>
