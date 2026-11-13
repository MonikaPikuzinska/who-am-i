import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { readCookie, writeCookie } from '../lib/cookies.ts'

export function usePersistentState<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = readCookie(key)
      if (raw == null || raw === '') return fallback
      return parse(raw)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      writeCookie(key, JSON.stringify(state))
    } catch {
      // A failed cookie write leaves the current game usable in memory.
    }
  }, [key, state])

  return [state, setState]
}
