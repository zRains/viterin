import { defineConfigWithTheme } from 'vitepress'
import type { VRThemeConfig } from './theme/types/theme'
import nav from './nav'
import sidebar from './sidebar'

export default defineConfigWithTheme<VRThemeConfig>({
  lang: 'zh-CN',
  title: 'zRain',
  description: 'Just playing around.',
  lastUpdated: true,

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  themeConfig: {
    siteTitle: false,
    logo: 'https://zrain.fun/images/avatar.png',
    nav,
    sidebar,
    friendLinks: [
      {
        name: 'deelter',
        avatar: 'https://www.deelter.com/images/logo.png',
        link: 'https://www.deelter.com',
        desc: '这个人很懒，什么也没留下...'
      },
      {
        name: 'fzs',
        avatar: 'http://www.zlight.club/img/weblog.74d55116.jpg',
        link: 'http://www.zlight.club/',
        desc: 'Nothing...'
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'CC-BY-NC-SA-4.0 @zrain'
    }
  }
})
