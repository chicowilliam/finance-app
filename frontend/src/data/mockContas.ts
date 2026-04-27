import { formatDateBR } from '../utils/formatDate'

// Re-export canonical types so legacy imports still resolve
export type { StatusConta, Conta } from '../types/Bill'

// Re-export formatBRL so legacy imports still resolve
export { formatBRL } from '../utils/formatCurrency'

export const formatData = (iso: string) => formatDateBR(iso)

const hoje = new Date()
const addDias = (n: number) => {
  const d = new Date(hoje)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export const mockContas: Conta[] = [
  { id: 1,  descricao: 'Aluguel',           valor: 1800.00, vencimento: addDias(-5),  status: 'atrasada',  categoria: 'Moradia'       },
  { id: 2,  descricao: 'Internet',           valor: 119.90,  vencimento: addDias(-2),  status: 'atrasada',  categoria: 'Serviços'      },
  { id: 3,  descricao: 'Energia Elétrica',   valor: 213.40,  vencimento: addDias(2),   status: 'a_vencer',  categoria: 'Moradia'       },
  { id: 4,  descricao: 'Cartão de Crédito',  valor: 980.00,  vencimento: addDias(3),   status: 'a_vencer',  categoria: 'Cartão'        },
  { id: 5,  descricao: 'Plano de Saúde',     valor: 450.00,  vencimento: addDias(5),   status: 'a_vencer',  categoria: 'Saúde'         },
  { id: 6,  descricao: 'Streaming',          valor: 55.90,   vencimento: addDias(7),   status: 'a_vencer',  categoria: 'Entretenimento' },
  { id: 7,  descricao: 'Financiamento Auto', valor: 890.00,  vencimento: addDias(10),  status: 'a_vencer',  categoria: 'Transporte'    },
  { id: 8,  descricao: 'Academia',           valor: 99.90,   vencimento: addDias(-10), status: 'paga',      categoria: 'Saúde'         },
  { id: 9,  descricao: 'Seguro Residencial', valor: 145.00,  vencimento: addDias(-15), status: 'paga',      categoria: 'Moradia'       },
  { id: 10, descricao: 'Telefone',           valor: 89.90,   vencimento: addDias(-8),  status: 'paga',      categoria: 'Serviços'      },
]