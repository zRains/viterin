import { withBase } from 'vitepress'

export const HASH_RE = /#.*$/
export const EXT_RE = /(index)?\.(md|html)$/
export const OUTBOUND_RE = /^[a-z]+:/i

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
    pathname.endsWith('/') || pathname.endsWith('.html') ? url : `${pathname.replace(/(\.md)?$/, '.html')}${search}${hash}`

  return withBase(normalizedPath)
}
