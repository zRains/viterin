<template>
  <VRLink
    :class="{ VRNavBarMenuLink: true, isActive: isActive(page.relativePath, item.activeMatch || item.link, !!item.activeMatch) }"
    :href="item.link"
    ><span>{{ item.text }}</span></VRLink
  >
</template>

<script setup lang="ts">
import type { NavItemWithLink, VRThemeConfig } from '../../types/theme'
import { useData } from 'vitepress'
import { isActive } from '../../utils/helper'
import VRLink from '../VRLink.vue'

defineProps<{
  item: NavItemWithLink
}>()

const { page } = useData<VRThemeConfig>()

// console.log(page)
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBarMenuLink {
  display: block;
  padding: 0 12px;
  user-select: none;

  span {
    line-height: $nav-height-mobile - 1px;
    font-weight: 600;
    font-size: 14px;
    border-width: 2.5px 0 2.5px 0;
    border-style: solid;
    border-color: transparent;
    transition-property: color, border-bottom-color;
    transition-duration: $u-duration;
  }

  &:hover,
  &.isActive {
    span {
      color: var(--c-brand);
      border-bottom-color: var(--c-brand);
    }
  }
}

// 移动端适配
@media only screen and (min-width: $b-md) {
  .VRNavBarMenuLink {
    line-height: $nav-height-desktop;
  }
}
</style>
