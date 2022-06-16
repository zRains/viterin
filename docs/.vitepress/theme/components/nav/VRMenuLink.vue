<template>
  <div class="VRMenuLink">
    <VRLink :href="item.link" :class="{ isActive: isActive(page.relativePath, item.activeMatch || item.link) }">{{ item.text }}</VRLink>
  </div>
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
</script>

<style lang="scss">
.VRMenuLink {
  padding: 12px 15px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;

  &:hover,
  &.isActive {
    background-color: var(--c-bg-mute);

    .VRLink {
      color: var(--c-brand);
    }
  }
}
</style>
