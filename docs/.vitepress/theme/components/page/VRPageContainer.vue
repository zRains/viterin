<template>
  <div class="VRPageContainer">
    <!-- 文章主要内容 -->
    <div :class="{ content: true, notToc: frontmatter.toc !== undefined && frontmatter.toc === false }">
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

const { page, frontmatter } = useData<VRThemeConfig>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRPageContainer {
  display: flex;
  justify-content: center;
  padding: 0 15px 0 15px;
  width: 100%;

  .content {
    width: 100%;
    max-width: $max-content-width;
    padding-bottom: 80px;

    &.notToc {
      max-width: $max-not-toc-content-width;
    }
  }

  .aside {
    flex-shrink: 0;
    width: $aside-width;
    margin-left: 50px;
  }
}

[data-theme='light'] .VRPageContainer .content {
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(201, 195, 195, 0.329) 25%,
      hsla(0deg, 8%, 80.4%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0deg, 5.2%, 81%, 0.185) 75%,
      rgba(180, 176, 176, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(204, 196, 196, 0.226) 25%,
      hsla(0deg, 4%, 66.1%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0deg, 5.2%, 81%, 0.185) 75%,
      rgba(180, 176, 176, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-size: 50px 50px;
}

// 移动端适配
@media only screen and (min-width: $b-md) {
  .VRPageContainer {
    padding: 40px 20px 0 20px;
  }
}

@media only screen and (max-width: calc(#{$max-content-width + $aside-width} + 60px)) {
  .VRPageContainer .aside {
    display: none;
  }
}
</style>
