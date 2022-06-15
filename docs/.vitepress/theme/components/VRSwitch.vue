<template>
  <div class="VRSwitch" @click="onToggle">
    <slot :status="initStatus"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  initStatus: boolean
  onToggle: () => void
}>()
</script>

<style lang="scss"></style>
