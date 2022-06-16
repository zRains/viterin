<template>
  <section class="VRSidebarGroup" :class="{ collapsible }">
    <div v-if="text" class="groupTitle" :role="collapsible ? 'button' : undefined" :aria-expanded="isCollapsed" @click="toggle">
      <h2 class="title">{{ text }}</h2>
      <Icon class="collapseBtn" :icon="isCollapsed ? 'iconoir:add-square' : 'iconoir:minus-square'" height="18" />
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

console.log(props.collapsible, props.isCollapsed)

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
    align-items: center;
    z-index: 2;
    cursor: pointer;
    transition: color $u-duration ease;

    .title {
      margin: 0;
      padding-top: 6px;
      padding-bottom: 6px;
      line-height: 20px;
      font-size: 1em;
      font-weight: 700;
      color: var(--c-text-1);
    }

    .collapseBtn {
      margin-left: auto;
    }

    // 触发折叠
    &[aria-expanded='true'] {
      & + .items {
        overflow: hidden;
        max-height: 0;
      }
    }
  }

  &:hover {
    .iconify {
      color: var(--c-text-2);
    }
  }
}
</style>
