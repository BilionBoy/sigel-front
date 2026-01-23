import type { Carro, Leilao, Leiloeiro, AuditEvent, PrestacaoContas } from "./types"

// Leiloeiros mock
export const leiloeiros: Leiloeiro[] = []

// Carros aptos mock (20+ veículos)
export const carrosAptos: Carro[] = []

// Leilões mock (3 leilões com estados diferentes)
export const leiloes: Leilao[] = []

// Auditoria mock
export const auditoria: AuditEvent[] = []

// Prestações de contas mock
export const prestacoesContas: PrestacaoContas[] = []

// Users mock
export const users = {
  admin: { id: "u1", nome: "Administrador", email: "admin@sigel.gov.br", role: "admin" as const },
  auctioneer: { id: "u2", nome: "Leiloeiro", email: "leiloeiro@sigel.gov.br", role: "auctioneer" as const },
}