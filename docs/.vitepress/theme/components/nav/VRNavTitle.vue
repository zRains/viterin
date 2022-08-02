<template>
  <div class="VRNavTitle">
    <a class="title" :href="site.base">
      <img v-if="theme.logo" class="logo" :src="theme.logo || '/favicon.ico'" />
      <template v-if="theme.siteTitle">{{ theme.siteTitle }}</template>
      <template v-else-if="theme.siteTitle === undefined">{{ site.title }}</template>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../../types/theme'
import { useData } from 'vitepress'

const { site, theme } = useData<VRThemeConfig>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavTitle {
  .title {
    display: flex;
    align-items: center;
    height: $nav-height-mobile - 1px;
    font-size: 1rem;
    img {
      height: ($nav-height-mobile - 1px) * 0.65;
      width: ($nav-height-mobile - 1px) * 0.65;
    }
  }

  // 适配移动端
  @media only screen and (min-width: $b-md) {
    .title {
      height: $nav-height-desktop;
      img {
        height: $nav-height-desktop * 0.65;
        width: $nav-height-desktop * 0.65;
      }
    }
  }
}
</style>
