import files from './fileData.json'

const wrapFiles = files.filter((file) => file.link.startsWith('/wrap/'))

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
        items: wrapFiles
          .filter((file) => file.link.startsWith('/wrap/type_challenge/') && file.difficulty === difficulty.toLocaleLowerCase())
          .sort((a, b) => a.order! - b.order!)
          .map((file) => ({
            text: file.title,
            link: file.link
          }))
      }))
    ],
    '/wrap/sword_to_offer': [
      {
        text: '剑指offer',
        collapsible: false,
        items: [{ text: '介绍', link: '/wrap/sword_to_offer/' }]
      },
      ...['题目集'].map((section) => ({
        text: section,
        collapsible: true,
        items: wrapFiles
          .filter((file) => file.link.startsWith('/wrap/sword_to_offer/'))
          .sort((a, b) => a.order! - b.order!)
          .map((file) => ({
            text: file.title,
            link: file.link
          }))
      }))
    ]
  }
}
