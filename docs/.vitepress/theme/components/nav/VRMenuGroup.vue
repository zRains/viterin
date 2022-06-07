<template>
  <div class="VRMenuGroup">
    <div v-if="text" class="title">{{ text }}</div>
    <template v-for="item in items">
      <VRMenuLink v-if="'link' in item" :item="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NavItemWithLink } from '../../types/theme'
import VRMenuLink from './VRMenuLink.vue'

defineProps<{
  text?: string
  items: NavItemWithLink[]
}>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRMenuGroup {
  .title {
    padding: 10px 10px 5px 15px;
    font-size: 14px;
    font-weight: 600;
    color: var(--c-text-2);
    transition: color $u-duration ease;
  }
}
</style>
