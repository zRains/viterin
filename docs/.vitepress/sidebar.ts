import files from './fileData.json'

const wrapFiles = files.filter((file) => file.link.startsWith('/wrap/'))
const fileFilter = (f: (file: any) => boolean) =>
  wrapFiles
    .filter(f)
    .sort((a, b) => a.order! - b.order!)
    .map((file) => ({
      text: file.title,
      link: file.link
    }))

export default function () {
  return {
    '/wrap/type_challenge': [
      {
        text: 'Type Challenge',
        collapsible: false,
        items: [{ text: 'Introduction', link: '/wrap/type_challenge/' }]
      },
      ...['Easy', 'Medium'].map((difficulty) => ({
        text: difficulty,
        collapsible: true,
        items: fileFilter((file) => file.link.startsWith('/wrap/type_challenge/') && file.difficulty === difficulty.toLocaleLowerCase())
      }))
    ],
    '/wrap/sword_to_offer': [
      {
        text: '剑指offer',
        collapsible: false,
        items: [{ text: '介绍', link: '/wrap/sword_to_offer/' }]
      },
      ...['目录'].map((section) => ({
        text: section,
        collapsible: true,
        items: fileFilter((file) => file.link.startsWith('/wrap/sword_to_offer/'))
      }))
    ],
    '/wrap/code_snippet': [
      {
        text: '代码片段仓库',
        collapsible: false,
        items: [{ text: '介绍', link: '/wrap/code_snippet/' }]
      },
      ...['目录'].map((section) => ({
        text: section,
        collapsible: true,
        items: fileFilter((file) => file.link.startsWith('/wrap/code_snippet/'))
      }))
    ]
  }
}
