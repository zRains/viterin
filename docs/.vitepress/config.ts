import { defineConfigWithTheme } from 'vitepress'
import type { VRThemeConfig } from './theme/types/theme'

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
    nav: [
      { text: 'Post', link: '/post' },
      { text: 'Note', link: '/note' },
      {
        text: 'Wrap',
        items: [
          {
            items: [
              {
                text: 'type_challenge',
                link: '/wrap/type_challenge/index'
              }
            ]
          }
        ]
      },
    ],
    sidebar: {
      '/wrap/type_challenge': [
        {
          text: 'Type Challenge',
          collapsible: false,
          items: [{ text: 'Introduction', link: '/wrap/type_challenge/' }]
        },
        {
          text: 'Easy',
          collapsible: true,
          isCollapsed: true,
          items: [
            { text: 'TC-7 Readonly', link: '/wrap/type_challenge/7_easy_readonly' },
            { text: 'Item B', link: '/item-b' }
          ]
        },
        {
          text: 'Medium',
          collapsible: true,
          items: [
            { text: 'TC-2 Omit', link: '/wrap/type_challenge/2_medium_omit' },
            { text: 'Item D', link: '/item-d' }
          ]
        },
        {
          text: 'Hard',
          items: [
            { text: 'Item C', link: '/item-c' },
            { text: 'Item D', link: '/item-d' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
