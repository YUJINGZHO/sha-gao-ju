const canUseStorage = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export function load<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key: string): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const storage = { load, save, remove }
export const get = load
export const set = save
