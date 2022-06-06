<template>
  <nav v-if="theme.nav" class="VPNavBarMenu">
    <template v-for="item in theme.nav" :key="item.text">
      <VRNavBarMenuLink v-if="'link' in item" :item="item" />
      <!-- <VRNavBarMenuGroup v-else :item="item" /> -->
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { Config } from '../../types/theme'
import { useData } from 'vitepress'
import VRNavBarMenuLink from './VRNavBarMenuLink.vue'
import VRNavBarMenuGroup from './VRNavBarMenuGroup.vue'

const { theme } = useData<Config>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VPNavBarMenu {
  display: flex;
  z-index: $z-index-nav + 4;
}
</style>
