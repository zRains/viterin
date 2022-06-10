<template>
  <VRLink :class="{ VRSidebarLink: true, active: isActive(page.relativePath, item.link) }" :href="item.link">
    <span class="link-text">{{ item.text }}</span>
  </VRLink>
</template>

<script setup lang="ts">
import type { SidebarItem } from '../../types/theme'
import { useData } from 'vitepress'
import VRLink from '../VRLink.vue'
import { isActive } from '../../utils/helper'

const { page } = useData()

defineProps<{
  item: SidebarItem
}>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRSidebarLink {
  display: block;
  padding: 4px 0;
  color: var(--c-text-2);
  transition: color $u-duration ease;
  font-size: 0.95em;

  &:hover {
    color: var(--c-text-1);
  }

  &.active {
    color: var(--c-brand);
  }
}
</style>
