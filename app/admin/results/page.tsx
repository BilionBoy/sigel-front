"use client"

import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, TrendingUp, DollarSign, Package, CheckCircle, XCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AdminResultsPage() {
  const { leiloes, getLeiloeiroById, getCarroById } = useApp()

  const leiloesFinalizados = leiloes.filter((l) => l.status === "FINALIZADO")

  // Calculate totals
  const totalArrecadado = leiloesFinalizados.reduce((total, leilao) => {
    return (
      total +
      leilao.lotes.reduce((lotesTotal, lote) => {
        return lotesTotal + (lote.resultado?.valorArremate || 0)
      }, 0)
    )
  }, 0)

  const totalLotes = leiloesFinalizados.reduce((total, l) => total + l.lotes.length, 0)
  const totalArrematados = leiloesFinalizados.reduce(
    (total, l) => total + l.lotes.filter((lot) => lot.status === "ARREMATADO").length,
    0,
  )

  // Chart data
  const chartData = leiloesFinalizados.map((leilao) => ({
    name: leilao.codigo,
    arrecadado: leilao.lotes.reduce((sum, l) => sum + (l.resultado?.valorArremate || 0), 0),
  }))

  const chartConfig: ChartConfig = {
    arrecadado: {
      label: "Arrecadado",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <AppShell title="Resultados" subtitle="Central de resultados dos leilões finalizados" requiredRole="admin">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Arrecadado</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">R$ {totalArrecadado.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Em {leiloesFinalizados.length} leilões finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lotes Arrematados</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{totalArrematados}</div>
            <p className="text-xs text-muted-foreground">de {totalLotes} lotes totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalLotes > 0 ? Math.round((totalArrematados / totalLotes) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Lotes arrematados</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Arrecadação por Leilão</CardTitle>
            <CardDescription>Valores arrecadados em cada leilão finalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="arrecadado" fill="var(--color-arrecadado)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Finalized Auctions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leilões Finalizados</CardTitle>
          <CardDescription>Lista de leilões com resultados consolidados</CardDescription>
        </CardHeader>
        <CardContent>
          {leiloesFinalizados.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Código</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="hidden lg:table-cell">Leiloeiro</TableHead>
                    <TableHead className="text-center">
                      <CheckCircle className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <XCircle className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="text-right">Arrecadado</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leiloesFinalizados.map((leilao) => {
                    const leiloeiro = getLeiloeiroById(leilao.leiloeiroId)
                    const arrematados = leilao.lotes.filter((l) => l.status === "ARREMATADO").length
                    const naoArrematados = leilao.lotes.filter((l) => l.status === "NAO_ARREMATADO").length
                    const arrecadado = leilao.lotes.reduce((sum, l) => sum + (l.resultado?.valorArremate || 0), 0)

                    return (
                      <TableRow key={leilao.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">{leilao.codigo}</TableCell>
                        <TableCell>
                          <p className="font-medium truncate max-w-[200px]">{leilao.titulo}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {leilao.data.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">{leiloeiro?.nome}</TableCell>
                        <TableCell className="text-center text-success font-semibold">{arrematados}</TableCell>
                        <TableCell className="text-center text-destructive font-semibold">{naoArrematados}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {arrecadado.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/auctions/${leilao.id}?tab=resultados`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum leilão finalizado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
