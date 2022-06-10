import type { Config } from '../types/theme'
import { ref, computed } from 'vue'
import { getSidebar } from '../utils/helper'
import { useRoute, useData } from 'vitepress'

const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value ? close() : open()
}

export default function () {
  const route = useRoute()
  const { theme, frontmatter } = useData<Config>()
  const sidebar = computed(() => {
    const sidebarConfig = theme.value.sidebar
    const relativePath = route.data.relativePath

    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []
  })
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0
  })

  return {
    isOpen,
    sidebar,
    hasSidebar,
    open,
    close,
    toggle
  }
}
