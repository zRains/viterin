<template>
  <div class="VRPopLayout" ref="el" @mouseenter="isActivated = true" @mouseleave="isActivated = false">
    <div class="trigger" aria-haspopup="true" :aria-expanded="isActivated" :aria-label="label" @click="isActivated = !isActivated">
      <template v-if="button || icon">
        {{ button }}
        <VRIDropdown :class="{ icon: true, textIcon: true }" />
      </template>
      <VRIMore :class="{ icon: true }" v-else />
    </div>

    <VRMenuPop :items="items" @click="isActivated = !isActivated">
      <slot />
    </VRMenuPop>
  </div>
</template>

<script setup lang="ts">
import type { NavItemChildren, NavItemWithLink } from '../../types/theme'
import { ref } from 'vue'
import VRIMore from '../icon/VRIMore.vue'
import VRIDropdown from '../icon/VRIDropdown.vue'
import VRMenuPop from './VRMenuPop.vue'

defineProps<{
  icon?: any
  button?: string
  label?: string
  items?: (NavItemChildren | NavItemWithLink)[]
}>()

const isActivated = ref(false)
</script>

<style lang="scss">
@use 'sass:math';
@import '../../styles/vars.scss';

$icon-width: 22px;

.VRPopLayout {
  position: relative;

  .trigger {
    height: $nav-height-desktop;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    transition: color $u-duration ease;

    .icon {
      width: $icon-width;
      fill: var(--c-text-1);
      transition: fill $u-duration ease;
      &.textIcon {
        width: $icon-width - 4px;
      }
    }

    &[aria-expanded='true'] {
      color: var(--c-brand);
      .icon {
        fill: var(--c-brand);
      }

      & + .VRMenuPop {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }
  }

  .VRMenuPop {
    position: absolute;
    top: math.div($nav-height-desktop, 2) + 20px;
    right: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity $u-duration, visibility 0.25s, transform $u-duration;
  }
}
</style>
