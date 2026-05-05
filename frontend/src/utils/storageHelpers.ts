export function getBool(key: string, def = false): boolean {
	const v = localStorage.getItem(key)
	return v === null ? def : v === 'true'
}

export function setBool(key: string, v: boolean): void {
	localStorage.setItem(key, String(v))
}

export function getStr(key: string, def: string): string {
	return localStorage.getItem(key) ?? def
}

export function setStr(key: string, v: string): void {
	localStorage.setItem(key, v)
}

export function getNumber(key: string): number | null {
	try {
		const raw = localStorage.getItem(key)
		const parsed = raw !== null ? Number(raw) : null
		return parsed !== null && isFinite(parsed) ? parsed : null
	} catch {
		return null
	}
}

export function loadJSON<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key)
		return raw ? (JSON.parse(raw) as T) : fallback
	} catch {
		return fallback
	}
}

export function saveJSON<T>(key: string, value: T): void {
	localStorage.setItem(key, JSON.stringify(value))
}
