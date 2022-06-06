// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/composables/nav.ts

import { ref } from 'vue'

export const isScreenOpen = ref(false)

export function openScreen() {
  isScreenOpen.value = true
  window.addEventListener('resize', closeScreenOnTabletWindow)
}

export function closeScreen() {
  isScreenOpen.value = false
  window.removeEventListener('resize', closeScreenOnTabletWindow)
}

export function toggleScreen() {
  isScreenOpen.value ? closeScreen() : openScreen()
}

/**
 * Close screen when the user resizes the window wider than tablet size.
 */
function closeScreenOnTabletWindow() {
  window.outerWidth >= 768 && closeScreen()
}
