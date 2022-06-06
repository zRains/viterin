import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'zRain',
  description: 'Just playing around.',
  lastUpdated: true,

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    siteTitle: false,
    logo: 'https://zrain.fun/images/avatar.png',
    nav: [
      { text: 'Home', link: '/home' },
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
