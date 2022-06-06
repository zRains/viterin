<template>
  <div class="VRMenuPop">
    <div v-if="items" class="items">
      <template v-for="item in items" :key="item.text">
        <VPMenuLink v-if="'link' in item" :item="item" />
        <!-- <VPMenuGroup v-else :text="item.text" :items="item.items" /> -->
      </template>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { NavItemChildren } from '../../types/theme'

defineProps<{
  items?: NavItemChildren[]
}>()
</script>

<style lang="scss">
.VRMenuPop {
  min-width: 130px;
  border: 1px solid var(--c-divider-light);

  .group {
    padding: 10px;
  }
}
</style>
