import { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

// 样式
import './styles/basic.scss'

const theme: Theme = {
  Layout,
  NotFound
}

export default theme
