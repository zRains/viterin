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
      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     {
      //       // Title for the section.
      //       text: 'Section A Title',
      //       items: [
      //         { text: 'Section A Item A', link: '...' },
      //         { text: 'Section B Item B', link: '...' }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     {
      //       // You may also omit the title.
      //       items: [
      //         { text: 'Section A Item A', link: '...' },
      //         { text: 'Section B Item B', link: '...' }
      //       ]
      //     }
      //   ]
      // }
      {
        text: 'Tool',
        items: [
          { text: 'Graduators', link: '/tools/graduators' },
          { text: 'ASCII', link: '/tools/ASCII' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
