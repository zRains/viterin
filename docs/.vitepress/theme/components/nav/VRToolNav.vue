<template>
    <div class="VRToolNav">
      <div class="menuBtn operationBtn" @click="toggle">
        <Icon icon="heroicons-solid:menu-alt-3" height="20" width="20" /><span>Menu</span>
      </div>
      <div class="backToTopBtn operationBtn" @click="scrollToTop"><span>Return to top</span></div>
    </div>
</template>

<script setup lang="ts">
import useSidebar from '../../composables/sidebar'

const { toggle } = useSidebar()

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>

<style lang="scss">
@import '../../styles/vars.scss';

.VRToolNav {
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  padding: 0 20px;
  user-select: none;
  height: $tool-nav-height;
  z-index: $z-index-tool-nav;
  background-color: var(--c-bg);
  border-bottom: 1px solid var(--c-divider-light);
  transform: translateY(-100%);
  opacity: 0;
  transition: background-color $u-duration ease, opacity $u-duration ease, transform $u-duration ease;

  .operationBtn {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: var(--c-text-2);
    transition: color $u-duration ease;
    cursor: pointer;

    .iconify {
      margin-right: 5px;
    }

    &:hover {
      color: var(--c-text-1);
    }
  }
}

// 移动端适配
@media only screen and (max-width: $b-md) {
  .VRToolNav {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
