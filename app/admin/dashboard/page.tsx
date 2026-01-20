"use client"

import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { FileText, Car, Gavel, AlertTriangle, Plus, ArrowRight, TrendingUp, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const { leiloes, carros, leiloeiros, getCarrosAptos, getLeiloeiroById } = useApp()

  const carrosAptos = getCarrosAptos()
  const leiloesRascunho = leiloes.filter((l) => l.status === "RASCUNHO")
  const leiloesPublicados = leiloes.filter((l) => l.status === "PUBLICADO")
  const leiloesFinalizados = leiloes.filter((l) => l.status === "FINALIZADO")
  const aguardandoResultados = leiloes.filter((l) => l.status === "PUBLICADO" && !l.resultadosCompletos)

  const totalArrecadado = leiloesFinalizados.reduce((total, leilao) => {
    return (
      total +
      leilao.lotes.reduce((lotesTotal, lote) => {
        return lotesTotal + (lote.resultado?.valorArremate || 0)
      }, 0)
    )
  }, 0)

  return (
    <AppShell title="Dashboard" subtitle="Visão geral do sistema de leilões">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leilões Rascunho</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leiloesRascunho.length}</div>
            <p className="text-xs text-muted-foreground">Em preparação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leilões Publicados</CardTitle>
            <Gavel className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{leiloesPublicados.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando realização</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leilões Finalizados</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{leiloesFinalizados.length}</div>
            <p className="text-xs text-muted-foreground">R$ {totalArrecadado.toLocaleString("pt-BR")} arrecadados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carros Aptos</CardTitle>
            <Car className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{carrosAptos.length}</div>
            <p className="text-xs text-muted-foreground">de {carros.length} veículos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leiloeiros</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{leiloeiros.length}</div>
            <p className="text-xs text-muted-foreground">{leiloeiros.filter((l) => l.ativo).length} ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {aguardandoResultados.length > 0 && (
        <Card className="mb-8 border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Leilões Aguardando Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aguardandoResultados.map((leilao) => (
                <div key={leilao.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div>
                    <p className="font-medium">{leilao.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {leilao.codigo} • Leiloeiro: {getLeiloeiroById(leilao.leiloeiroId)?.nome || "Não designado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status="pendente" />
                    <Link href={`/admin/auctions/${leilao.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
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
            <Link href="/admin/auctions/new">
              <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Leilão
              </Button>
            </Link>
            <Link href="/admin/cars">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Car className="mr-2 h-4 w-4" />
                Ver Carros Aptos
              </Button>
            </Link>
            <Link href="/admin/auctioneers">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Leiloeiros
              </Button>
            </Link>
            <Link href="/admin/auctions">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Gavel className="mr-2 h-4 w-4" />
                Gerenciar Leilões
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Auctions */}
        <Card>
          <CardHeader>
            <CardTitle>Leilões Recentes</CardTitle>
            <CardDescription>Últimas atualizações</CardDescription>
          </CardHeader>
          <CardContent>
            {leiloes.length > 0 ? (
              <div className="space-y-4">
                {leiloes.slice(0, 5).map((leilao) => (
                  <Link
                    key={leilao.id}
                    href={`/admin/auctions/${leilao.id}`}
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
                <p>Nenhum leilão cadastrado</p>
                <Link href="/admin/auctions/new">
                  <Button variant="link" className="mt-2">
                    Criar primeiro leilão
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
