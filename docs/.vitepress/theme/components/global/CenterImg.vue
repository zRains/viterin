<template>
  <div style="display: flex; justify-content: center; margin-bottom: 16px" :data-source="source">
    <img :style="{ zoom, 'image-rendering': '-webkit-optimize-contrast' }" :src="src" :alt="alt" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: false,
    default: 'image post on zrain.fun'
  },
  source: {
    type: String,
    required: false,
    default: ''
  },
  zoom: {
    type: String,
    required: false,
    default: '100%'
  }
})
</script>
