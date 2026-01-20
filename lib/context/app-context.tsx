"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type {
  User,
  Carro,
  Leilao,
  Lote,
  AuditEvent,
  PrestacaoContas,
  Leiloeiro,
  LeilaoStatus,
  LoteStatus,
  CarroStatus,
} from "@/lib/types"
import {
  users,
  carrosAptos as initialCarros,
  leiloes as initialLeiloes,
  auditoria as initialAuditoria,
  prestacoesContas as initialPrestacoes,
  leiloeiros as initialLeiloeiros,
} from "@/lib/mock-data"

interface AppContextType {
  // Auth - removendo autenticação, usuário fixo
  currentUser: User
  currentRole: "admin" | "auctioneer"
  setCurrentRole: (role: "admin" | "auctioneer") => void

  // Data
  carros: Carro[]
  leiloes: Leilao[]
  leiloeiros: Leiloeiro[]
  auditoria: AuditEvent[]
  prestacoesContas: PrestacaoContas[]

  // Actions
  addCarro: (carro: Omit<Carro, "id" | "createdAt" | "updatedAt">) => void
  updateCarro: (id: string, updates: Partial<Carro>) => void
  deleteCarro: (id: string) => void
  addLeiloeiro: (leiloeiro: Omit<Leiloeiro, "id">) => void
  updateLeiloeiro: (id: string, updates: Partial<Leiloeiro>) => void
  deleteLeiloeiro: (id: string) => void
  createLeilao: (leilao: Omit<Leilao, "id" | "createdAt" | "updatedAt" | "lotes" | "resultadosCompletos">) => string
  updateLeilao: (id: string, updates: Partial<Leilao>) => void
  deleteLeilao: (id: string) => void
  vincularCarrosAoLeilao: (leilaoId: string, carroIds: string[]) => void
  removerLoteDoLeilao: (leilaoId: string, loteId: string) => void
  publicarLeilao: (leilaoId: string, publicacao: { data: Date; local: string }) => void
  finalizarLeilao: (leilaoId: string) => void
  lancarResultadoLote: (
    leilaoId: string,
    loteId: string,
    resultado: {
      status: LoteStatus
      arrematante?: string
      documento?: string
      valorArremate?: number
      observacao?: string
    },
  ) => void
  gerarPrestacaoContas: (leilaoId: string, tipo: "pdf" | "planilha") => void
  addAuditEvent: (event: Omit<AuditEvent, "id" | "data">) => void

  // Helpers
  getCarroById: (id: string) => Carro | undefined
  getLeilaoById: (id: string) => Leilao | undefined
  getLeiloeiroById: (id: string) => Leiloeiro | undefined
  getCarrosAptos: () => Carro[]
  getLeiloesDoLeiloeiro: (leiloeiroId: string) => Leilao[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<"admin" | "auctioneer">("admin")
  const currentUser: User = currentRole === "admin" ? users.admin : users.auctioneer

  const [carros, setCarros] = useState<Carro[]>(initialCarros)
  const [leiloes, setLeiloes] = useState<Leilao[]>(initialLeiloes)
  const [leiloeiros, setLeiloeiros] = useState<Leiloeiro[]>(initialLeiloeiros)
  const [auditoria, setAuditoria] = useState<AuditEvent[]>(initialAuditoria)
  const [prestacoesContas, setPrestacoesContas] = useState<PrestacaoContas[]>(initialPrestacoes)

  const addAuditEvent = useCallback((event: Omit<AuditEvent, "id" | "data">) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud${Date.now()}`,
      data: new Date(),
    }
    setAuditoria((prev) => [newEvent, ...prev])
  }, [])

  const addCarro = useCallback(
    (carro: Omit<Carro, "id" | "createdAt" | "updatedAt">) => {
      const newCarro: Carro = {
        ...carro,
        id: `c${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setCarros((prev) => [...prev, newCarro])
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Carro adicionado",
        entidade: "carro",
        entidadeId: newCarro.id,
        detalhes: `Veículo ${carro.placa} adicionado ao sistema`,
      })
    },
    [currentUser, addAuditEvent],
  )

  const updateCarro = useCallback((id: string, updates: Partial<Carro>) => {
    setCarros((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)))
  }, [])

  const deleteCarro = useCallback((id: string) => {
    setCarros((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addLeiloeiro = useCallback(
    (leiloeiro: Omit<Leiloeiro, "id">) => {
      const newLeiloeiro: Leiloeiro = {
        ...leiloeiro,
        id: `l${Date.now()}`,
      }
      setLeiloeiros((prev) => [...prev, newLeiloeiro])
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Leiloeiro adicionado",
        entidade: "leilao",
        entidadeId: newLeiloeiro.id,
        detalhes: `Leiloeiro ${leiloeiro.nome} cadastrado`,
      })
    },
    [currentUser, addAuditEvent],
  )

  const updateLeiloeiro = useCallback((id: string, updates: Partial<Leiloeiro>) => {
    setLeiloeiros((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }, [])

  const deleteLeiloeiro = useCallback((id: string) => {
    setLeiloeiros((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const createLeilao = useCallback(
    (leilao: Omit<Leilao, "id" | "createdAt" | "updatedAt" | "lotes" | "resultadosCompletos">) => {
      const newId = `lei${Date.now()}`
      const newLeilao: Leilao = {
        ...leilao,
        id: newId,
        lotes: [],
        resultadosCompletos: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setLeiloes((prev) => [...prev, newLeilao])
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Leilão criado",
        entidade: "leilao",
        entidadeId: newId,
        detalhes: `Leilão ${leilao.codigo} criado como rascunho`,
      })
      return newId
    },
    [currentUser, addAuditEvent],
  )

  const updateLeilao = useCallback((id: string, updates: Partial<Leilao>) => {
    setLeiloes((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l)))
  }, [])

  const deleteLeilao = useCallback((id: string) => {
    setLeiloes((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const vincularCarrosAoLeilao = useCallback(
    (leilaoId: string, carroIds: string[]) => {
      setLeiloes((prev) =>
        prev.map((leilao) => {
          if (leilao.id !== leilaoId) return leilao

          const existingLoteNumbers = leilao.lotes.map((l) => l.numero)
          const nextNumber = existingLoteNumbers.length > 0 ? Math.max(...existingLoteNumbers) + 1 : 1

          const newLotes: Lote[] = carroIds.map((carroId, index) => ({
            id: `lot${Date.now()}${index}`,
            numero: nextNumber + index,
            carroId,
            valorInicial: carros.find((c) => c.id === carroId)?.valorInicial || 0,
            status: "VINCULADO" as LoteStatus,
            leilaoId,
          }))

          return {
            ...leilao,
            lotes: [...leilao.lotes, ...newLotes],
            updatedAt: new Date(),
          }
        }),
      )

      carroIds.forEach((carroId) => {
        updateCarro(carroId, { status: "VINCULADO" as CarroStatus })
        addAuditEvent({
          usuario: currentUser.nome,
          usuarioRole: currentUser.role,
          acao: "Carro vinculado ao leilão",
          entidade: "lote",
          entidadeId: carroId,
          detalhes: `Veículo ${carros.find((c) => c.id === carroId)?.placa} vinculado ao leilão`,
        })
      })
    },
    [carros, currentUser, updateCarro, addAuditEvent],
  )

  const removerLoteDoLeilao = useCallback(
    (leilaoId: string, loteId: string) => {
      let carroId = ""
      setLeiloes((prev) =>
        prev.map((leilao) => {
          if (leilao.id !== leilaoId) return leilao
          const lote = leilao.lotes.find((l) => l.id === loteId)
          if (lote) carroId = lote.carroId
          return {
            ...leilao,
            lotes: leilao.lotes.filter((l) => l.id !== loteId),
            updatedAt: new Date(),
          }
        }),
      )
      if (carroId) {
        updateCarro(carroId, { status: "APTO" as CarroStatus })
      }
    },
    [updateCarro],
  )

  const publicarLeilao = useCallback(
    (leilaoId: string, publicacao: { data: Date; local: string }) => {
      setLeiloes((prev) =>
        prev.map((l) =>
          l.id === leilaoId
            ? {
                ...l,
                status: "PUBLICADO" as LeilaoStatus,
                publicacao,
                updatedAt: new Date(),
              }
            : l,
        ),
      )
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Edital publicado",
        entidade: "leilao",
        entidadeId: leilaoId,
        detalhes: `Leilão publicado em ${publicacao.local}`,
      })
    },
    [currentUser, addAuditEvent],
  )

  const finalizarLeilao = useCallback(
    (leilaoId: string) => {
      setLeiloes((prev) =>
        prev.map((l) =>
          l.id === leilaoId
            ? {
                ...l,
                status: "FINALIZADO" as LeilaoStatus,
                updatedAt: new Date(),
              }
            : l,
        ),
      )
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Leilão finalizado",
        entidade: "leilao",
        entidadeId: leilaoId,
        detalhes: `Leilão finalizado com sucesso`,
      })
    },
    [currentUser, addAuditEvent],
  )

  const lancarResultadoLote = useCallback(
    (
      leilaoId: string,
      loteId: string,
      resultado: {
        status: LoteStatus
        arrematante?: string
        documento?: string
        valorArremate?: number
        observacao?: string
      },
    ) => {
      setLeiloes((prev) =>
        prev.map((leilao) => {
          if (leilao.id !== leilaoId) return leilao

          const updatedLotes = leilao.lotes.map((lote) => {
            if (lote.id !== loteId) return lote
            return {
              ...lote,
              status: resultado.status,
              resultado: {
                arrematante: resultado.arrematante,
                documento: resultado.documento,
                valorArremate: resultado.valorArremate,
                observacao: resultado.observacao,
              },
            }
          })

          const allCompleted = updatedLotes.every((l) => l.status === "ARREMATADO" || l.status === "NAO_ARREMATADO")

          return {
            ...leilao,
            lotes: updatedLotes,
            resultadosCompletos: allCompleted,
            updatedAt: new Date(),
          }
        }),
      )

      const leilao = leiloes.find((l) => l.id === leilaoId)
      const lote = leilao?.lotes.find((l) => l.id === loteId)
      if (lote) {
        updateCarro(lote.carroId, { status: resultado.status as CarroStatus })
      }

      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Resultado lançado pelo leiloeiro",
        entidade: "lote",
        entidadeId: loteId,
        detalhes:
          resultado.status === "ARREMATADO"
            ? `Lote arrematado por ${resultado.arrematante} - R$ ${resultado.valorArremate?.toLocaleString("pt-BR")}`
            : `Lote não arrematado - ${resultado.observacao || "Sem observação"}`,
      })
    },
    [leiloes, currentUser, updateCarro, addAuditEvent],
  )

  const gerarPrestacaoContas = useCallback(
    (leilaoId: string, tipo: "pdf" | "planilha") => {
      const existingVersions = prestacoesContas.filter((p) => p.leilaoId === leilaoId && p.tipo === tipo)
      const newVersion = existingVersions.length + 1

      const newPrestacao: PrestacaoContas = {
        id: `pc${Date.now()}`,
        leilaoId,
        dataGeracao: new Date(),
        usuario: currentUser.nome,
        versao: newVersion,
        tipo,
      }
      setPrestacoesContas((prev) => [...prev, newPrestacao])
      addAuditEvent({
        usuario: currentUser.nome,
        usuarioRole: currentUser.role,
        acao: "Prestação de contas gerada",
        entidade: "leilao",
        entidadeId: leilaoId,
        detalhes: `${tipo.toUpperCase()} da prestação de contas v${newVersion} gerado`,
      })
    },
    [currentUser, prestacoesContas, addAuditEvent],
  )

  const getCarroById = useCallback((id: string) => carros.find((c) => c.id === id), [carros])
  const getLeilaoById = useCallback((id: string) => leiloes.find((l) => l.id === id), [leiloes])
  const getLeiloeiroById = useCallback((id: string) => leiloeiros.find((l) => l.id === id), [leiloeiros])
  const getCarrosAptos = useCallback(() => carros.filter((c) => c.status === "APTO"), [carros])
  const getLeiloesDoLeiloeiro = useCallback(
    (leiloeiroId: string) => leiloes.filter((l) => l.leiloeiroId === leiloeiroId),
    [leiloes],
  )

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        carros,
        leiloes,
        leiloeiros,
        auditoria,
        prestacoesContas,
        addCarro,
        updateCarro,
        deleteCarro,
        addLeiloeiro,
        updateLeiloeiro,
        deleteLeiloeiro,
        createLeilao,
        updateLeilao,
        deleteLeilao,
        vincularCarrosAoLeilao,
        removerLoteDoLeilao,
        publicarLeilao,
        finalizarLeilao,
        lancarResultadoLote,
        gerarPrestacaoContas,
        addAuditEvent,
        getCarroById,
        getLeilaoById,
        getLeiloeiroById,
        getCarrosAptos,
        getLeiloesDoLeiloeiro,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
