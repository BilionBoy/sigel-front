"use client"

import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Gavel, Clock, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react"

export default function AuctioneerDashboardPage() {
  const { leiloes, getLeiloeiroById, currentUser } = useApp()

  // Para demo, mostra todos os leilões publicados como "designados"
  const leiloesDesignados = leiloes.filter((l) => l.status === "PUBLICADO")
  const leiloesFinalizados = leiloes.filter((l) => l.status === "FINALIZADO")
  const aguardandoLancamento = leiloesDesignados.filter((l) => !l.resultadosCompletos)

  return (
    <AppShell title="Dashboard do Leiloeiro" subtitle="Visão geral dos seus leilões">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leilões Designados</CardTitle>
            <Gavel className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{leiloesDesignados.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando resultados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Lançamento</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{aguardandoLancamento.length}</div>
            <p className="text-xs text-muted-foreground">Resultados pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leilões Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{leiloesFinalizados.length}</div>
            <p className="text-xs text-muted-foreground">Resultados lançados</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Auctions Alert */}
      {aguardandoLancamento.length > 0 && (
        <Card className="mb-8 border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Leilões Aguardando Lançamento de Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aguardandoLancamento.map((leilao) => {
                const lotesPendentes = leilao.lotes.filter(
                  (l) => l.status !== "ARREMATADO" && l.status !== "NAO_ARREMATADO",
                ).length
                return (
                  <div
                    key={leilao.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{leilao.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {leilao.codigo} • {lotesPendentes} lotes pendentes
                      </p>
                    </div>
                    <Link href={`/auctioneer/auctions/${leilao.id}`}>
                      <Button variant="outline" size="sm">
                        Lançar Resultados
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso direto às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/auctioneer/auctions">
              <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                <Gavel className="mr-2 h-4 w-4" />
                Ver Leilões Designados
              </Button>
            </Link>
            <Link href="/auctioneer/history">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CheckCircle className="mr-2 h-4 w-4" />
                Ver Histórico
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Leilões Recentes</CardTitle>
            <CardDescription>Seus leilões mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {leiloesDesignados.length > 0 || leiloesFinalizados.length > 0 ? (
              <div className="space-y-4">
                {[...leiloesDesignados, ...leiloesFinalizados].slice(0, 5).map((leilao) => (
                  <Link
                    key={leilao.id}
                    href={`/auctioneer/auctions/${leilao.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{leilao.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {leilao.codigo} • {leilao.lotes.length} lotes
                      </p>
                    </div>
                    <StatusBadge status={leilao.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum leilão designado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
