<template>
  <VRPageContainer :class="{ VRPageContainer: true }" />
</template>

<script setup lang="ts">
import VRPageContainer from '../page/VRPageContainer.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRPageContainer {
  padding-left: $sidebar-width + 20px;
  transition: padding-left $u-duration;
}

// 移动端适配
@media only screen and (max-width: calc(#{$max-content-width + $aside-width + $sidebar-width} + 60px)) {
  .VRPageContainer {
    .aside {
      display: none;
    }
  }
}

// 取消侧边栏左边距
@media only screen and (max-width: $b-md) {
  .VRPageContainer {
    padding-left: 20px;
  }
}
</style>
