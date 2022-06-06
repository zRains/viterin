<template>
  <div class="VRNavScreen">123124142</div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavScreen {
  position: fixed;
  top: $nav-height-mobile;
  right: 0;
  left: 0;
  padding: 0 24px;
  width: 100%;
  // background-color: var(--c-bg);
  background-color: red;
  overflow-y: auto;
  transition: background-color $u-duration ease;
}
</style>
