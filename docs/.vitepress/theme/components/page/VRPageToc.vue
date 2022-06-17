<template>
  <div class="VRPageToc">
    <div class="title">页面目录</div>
    <ul>
      <li v-for="header in headers" :key="header.slug" :style="{ '--header-level': header.level }">
        <VRLink :class="{ tocLink: true }" :href="page.relativePath + '#' + header.slug">{{ header.title }}</VRLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../../types/theme'
import { computed } from 'vue'
import { useData } from 'vitepress'
import VRLink from '../VRLink.vue'

const { page } = useData<VRThemeConfig>()

const headers = computed(() => {
  const minHeaderLevel = Math.min(...page.value.headers.map((h) => h.level))

  return page.value.headers.map((h) => Object.assign({}, h, { level: h.level - minHeaderLevel }))
})
console.log(page.value)
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRPageToc {
  font-size: 15px;

  .title {
    font-weight: 600;
  }

  ul {
    margin: 20px 0 0 0;
    padding: 0;

    li {
      padding: 5px 0;
      list-style: none;
      padding-left: calc(var(--header-level) * 15px);

      .tocLink {
        color: var(--c-text-1);
        transition: color $u-duration ease;

        &:hover{
           color: var(--c-brand);
           text-decoration: underline;
           text-underline-offset: 1px;
        }
      }
    }
  }
}
</style>
