<template>
  <div class="VRSwitch" @click="isActivated = !isActivated">
    <slot :isActivated="isActivated"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initStatus?: boolean
  onActive?: () => void
  onDisable?: () => void
}>()

const isActivated = ref(typeof props.initStatus === 'undefined' ? false : props.initStatus!)

watch(isActivated, (n) => (n ? props.onActive?.call(null) : props.onDisable?.call(null)))
</script>

<style lang="scss"></style>
