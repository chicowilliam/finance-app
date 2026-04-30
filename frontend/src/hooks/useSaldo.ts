import { useState } from 'react'

const SALDO_KEY = 'finance-app:saldo'

function loadSaldo(): number | null {
  try {
    const raw = localStorage.getItem(SALDO_KEY)
    const parsed = raw !== null ? Number(raw) : null
    return parsed !== null && isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function useSaldo() {
  const [saldo, setSaldoState] = useState<number | null>(loadSaldo)

  function setSaldo(value: number | null) {
    try {
      if (value === null) {
        localStorage.removeItem(SALDO_KEY)
      } else {
        localStorage.setItem(SALDO_KEY, String(value))
      }
    } catch {
      // localStorage indisponível
    }
    setSaldoState(value)
  }

  return { saldo, setSaldo }
}
