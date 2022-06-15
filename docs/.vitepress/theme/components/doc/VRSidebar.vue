<template>
  <aside v-if="hasSidebar" :class="{ VRSidebar: true, isOpen }">
    <nav class="VRSidebarNav">
      <div v-for="group in sidebar" :key="group.text" class="group">
        <VRSidebarGroup :text="group.text" :items="group.items" :collapsible="group.collapsible" :collapsed="group.collapsed" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import useSidebar from '../../composables/sidebar'
import VRSidebarGroup from './VRSidebarGroup.vue'

const { sidebar, hasSidebar } = useSidebar()

defineProps<{
  isOpen: boolean
}>()
</script>

<style lang="scss">
@import '../../styles/vars.scss';

$content-full-width: $sidebar-width + $max-content-width + $aside-width + 60px;

.VRSidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $z-index-sidebar;
  padding: $nav-height-desktop 20px 80px 20px;
  width: $sidebar-width;
  overflow-y: scroll;

  .VRSidebarNav {
    .group {
      padding: 10px 0;

      &:not(:first-child) {
        transition: border-color $u-duration ease;
        border-top: 1px solid var(--c-divider-light);
      }
    }
  }
}

// 移动端适配
@media only screen and (min-width: $content-full-width) {
  .VRSidebar {
    padding: $nav-height-desktop 30px 80px calc((100% - #{$content-full-width}) / 2 + 10px);
    width: calc(#{$sidebar-width} + (100% - #{$content-full-width}) / 2);
  }
}
</style>
