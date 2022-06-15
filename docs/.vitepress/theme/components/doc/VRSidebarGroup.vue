<template>
  <section class="VRSidebarGroup" :class="{ collapsible, collapsed }">
    <div v-if="text" class="groupTitle" :role="collapsible ? 'button' : undefined" @click="toggle">
      <h2 class="title">{{ text }}</h2>
      <Icon class="expend" icon="iconoir:add-square" height="18" />
      <Icon class="collapsed" icon="iconoir:minus-square" height="18" />
    </div>

    <div class="items">
      <template v-for="item in items" :key="item.link">
        <VRSidebarLink :item="item" />
      </template>
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
  collapsed?: boolean
}>()

const collapsed = ref(props.collapsible && props.collapsed)

function toggle() {
  if (props.collapsible) {
    collapsed.value = !collapsed.value
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
      color: var(--vp-c-text-1);
    }

    .iconify {
      margin-left: auto;

      &.collapsed {
        display: none;
      }
    }
  }

  &.collapsed {
    .groupTitle .iconify.expend {
      display: block;
    }

    .groupTitle .iconify.collapsed {
      display: none;
    }
  }

  &:hover {
    .iconify {
      color: var(--c-text-2);
    }
  }
}
</style>
