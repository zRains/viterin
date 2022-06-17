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
      { text: 'Wrap', link: '/wrap' },
      { text: 'Note', link: '/note' },
      {
        text: 'Tool',
        items: [
          {
            text: 'web',
            items: [
              {
                text: '渐变色调制',
                link: '...'
              },
              {
                text: 'Ascii',
                link: '...'
              }
            ]
          },
          {
            text: 'fun',
            items: [
              {
                text: 'Game',
                link: '...'
              },
              {
                text: 'Videos',
                link: '...'
              },
              {
                text: 'Song',
                link: '...'
              }
            ]
          },
          { text: 'AA', link: '...' },
          { text: 'BB', link: '...' }
        ]
      }
    ],
    sidebar: {
      '/wrap/type_challenge': [
        {
          text: 'Easy',
          collapsible: true,
          items: [
            { text: 'Item A', link: '/item-a' },
            { text: 'Item B', link: '/item-b' }
          ]
        },
        {
          text: 'Medium',
          collapsible: true,
          isCollapsed: true,
          items: [
            { text: 'Item C', link: '/item-c' },
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
