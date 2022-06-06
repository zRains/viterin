<template>
  <div class="VRMenuPop">
    <template v-if="items">
      <template v-for="item in items" :key="item.text">
        <VRMenuLink :class="{ group: true }" v-if="'link' in item" :item="item" />
        <VRMenuGroup :class="{ group: true }" v-else :text="item.text" :items="item.items" />
      </template>
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { NavItemChildren, NavItemWithLink } from '../../types/theme'
import VRMenuLink from './VRMenuLink.vue'
import VRMenuGroup from './VRMenuGroup.vue'

defineProps<{
  items?: (NavItemChildren | NavItemWithLink)[]
}>()
</script>

<style lang="scss">
.VRMenuPop {
  min-width: 130px;
  border: 1px solid var(--c-divider-light);
  background-color: var(--c-bg);

  .group:not(:first-child) {
    border-top: 1px solid var(--c-divider-light);
  }
}
</style>
