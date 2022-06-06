<template>
  <div class="VRPop" ref="el" @mouseenter="isActivated = true" @mouseleave="isActivated = false">
    <div class="trigger" aria-haspopup="true" :aria-expanded="isActivated" :aria-label="label" @click="isActivated = !isActivated">
      <span v-if="button || icon" class="text">
        <component v-if="icon" :is="icon" class="option-icon" />
        {{ button }}
        <VRIDropdown />
      </span>

      <VRIMore v-else />
    </div>

    <!-- <div class="menu">
      <VPMenu :items="items">
        <slot />
      </VPMenu>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VRIMore from '../icon/VRIMore.vue'
import VRIDropdown from '../icon/VRIDropdown.vue'

defineProps<{
  icon?: any
  button?: string
  label?: string
  items?: any[]
}>()

const isActivated = ref(false)
</script>

<style lang="scss">
.VPFlyout {
  position: relative;

  &:hover {
    color: var(--vp-c-bland);
    transition: color 0.2s ease;
  }
}
</style>
