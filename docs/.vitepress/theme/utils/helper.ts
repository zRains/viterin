import type { Sidebar, SidebarGroup } from '../types/theme'
import { withBase } from 'vitepress'
import { ref } from 'vue'

export const HASH_RE = /#.*$/
export const EXT_RE = /(index)?\.(md|html)$/
export const OUTBOUND_RE = /^[a-z]+:/i
export const ensureStartingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

const hashRef = ref(typeof window !== 'undefined' ? location.hash : '')

/**
 * 判断是否为外链
 */
export function isExternal(path: string): boolean {
  return OUTBOUND_RE.test(path)
}

/**
 * 处理链接（去掉哈希和扩展）
 */
export function normalize(path: string): string {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

/**
 * 返回标准链接
 */
export function normalizeLink(url: string): string {
  if (isExternal(url)) {
    return url
  }

  const { pathname, search, hash } = new URL(url, 'https://zrain.fun')
  const normalizedPath =
    pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : `${pathname.replace(/(\.md)?$/, '.html')}${search}${decodeURIComponent(hash)}`

  return withBase(normalizedPath)
}

/**
 * 判断链接是否在激活状态
 */
export function isActive(currentPath: string, matchPath?: string, asRegex: boolean = false): boolean {
  if (matchPath === undefined) {
    return false
  }

  currentPath = normalize(`/${currentPath}`)

  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }

  if (normalize(matchPath) !== currentPath) {
    return false
  }

  const hashMatch = matchPath.match(HASH_RE)

  if (hashMatch) {
    return hashRef.value === hashMatch[0]
  }

  return true
}

// 获取当前页面的侧边栏
export function getSidebar(sidebar: Sidebar, path: string): SidebarGroup[] {
  if (Array.isArray(sidebar)) {
    return sidebar
  }

  path = ensureStartingSlash(path)

  for (const dir in sidebar) {
    if (path.startsWith(ensureStartingSlash(dir))) {
      return sidebar[dir]
    }
  }

  return []
}

/**
 * 防抖
 */
export function debounce(fn: (...args: any[]) => void, delay = 300) {
  let timer: any = 0
  return function (..._args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(null, _args), delay)
  }
}

/**
 * 节流
 */
export function throttle(fn: (...args: any[]) => void, delay = 300) {
  let timer: any = 0
  return function (..._args: any[]) {
    if (!timer) {
      timer = setTimeout(() => fn.apply(null, _args), delay)
    }
  }
}
