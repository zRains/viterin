<template>
  <div class="VRSwitch" @click="isActivated = !isActivated">
    <slot :isActivated="isActivated"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  onActive?: () => void
  onDisable?: () => void
}>()

const isActivated = ref(false)

watch(isActivated, (n) => (n ? props.onActive?.call(null) : props.onDisable?.call(null)))
</script>

<style lang="scss"></style>
