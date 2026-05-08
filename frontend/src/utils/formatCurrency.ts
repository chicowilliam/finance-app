import { STORAGE_KEYS } from './storageKeys'

const SUPPORTED_CURRENCIES = new Set(['BRL', 'USD', 'EUR', 'GBP'])

function getPreferredCurrency(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREF_CURRENCY)
    const normalized = (stored ?? 'BRL').toUpperCase()
    return SUPPORTED_CURRENCIES.has(normalized) ? normalized : 'BRL'
  } catch {
    return 'BRL'
  }
}

function getLocaleForCurrency(currency: string): string {
  switch (currency) {
    case 'USD':
      return 'en-US'
    case 'EUR':
      return 'de-DE'
    case 'GBP':
      return 'en-GB'
    case 'BRL':
    default:
      return 'pt-BR'
  }
}

export const formatBRL = (v: number): string => {
  const currency = getPreferredCurrency()
  const locale = getLocaleForCurrency(currency)
  return v.toLocaleString(locale, { style: 'currency', currency })
}
