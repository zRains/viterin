// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPSwitchAppearance.vue
import { ref } from 'vue'

const APPEARANCE_KEY = 'VR_APPEARANCE_KEY'
let isDark = ref(false)

function setDark(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export default function () {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  let userPreference = localStorage?.getItem(APPEARANCE_KEY) || 'auto'
  isDark.value = userPreference === 'auto' ? query.matches : userPreference === 'dark'

  query.onchange = (e) => {
    if (userPreference === 'auto') {
      isDark.value = e.matches
      setDark(isDark.value)
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    setDark(isDark.value)
    userPreference = isDark.value ? (query.matches ? 'auto' : 'dark') : query.matches ? 'light' : 'auto'
    localStorage.setItem(APPEARANCE_KEY, userPreference)
  }

  setDark(isDark.value)

  return { toggle: typeof localStorage !== 'undefined' ? toggle : () => {}, isDark }
}
