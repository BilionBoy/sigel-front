"use client"

import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Eye } from "lucide-react"

export default function AdminAccountabilityPage() {
  const { prestacoesContas, getLeilaoById } = useApp()

  // Sort by date descending
  const sortedPrestacoes = [...prestacoesContas].sort((a, b) => b.dataGeracao.getTime() - a.dataGeracao.getTime())

  return (
    <AppShell title="Prestação de Contas" subtitle="Central de relatórios de prestação de contas" requiredRole="admin">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
          <CardDescription>Histórico de prestações de contas geradas pelo sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedPrestacoes.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Relatório</TableHead>
                    <TableHead>Leilão</TableHead>
                    <TableHead className="hidden md:table-cell">Data Geração</TableHead>
                    <TableHead className="hidden lg:table-cell">Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPrestacoes.map((prestacao) => {
                    const leilao = getLeilaoById(prestacao.leilaoId)
                    return (
                      <TableRow key={prestacao.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Prestação de Contas v{prestacao.versao}</p>
                              <p className="text-sm text-muted-foreground">{leilao?.codigo}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="truncate max-w-[200px]">{leilao?.titulo}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <p>{prestacao.dataGeracao.toLocaleDateString("pt-BR")}</p>
                            <p className="text-sm text-muted-foreground">
                              {prestacao.dataGeracao.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {prestacao.usuario}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              prestacao.tipo === "pdf"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-success/10 text-success"
                            }`}
                          >
                            {prestacao.tipo.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link href={`/admin/auctions/${prestacao.leilaoId}?tab=prestacao`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma prestação de contas gerada</p>
              <p className="text-sm mt-1">Finalize leilões para gerar relatórios</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
