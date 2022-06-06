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
      { text: 'Note', link: '/note' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
