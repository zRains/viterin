<template>
  <div v-if="site.appearance" class="VRNavBarAppearance">
    <VRSwitchAppearance />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import VRSwitchAppearance from './VRSwitchAppearance.vue'

const { site } = useData()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBarAppearance {
  padding-left: 20px;
  margin-left: 10px;
  border-left: 1px solid var(--c-gray);
  display: none;
}

// 移动端适配
@media only screen and (min-width: $b-lg) {
  .VRNavBarAppearance {
    display: block;
  }
}
</style>
