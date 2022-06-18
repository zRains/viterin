export default {
  '/wrap/type_challenge': [
    {
      text: 'Type Challenge',
      collapsible: false,
      items: [{ text: 'Introduction', link: '/wrap/type_challenge/' }]
    },
    {
      text: 'Easy',
      collapsible: true,
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
}
