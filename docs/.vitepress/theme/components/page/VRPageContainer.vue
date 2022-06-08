<template>
  <div class="VRPageContainer">
    <!-- 文章主要内容 -->
    <div class="content">
      <VRPage />
      <VRPageFooter />
    </div>

    <!-- 侧边栏 -->
    <div class="aside">
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
import VRPageAside from '../page/VRPageAside.vue'
import VRPage from '../page/VRPage.vue'
import VRPageFooter from '../page/VRPageFooter.vue'
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRPageContainer {
  display: flex;
  padding: 32px 24px 96px;
  width: 100%;

  .content {
    width: 100%;
    max-width: $max-content-width;
    order: 2;
  }

  .aside {
    width: $aside-width;
    margin-left: 20px;
  }
}
</style>
