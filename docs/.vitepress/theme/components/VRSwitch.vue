<template>
  <div class="VRSwitch" @click="onToggle">
    <slot :status="initStatus"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initStatus: boolean
  onToggle: () => void
}>()
</script>

<style lang="scss"></style>
