import { Theme } from 'vitepress'
import { Icon } from '@iconify/vue'

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
  }
}

export default theme
