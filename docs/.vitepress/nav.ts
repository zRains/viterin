export default function () {
  return [
    { text: 'Post', link: '/post/' },
    { text: 'Note', link: '/note/' },
    {
      text: 'Wrap',
      items: [
        {
          items: [
            {
              text: 'TS体操',
              link: '/wrap/type_challenge/index'
            },
            {
              text: '剑指offer',
              link: '/wrap/sword_to_offer/index'
            },
            {
              text: '代码片段仓库',
              link: '/wrap/code_snippet/index'
            }
          ]
        }
      ]
    }
  ]
}
