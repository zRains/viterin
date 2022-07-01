export default function () {
  return {
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
          { text: 'TC-4: Pick', link: '/wrap/type_challenge/4_easy_pick' },
          { text: 'TC-7 Readonly', link: '/wrap/type_challenge/7_easy_readonly' },
          { text: 'TC-11: Tuple to Object', link: '/wrap/type_challenge/11_easy_tuple_to_object' },
          { text: 'TC-14: First of Array', link: '/wrap/type_challenge/14_easy_first_of_array' },
          { text: 'TC-18: Length of Tuple', link: '/wrap/type_challenge/18_easy_length_of_tuple' },
          { text: 'TC-43: Exclude', link: '/wrap/type_challenge/43_easy_exclude' },
          { text: 'TC-189: Awaited', link: '/wrap/type_challenge/189_easy_awaited' },
          { text: 'TC-268: If', link: '/wrap/type_challenge/268_easy_if' },
          { text: 'TC-533: Concat', link: '/wrap/type_challenge/533_easy_concat' },
          { text: 'TC-898: Includes', link: '/wrap/type_challenge/898_easy_includes' },
          { text: 'TC-3057: Push', link: '/wrap/type_challenge/3057_easy_push' },
          { text: 'TC-3060: Unshift', link: '/wrap/type_challenge/3060_easy_unshift' },
          { text: 'TC-3312: Parameters', link: '/wrap/type_challenge/3312_easy_parameters' }
        ]
      },
      {
        text: 'Medium',
        collapsible: true,
        items: [
          { text: 'TC-2: Get Return Type', link: '/wrap/type_challenge/2_medium_get_return_type' },
          { text: 'TC-3 Omit', link: '/wrap/type_challenge/3_medium_omit' },
          { text: 'TC-8: Readonly-2', link: '/wrap/type_challenge/8_medium_readonly_2' },
          { text: 'TC-9: Deep Readonly', link: '/wrap/type_challenge/9_medium_deep_readonly' },
          { text: 'TC-10: Tuple to Union', link: '/wrap/type_challenge/10_medium_tuple_to_union' },
          { text: 'TC-12: Chainable Options', link: '/wrap/type_challenge/12_medium_chainable_options' },
          { text: 'TC-15: Last of Array', link: '/wrap/type_challenge/15_medium_last_of_array' },
          { text: 'TC-16: Pop', link: '/wrap/type_challenge/16_medium_pop_shift_unshift' },
          { text: 'TC-20: Promise.all', link: '/wrap/type_challenge/20_medium_promise_all' },
          { text: 'TC-62: Type Lookup', link: '/wrap/type_challenge/62_medium_type_lookup' },
          { text: 'TC-106: Trim Left', link: '/wrap/type_challenge/106_medium_trim_left' },
          { text: 'TC-108: Trim', link: '/wrap/type_challenge/108_medium_trim' },
          { text: 'TC-110: Capitalize', link: '/wrap/type_challenge/110_medium_capitalize' },
          { text: 'TC-116: Replace', link: '/wrap/type_challenge/116_medium_replace' },
          { text: 'TC-119: Replace All', link: '/wrap/type_challenge/119_medium_replace_all' },
          { text: 'TC-191: Append Argument', link: '/wrap/type_challenge/191_medium_append_argument' },
          { text: 'TC-298: Length of String', link: '/wrap/type_challenge/298_medium_length_of_string' },
          { text: 'TC-459: Flatten', link: '/wrap/type_challenge/459_medium_fatten' },
          { text: 'TC-527: Append to object', link: '/wrap/type_challenge/527_medium_append_to_object' },
          { text: 'TC-529: Absolute', link: '/wrap/type_challenge/529_medium_absolute' },
          { text: 'TC-531: String to Union', link: '/wrap/type_challenge/531_medium_string_to_union' },
          { text: 'TC-599: Merge', link: '/wrap/type_challenge/599_medium_merge' },
          { text: 'TC-610: CamelCase', link: '/wrap/type_challenge/610_medium_camelcase' }
        ]
      }
    ],
    '/wrap/sword_to_offer': [
      {
        text: '剑指offer',
        collapsible: false,
        items: [{ text: '介绍', link: '/wrap/sword_to_offer/' }]
      },
      {
        text: '题目集',
        collapsible: true,
        items: [
          { text: '第1天 - 栈与队列（简单）', link: '/wrap/sword_to_offer/day1_stack_and_queue' },
          { text: '第2天 - 链表（简单）', link: '/wrap/sword_to_offer/day2_list_node' },
          { text: '第3天 - 字符串（简单）', link: '/wrap/sword_to_offer/day3_string' },
          { text: '第4天 - 查找算法（简单）', link: '/wrap/sword_to_offer/day4_search_easy' },
          { text: '第5天 - 查找算法（中等）', link: '/wrap/sword_to_offer/day5_search_medium' },
          { text: '第6天 - 搜索与回溯算法1（简单）', link: '/wrap/sword_to_offer/day6_search_and_trackBack_easy_1' },
          { text: '第7天 - 搜索与回溯算法3（简单）', link: '/wrap/sword_to_offer/day7_search_and_trackBack_easy_2' },
          { text: '第8天 - 动态规划（简单）', link: '/wrap/sword_to_offer/day8_dp_easy' },
          { text: '第9天 - 动态规划1（中等）', link: '/wrap/sword_to_offer/day9_dp_medium_1' },
          { text: '第10天 - 动态规划2（中等）', link: '/wrap/sword_to_offer/day10_dp_medium_2' },
          { text: '第11天 - 双指针1（简单）', link: '/wrap/sword_to_offer/day11_two_noders_1' },
          { text: '第12天 - 双指针2（简单）', link: '/wrap/sword_to_offer/day12_two_noders_2' },
          { text: '第13天 - 双指针3（简单）', link: '/wrap/sword_to_offer/day13_two_noders_3' },
          { text: '第14天 - 搜索与回溯算法1（中等）', link: '/wrap/sword_to_offer/day14_search_and_trackBack_medium_1' },
          { text: '第15天 - 搜索与回溯算法2（中等）', link: '/wrap/sword_to_offer/day15_search_and_trackBack_medium_2' },
          { text: '第16天 - 排序（简单）', link: '/wrap/sword_to_offer/day16_sort_easy' },
          { text: '第17天 - 排序（中等）', link: '/wrap/sword_to_offer/day17_sort_medium' },
          { text: '第18天 - 搜索与回溯算法3（中等）', link: '/wrap/sword_to_offer/day18_search_and_trackBack_meduim_3' },
          { text: '第19天 - 搜索与回溯算法4（中等）', link: '/wrap/sword_to_offer/day19_search_and_trackBack_medium_4' }
        ]
      }
    ]
  }
}
