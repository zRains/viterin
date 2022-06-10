<template>
  <div class="VRSidebar">21313</div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '../../styles/vars.scss';

$content-full-width: $sidebar-width + $max-content-width + $aside-width + 40px;

.VRSidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $z-index-sidebar;
  padding: $nav-height-desktop 20px 80px 20px;
  width: $sidebar-width;
  overflow-y: scroll;
}

// 移动端适配
@media only screen and (min-width: $content-full-width) {
  .VRSidebar {
    padding: $nav-height-desktop 30px 80px calc((100% - #{$content-full-width}) / 2 + 25px);
    width: calc(#{$sidebar-width} + (100% - #{$content-full-width}) / 2);
  }
}
</style>
