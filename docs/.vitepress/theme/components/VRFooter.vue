<template>
  <footer v-if="theme.footer && frontmatter.layout === 'home'" class="VRFooter">
    <div class="container">
      <p class="message">{{ theme.footer.message }}</p>
      <p class="copyright">{{ theme.footer.copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { VRThemeConfig } from '../types/theme'
import { useData } from 'vitepress'

const { theme, frontmatter } = useData<VRThemeConfig>()
</script>

<style lang="scss">
@import '../styles/vars.scss';

.VRFooter {
  .container {
    margin: 0 auto;
    padding: 0 20px;
    max-width: $max-not-toc-content-width;

    .message,
    .copyright {
      font-size: 0.9em;
      color: var(--c-text-2);
    }
  }
}
</style>
