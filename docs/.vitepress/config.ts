import type { VRThemeConfig } from 'vitepress-theme-viterin'
import { defineConfigWithTheme } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'
import markdownItKatex from 'markdown-it-katex'

const customElements = [
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml'
]

export default defineConfigWithTheme<VRThemeConfig>({
  lang: 'zh-CN',
  title: 'zRain',
  description: 'Just playing around.',
  lastUpdated: true,

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config: (md) => {
      md.use(markdownItKatex, { throwOnError: false, errorColor: ' #cc0000' })
    }
  },

  themeConfig: {
    siteTitle: false,
    logo: '/favicon.ico',
    nav: nav(),
    sidebar: sidebar(),
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
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag)
      }
    }
  }
})
