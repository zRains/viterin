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
      <VRSwitchAppearance />
    </div>
  </div>
</template>

<script setup lang="ts">
import VRNavTitle from './VRNavTitle.vue'
import VRUtils from './VRUtils.vue'
import VRNavBarMenu from './VRNavBarMenu.vue'
import VRSwitchAppearance from './VRSwitchAppearance.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBar {
  position: relative;
  display: flex;
  padding: 0 24px;
  height: $nav-height-mobile;
  border-bottom: 1px solid var(--c-divider-light);

  .VRNavContent {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
}

// 适配移动端
@media only screen and (min-width: $b-md) {
  .VRNavBar {
    height: $nav-height-desktop;
    border-bottom: none;
  }
}
</style>
