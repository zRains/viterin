<template>
  <section class="VRSidebarGroup" :class="{ collapsible }">
    <div v-if="text" class="groupTitle" :role="collapsible ? 'button' : undefined" :aria-expanded="!isCollapsed" @click="toggle">
      <h2 class="title">{{ text }}</h2>
      <Icon class="collapseBtn" v-if="collapsible" :icon="isCollapsed ? 'iconoir:add-square' : 'iconoir:minus-square'" height="18" />
    </div>

    <div class="items">
      <VRSidebarLink v-for="item in items" :key="item.link" :item="item" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SidebarItem } from '../../types/theme'
import { ref } from 'vue'
import VRSidebarLink from './VRSidebarLink.vue'

const props = defineProps<{
  text?: string
  items: SidebarItem[]
  collapsible?: boolean
  isCollapsed?: boolean
}>()

const isCollapsed = ref(props.collapsible && props.isCollapsed)

function toggle() {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRSidebarGroup {
  .groupTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    cursor: pointer;
    background-color: var(--c-bg);
    transition: color $u-duration ease, background-color $u-duration ease;

    .title {
      margin: 0;
      padding-top: 6px;
      padding-bottom: 6px;
      line-height: 20px;
      font-size: 1em;
      font-weight: 700;
      color: var(--c-text-1);
    }
  }

  &.collapsible {
    .groupTitle {
      // 触发展开
      &[aria-expanded='true'] + .items {
        transform: translateY(0);
        opacity: 1;
        max-height: unset;
      }
    }

    .items {
      transform: translateY(-10%);
      opacity: 0;
      overflow: hidden;
      max-height: 0;
      transition: transform $u-duration ease, opacity $u-duration ease;
      transition-delay: 0.08s;
    }
  }

  &:hover {
    .iconify {
      color: var(--c-text-2);
    }
  }
}
</style>
