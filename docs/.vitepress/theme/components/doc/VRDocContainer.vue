<template>
  <VRPageContainer :class="{ VRDocContainer: true }" />
</template>

<script setup lang="ts">
import VRPageContainer from '../page/VRPageContainer.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRDocContainer {
  padding-left: $sidebar-width + 20px;
  transition: padding-left $u-duration * 1.5;
}

// 移动端适配
@media only screen and (max-width: calc(#{$max-content-width + $aside-width + $sidebar-width} + 80px)) {
  .VRDocContainer {
    .aside {
      display: none;
    }
  }
}

// 取消侧边栏左边距
@media only screen and (max-width: $b-md) {
  .VRDocContainer {
    padding-left: 20px;
  }
}
</style>
