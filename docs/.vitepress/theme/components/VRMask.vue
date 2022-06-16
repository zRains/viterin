<template>
  <transition name="fade">
    <div v-if="isShow" class="VRMask" />
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  isShow: boolean
}>()
</script>

<style lang="scss">
@import '../styles/vars.scss';

.VRMask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-index-mask;
  background: rgba(0, 0, 0, 0.6);
  transition: opacity $u-duration ease;

  &.fade-enter-from,
  &.fade-leave-to {
    opacity: 0;
  }
  &.fade-leave-active {
    transition-duration: 0.25s;
  }
}

// 移动端适配
@media only screen and (min-width: $b-xl) {
  .VRMask {
    display: none;
  }
}
</style>
