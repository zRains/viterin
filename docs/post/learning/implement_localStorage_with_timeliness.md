---
toc: false
date: 1649942694482
title: '实现一个具有时效性的LocalStorage'
scope: ['JS']
draft: false
visible: true
lang: 'zh'
layout: 'page'
---

使用`LocalStorage`时将数据放在含有过期时间戳里，取出时判断是否过期，如果过期则删除。

```javascript
class CustomStorage {
  static instance = null
  myStorege = new Map()
  constructor({ clearAll = false, clearExpire = true }) {
    if (clearAll) {
      localStorage.clear()
    }
    for (const [k, p] of Object.entries(localStorage)) {
      try {
        const tempPackage = JSON.parse(p)
        if (clearExpire && tempPackage.exp !== -1 && tempPackage.exp <= new Date().getTime()) {
          localStorage.removeItem(k)
          continue
        }
        this.myStorege.set(k, tempPackage)
      } catch (error) {
        localStorage.removeItem(k)
        continue
      }
    }
  }

  /**
   * 设置存储
   * @param {string} k 键名
   * @param {any} v 键值
   * @param {number | string} exp 过期时间戳
   * @param {(error:Error | null, k:string, v:any) => void} cb 回调
   */
  set(k, v, exp = -1, cb = () => {}) {
    const expNum = typeof exp === 'number' ? exp : parseInt(exp)
    // 检查键名是否为字符串
    if (typeof k !== 'string') {
      return cb(new Error('键值不为字符串类型！'), k, v)
    }
    // 检查是否为合法的时间戳
    if (isNaN(exp) || new Date(expNum).toString() === 'Invalid Date' || (expNum !== -1 && new Date().getTime() >= expNum)) {
      return cb(new Error('非法的过期时间！'), k, v)
    }
    const valPackage = {
      val: v,
      exp: expNum
    }
    // 检查键值是否能被序列化
    try {
      localStorage.setItem(k, JSON.stringify(valPackage))
    } catch (error) {
      return cb(error, k, v)
    }
    this.myStorege.set(k, valPackage)
    cb(null, k, v)
  }

  /**
   * 获取存储
   * @param {string} k 键名
   */
  get(k) {
    if (typeof k === 'string' && this.myStorege.has(k)) {
      const exp = this.myStorege.get(k).exp
      if (exp === -1 ? false : exp <= new Date().getTime()) {
        this.del(k)
      }
      return this.myStorege.get(k).val
    }
    return undefined
  }
  /**
   * 删除存储
   * @param {string} k 键名
   * @returns
   */
  del(k) {
    // 检查键名是否为字符串
    if (typeof k !== 'string' && this.myStorege.has(k)) {
      this.myStorege.delete(k)
      localStorage.removeItem(k)
    }
  }

  /**
   * 获取实例
   * @param {{ clearAll:boolean, clearExpire:boolean }} options
   * @returns {CustomStorage}
   */
  static getInstance(options = {}) {
    if (!CustomStorage.instance) {
      CustomStorage.instance = new CustomStorage(options)
    }
    return CustomStorage.instance
  }
}

export default CustomStorage.getInstance()
```
