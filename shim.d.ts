import type { Content } from 'vitepress'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'

  const component: ComponentOptions
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    Content: typeof Content
  }
}
