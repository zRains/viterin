<template>
  <div class="VRNavBar">
    <!-- 标题部分，重要！移动端不消失 -->
    <VRNavTitle />
    <div class="VRNavContent">
      <!-- 杂项部分 -->
      <VRUtils />
      <!-- 链接部分 -->
      <VRNavBarMenu />
      <!-- 暗/亮切换 -->
      <VRNavBarAppearance />
      <!-- 额外空间 -->
      <VRNavBarExtra />
      <!-- 汉堡 -->
      <VRNavBarHamburger />
    </div>
  </div>
</template>

<script setup lang="ts">
import VRNavTitle from './VRNavTitle.vue'
import VRUtils from './VRUtils.vue'
import VRNavBarMenu from './VRNavBarMenu.vue'
import VRNavBarAppearance from './VRNavBarAppearance.vue'
import VRNavBarExtra from './VRNavBarExtra.vue'
import VRNavBarHamburger from './VRNavBarHamburger.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBar {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 0 10px 0 24px;
  height: $nav-height-mobile;
  background-color: var(--c-bg);
  border-bottom: 1px solid var(--c-divider-light);
  box-shadow: none;
  transition: background-color $u-duration ease;

  .VRNavContent {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
}

// 适配移动端
@media only screen and (min-width: $b-md) {
  .VRNavBar {
    position: fixed;
    padding: 0 24px;
    height: $nav-height-desktop;
    border-bottom: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  }
}
</style>
