<template>
  <VRPopLayout :class="{ VRNavBarMenuGroup: true }" :button="item.text" :items="item.items" />
</template>

<script setup lang="ts">
import type { NavItemWithChildren } from '../../types/theme'
import VRPopLayout from './VRPopLayout.vue'

defineProps<{
  item: NavItemWithChildren
}>()
</script>

<style lang="scss">
.VRNavBarMenuGroup {
  padding: 0 10px;
  cursor: pointer;
}
</style>
