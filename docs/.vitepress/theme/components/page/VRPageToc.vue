<template>
  <div class="VRPageToc">Table of Content</div>
</template>

<script setup lang="ts">
import type { Config } from '../../types/theme'
import { ref, computed } from 'vue'
import { useData, useRouter } from 'vitepress'

const route = useRouter()
console.log(route)
</script>

<style lang="scss"></style>
