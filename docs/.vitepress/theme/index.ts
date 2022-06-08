import { Theme } from 'vitepress'

// Global Components
import { Icon } from '@iconify/vue'
import CenterImg from './components/global/CenterImg.vue'

// Layout
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

// Styles
import './styles/basic.scss'
import './styles/colors.scss'

const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('Icon', Icon)
    app.component('CenterImg', CenterImg)
  }
}

export default theme
