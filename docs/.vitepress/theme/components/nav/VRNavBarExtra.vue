<template>
  <VRPopLayout :class="{ VRNavBarExtra: true }" label="extra navigation">
    <div v-if="site.appearance" class="appearance group">
      <div class="label">Theme</div>
      <VRSwitchAppearance />
    </div>
  </VRPopLayout>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import VRPopLayout from './VRPopLayout.vue'
import VRSwitchAppearance from './VRSwitchAppearance.vue'

const { site } = useData()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRNavBarExtra {
  display: none;
  padding: 0 10px;
  cursor: pointer;

  .appearance {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    
    .label {
      margin-right: auto;
      font-size: 13px;
    }
  }
}

// 移动端适配
@media only screen and (min-width: $b-md) {
  .VRNavBarExtra {
    display: block;
  }
}

@media only screen and (min-width: $b-lg) {
  .VRNavBarExtra {
    display: none;
  }
}
</style>
