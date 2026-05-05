import { useState } from 'react'
import { STORAGE_KEYS } from '../utils/storageKeys'
import { getNumber } from '../utils/storageHelpers'

export function useSaldo() {
  const [saldo, setSaldoState] = useState<number | null>(() => getNumber(STORAGE_KEYS.SALDO))

  function setSaldo(value: number | null) {
    try {
      if (value === null) {
        localStorage.removeItem(STORAGE_KEYS.SALDO)
      } else {
        localStorage.setItem(STORAGE_KEYS.SALDO, String(value))
      }
    } catch {
      // localStorage indisponível
    }
    setSaldoState(value)
  }

  return { saldo, setSaldo }
}
