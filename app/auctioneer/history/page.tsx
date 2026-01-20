"use client"

import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, History, CheckCircle, XCircle } from "lucide-react"

export default function AuctioneerHistoryPage() {
  const { leiloes, getCarroById } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  // Leilões finalizados
  const leiloesFinalizados = leiloes.filter((l) => l.status === "FINALIZADO")

  const filteredLeiloes = leiloesFinalizados.filter((leilao) => {
    return (
      leilao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leilao.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <AppShell title="Histórico" subtitle="Leilões finalizados com resultados lançados">
      <Card>
        <CardHeader>
          <CardTitle>Leilões Finalizados</CardTitle>
          <CardDescription>{filteredLeiloes.length} leilões no histórico</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou código..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {filteredLeiloes.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Código</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="text-center">
                      <CheckCircle className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <XCircle className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Arrecadado</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeiloes.map((leilao) => {
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
                        <TableCell className="text-center text-success font-semibold">{arrematados}</TableCell>
                        <TableCell className="text-center text-destructive font-semibold">{naoArrematados}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell font-semibold">
                          R$ {arrecadado.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Link href={`/auctioneer/auctions/${leilao.id}`}>
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
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum leilão finalizado</p>
              <p className="text-sm mt-1">Os leilões finalizados aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
