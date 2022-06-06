<template>
  <VRSwitch :class="{ VRSwitchAppearance: true }" :on-toggle="toggle" :init-status="isDark">
    <template #default="{ status }"><div :class="{ toggle: true, isActivated: status }"></div></template>
  </VRSwitch>
</template>

<script setup lang="ts">
import VRSwitch from '../VRSwitch.vue'
import useAppearance from '../../composables/appearance'

const { toggle, isDark } = useAppearance()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

$appearance-width: 20px;

.VRSwitchAppearance {
  .toggle {
    box-sizing: content-box;
    position: relative;
    height: $appearance-width;
    width: $appearance-width * 2;
    border-radius: 25px;
    background-color: var(--c-bg-mute);
    border: 1.2px solid var(--c-divider-light);
    transition: background-color $u-duration ease-in-out, border-color $u-duration ease-in-out;
    cursor: pointer;

    &:hover {
      border-color: var(--c-divider);
    }

    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      bottom: 1px;
      height: $appearance-width - 2px;
      width: $appearance-width - 2px;
      border-radius: 50%;
      background-color: var(--c-bg);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='-2 -1.5 24 24'%3E%3Cpath fill='%23fbc02d' d='M10 15.565a5 5 0 1 1 0-10a5 5 0 0 1 0 10zm0-15a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm-9-7h2a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zm.071-6.071a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM5.757 14.808a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM4.343 3.494l1.414 1.414a1 1 0 0 1-1.414 1.414L2.93 4.908a1 1 0 0 1 1.414-1.414zm11.314 11.314l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 1 1 1.414-1.414z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 85%;
      background-position: center center;
      opacity: 1;
      transition: left $u-duration ease, background-color $u-duration ease, opacity $u-duration ease;
    }

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      bottom: 1px;
      height: $appearance-width - 2px;
      width: $appearance-width - 2px;
      border-radius: 50%;
      background-color: var(--c-bg);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 36 36'%3E%3Cpath fill='%23fbc02d' d='M29.2 26.72a12.07 12.07 0 0 1-6.3-22.28A13.68 13.68 0 0 0 19.49 4a14 14 0 0 0 0 28a13.82 13.82 0 0 0 10.9-5.34a11.71 11.71 0 0 1-1.19.06Z' class='clr-i-solid clr-i-solid-path-1'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 85%;
      background-position: center center;
      opacity: 0;
      transition: left $u-duration ease, background-color $u-duration ease, opacity $u-duration ease;
    }

    &.isActivated::before,
    &.isActivated::after {
      left: 21px;
    }

    .isActivated::before {
      opacity: 0;
    }

    &.isActivated::after {
      opacity: 1;
    }
  }
}
</style>
