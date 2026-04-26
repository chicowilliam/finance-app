export function parseFinanceDate(isoDate: string): Date {
	return new Date(`${isoDate}T00:00:00`)
}

export function formatDateBR(isoDate: string): string {
	return parseFinanceDate(isoDate).toLocaleDateString('pt-BR')
}

function toStartOfDay(date: Date): Date {
	const normalized = new Date(date)
	normalized.setHours(0, 0, 0, 0)
	return normalized
}

function diffInCalendarDays(left: Date, right: Date): number {
	const msPerDay = 86_400_000
	const leftDay = toStartOfDay(left).getTime()
	const rightDay = toStartOfDay(right).getTime()
	return Math.round((leftDay - rightDay) / msPerDay)
}

export function isOverdue(isoDate: string, reference = new Date()): boolean {
	const due = toStartOfDay(parseFinanceDate(isoDate))
	const today = toStartOfDay(reference)
	return due.getTime() < today.getTime()
}

export function daysUntilDue(isoDate: string, reference = new Date()): number {
	return diffInCalendarDays(parseFinanceDate(isoDate), reference)
}

export function daysOverdue(isoDate: string, reference = new Date()): number {
	const diff = diffInCalendarDays(reference, parseFinanceDate(isoDate))
	return Math.max(0, diff)
}

export function dueLabel(isoDate: string, reference = new Date()): string {
	const days = daysUntilDue(isoDate, reference)

	if (days === 0) {
		return 'Vence hoje'
	}
	if (days > 0) {
		return `Faltam ${days} dia${days !== 1 ? 's' : ''}`
	}
	const overdue = Math.abs(days)
	return `Atrasada ha ${overdue} dia${overdue !== 1 ? 's' : ''}`
}
