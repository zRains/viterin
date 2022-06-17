<template>
  <div class="VRHome">
    <h1 class="title">{{ frontmatter.hero.title }}</h1>
    <h3 class="subTitle">{{ frontmatter.hero.subTitle }}</h3>
    <hr />
    <Content :class="{ VRMarkdown: true }" />
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
  max-width: $max-not-toc-content-width;
  margin: 0 auto;
  padding: 30px 20px 20px 20px;

  hr {
    height: 0;
    margin: 15px 0;
    overflow: hidden;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--c-divider);
  }
}

[data-theme='light'] .VRHome {
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

// 适配移动端
@media only screen and (max-width: $b-md) {
  .VRHome {
    padding: 0 20px 20px 20px;
  }
}
</style>
