<template>
  <Content :class="{ VRPage: true, VRMarkdown: true }" />
</template>

<script setup lang="ts">
import useCopy from '../../composables/copy'

useCopy()
</script>

<style lang="scss">
@import '../../styles/markdown.scss';
</style>
