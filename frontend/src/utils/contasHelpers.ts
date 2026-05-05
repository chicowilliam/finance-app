import type { Conta } from '../types/Bill'
import { daysUntilDue } from './formatDate'

export function groupContasByStatus(contas: Conta[]) {
	return {
		pagas:     contas.filter(c => c.status === 'paga'),
		aVencer:   contas.filter(c => c.status === 'a_vencer'),
		atrasadas: contas.filter(c => c.status === 'atrasada'),
		emAberto:  contas.filter(c => c.status !== 'paga'),
	}
}

export function diasRelativo(vencimento: string): { label: string; color: string } {
	const diff = daysUntilDue(vencimento)
	if (diff === 0) return { label: 'Hoje',   color: '#f08c00' }
	if (diff === 1) return { label: 'Amanhã', color: '#f08c00' }
	if (diff > 0)   return { label: `em ${diff}d`,            color: '#2f9e44' }
	return              { label: `${Math.abs(diff)}d atrás`, color: '#e03131' }
}
