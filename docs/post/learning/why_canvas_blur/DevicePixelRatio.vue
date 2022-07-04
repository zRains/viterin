<template>
  <ClientOnly>{{ devicePixelRatio }}</ClientOnly>
</template>

<script setup lang="ts">
const devicePixelRatio = window.devicePixelRatio || 1
</script>
