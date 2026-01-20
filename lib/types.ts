// Entity Types for SIGEL

export type LeilaoStatus = "RASCUNHO" | "PUBLICADO" | "FINALIZADO"
export type LoteStatus = "APTO" | "VINCULADO" | "ARREMATADO" | "NAO_ARREMATADO"
export type CarroStatus = "APTO" | "VINCULADO" | "INDISPONIVEL"
export type UserRole = "admin" | "auctioneer"

export interface User {
  id: string
  nome: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Carro {
  id: string
  placa: string
  chassi: string
  ano: number
  cor: string
  tipo: string
  status: CarroStatus
  fotos: string[]
  valorInicial: number
  marca: string
  modelo: string
  createdAt: Date
  updatedAt: Date
}

export interface Leiloeiro {
  id: string
  nome: string
  email: string
  ativo: boolean
}

export interface ResultadoLote {
  arrematante?: string
  documento?: string
  valorArremate?: number
  observacao?: string
}

export interface Lote {
  id: string
  numero: number
  carroId: string
  carro?: Carro
  valorInicial: number
  status: LoteStatus
  resultado?: ResultadoLote
  leilaoId: string
}

export interface PublicacaoEdital {
  data: Date
  local: string
  anexo?: string
}

export interface Leilao {
  id: string
  titulo: string
  codigo: string
  data: Date
  status: LeilaoStatus
  leiloeiroId: string
  leiloeiro?: Leiloeiro
  lotes: Lote[]
  observacoes?: string
  publicacao?: PublicacaoEdital
  resultadosCompletos: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuditEvent {
  id: string
  data: Date
  usuario: string
  usuarioRole: UserRole
  acao: string
  entidade: "leilao" | "carro" | "lote"
  entidadeId: string
  detalhes: string
}

export interface PrestacaoContas {
  id: string
  leilaoId: string
  leilao?: Leilao
  dataGeracao: Date
  usuario: string
  versao: number
  tipo: "pdf" | "planilha"
}
