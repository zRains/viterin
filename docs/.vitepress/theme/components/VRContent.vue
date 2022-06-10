<template>
  <div class="VRContent">
    <NotFound v-if="route.component === NotFound" />

    <VRPageContainer v-else-if="frontmatter.layout === 'page'" />

    <VRHome v-else-if="frontmatter.layout === 'home'">
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>
    </VRHome>

    <VRDocContainer v-else />
  </div>
</template>

<script setup lang="ts">
import type { Config } from '../types/theme'
import { useData, useRoute } from 'vitepress'
import NotFound from '../NotFound.vue'
import VRPageContainer from './page/VRPageContainer.vue'
import VRHome from './VRHome.vue'
import VRDocContainer from './doc/VRDocContainer.vue'

const { frontmatter } = useData<Config>()
const route = useRoute()
</script>

<style lang="scss"></style>
