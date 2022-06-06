<template>
  <div class="VRMenuLink">
    <VRLink :href="item.link">{{ item.text }}</VRLink>
  </div>
</template>

<script setup lang="ts">
import type { NavItemWithLink } from '../../types/theme'
import VRLink from '../VRLink.vue'

defineProps<{
  item: NavItemWithLink
}>()
</script>

<style lang="scss">
.VRMenuLink {
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: var(--c-bg-mute);

    .VRLink {
      color: var(--c-brand);
    }
  }
}
</style>
