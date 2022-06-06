// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPSwitchAppearance.vue

const APPEARANCE_KEY = 'VR_APPEARANCE_KEY'
const query = window.matchMedia('(prefers-color-scheme: dark)')
let isDark = false

function setDark(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export default function () {
  let userPreference = localStorage?.getItem(APPEARANCE_KEY) || 'auto'
  isDark = userPreference === 'auto' ? query.matches : userPreference === 'dark'

  query.onchange = (e) => {
    if (userPreference === 'auto') {
      setDark((isDark = e.matches))
    }
  }

  function toggle() {
    setDark((isDark = !isDark))
    userPreference = isDark ? (query.matches ? 'auto' : 'dark') : query.matches ? 'light' : 'auto'
    localStorage.setItem(APPEARANCE_KEY, userPreference)
  }

  setDark(isDark)

  return { toggle: typeof localStorage !== 'undefined' ? toggle : () => {}, isDark }
}
