export default function () {
  return [
    { text: 'Post', link: '/post/' },
    { text: 'Note', link: '/note' },
    {
      text: 'Wrap',
      items: [
        {
          items: [
            {
              text: 'Type Challenge 挑战',
              link: '/wrap/type_challenge/index'
            },
            {
              text: 'LeetCode 剑指offer',
              link: '/wrap/sword_to_offer/index'
            }
          ]
        }
      ]
    }
  ]
}
