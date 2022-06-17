<template>
  <div class="VRPageContainer">
    <!-- 文章主要内容 -->
    <div class="content">
      <VRPage />
      <VRPageFooter />
    </div>

    <!-- 侧边栏 -->
    <div class="aside" v-if="page.frontmatter.toc === undefined ? true : false">
      <VRPageAside>
        <template #aside-top><slot name="aside-top" /></template>
        <template #aside-bottom><slot name="aside-bottom" /></template>
        <template #aside-toc-before><slot name="aside-toc-before" /></template>
        <template #aside-toc-after><slot name="aside-toc-after" /></template>
        <template #aside-ads-before><slot name="aside-ads-before" /></template>
        <template #aside-ads-after><slot name="aside-ads-after" /></template>
      </VRPageAside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../../types/theme'
import VRPageAside from '../page/VRPageAside.vue'
import VRPage from '../page/VRPage.vue'
import VRPageFooter from '../page/VRPageFooter.vue'
import { useData } from 'vitepress'

const { page } = useData<VRThemeConfig>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRPageContainer {
  display: flex;
  justify-content: center;
  padding: 20px 15px 0 15px;
  width: 100%;

  .content {
    width: 100%;
    max-width: $max-content-width;
    padding-bottom: 80px;
  }

  .aside {
    flex-shrink: 0;
    width: $aside-width;
    margin-left: 20px;
  }
}

// 移动端适配
@media only screen and (min-width: $b-sm) {
  .VRPageContainer {
    padding: 30px 20px 0 20px;
  }
}

@media only screen and (max-width: calc(#{$max-content-width + $aside-width} + 60px)) {
  .VRPageContainer .aside {
    display: none;
  }
}
</style>
