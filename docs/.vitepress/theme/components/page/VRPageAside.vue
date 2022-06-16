<template>
  <div class="VRPageAside">
    <slot name="aside-top" />

    <slot name="aside-toc-before" />
    <VRPageToc v-if="page.headers.length" />
    <slot name="aside-toc-after" />

    <div class="spacer" />

    <slot name="aside-ads-before" />
    <!-- None -->
    <slot name="aside-ads-after" />

    <slot name="aside-bottom" />
  </div>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../../types/theme'
import { useData } from 'vitepress'
import VRPageToc from './VRPageToc.vue'

const { page } = useData<VRThemeConfig>()
</script>

<style lang="scss"></style>
