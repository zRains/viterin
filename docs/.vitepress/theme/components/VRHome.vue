<template>
  <div class="VRHome">
    <h1 class="title">{{ frontmatter.hero.title }}</h1>
    <h3 class="subTitle">{{ frontmatter.hero.subTitle }}</h3>
    <hr />
    <slot name="test" />
    <template v-for="group in frontmatter.hero.showGroups" :key="group.text">
      <h4 class="showGroups">{{ group.text }}</h4>
      <p>
        <Icon v-for="icon in group.icons" :key="icon" :icon="icon" height="30" width="40" />
      </p>
    </template>

    <h4 class="friends">友链：</h4>
    <VRFriends />
  </div>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../types/theme'
import { useData } from 'vitepress'
import VRFriends from './VRFriends.vue'

const { frontmatter } = useData<VRThemeConfig>()
</script>

<style lang="scss">
@import '../styles/vars.scss';

.VRHome {
  justify-content: center;
  max-width: $max-content-width;
  margin: 0 auto;
  padding: 30px 20px 0 20px;

  hr {
    height: 0;
    margin: 15px 0;
    overflow: hidden;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--c-divider);
  }
}

// 适配移动端
@media only screen and (max-width: $b-md) {
  .VRHome {
    padding: 0 20px 0 20px;
  }
}
</style>
