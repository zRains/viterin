<template>
  <component
    :is="href ? 'a' : 'span'"
    class="VPLink"
    :href="href ? normalizeLink(href) : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { normalizeLink, isExternal } from '../utils/helper'

const props = defineProps<{
  href?: string
}>()

const isExternalLink = computed(() => props.href && isExternal(props.href))
</script>

<style lang="scss">
@import '../styles/vars.scss';

.VPLink {
  color: var(--c-text-1);
  text-decoration: none;
}
</style>
