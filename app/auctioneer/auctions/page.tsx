"use client"

import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Gavel, CheckCircle, XCircle } from "lucide-react"

export default function AuctioneerAuctionsPage() {
  const { leiloes } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  // Leilões publicados (designados para lançamento)
  const leiloesDesignados = leiloes.filter((l) => l.status === "PUBLICADO")

  const filteredLeiloes = leiloesDesignados.filter((leilao) => {
    return (
      leilao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leilao.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <AppShell title="Leilões Designados" subtitle="Leilões aguardando lançamento de resultados">
      <Card>
        <CardHeader>
          <CardTitle>Meus Leilões</CardTitle>
          <CardDescription>{filteredLeiloes.length} leilões designados para você</CardDescription>
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
                    <TableHead className="hidden sm:table-cell">Lotes</TableHead>
                    <TableHead>Resultados</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeiloes.map((leilao) => {
                    const lotesPendentes = leilao.lotes.filter(
                      (l) => l.status !== "ARREMATADO" && l.status !== "NAO_ARREMATADO",
                    ).length
                    return (
                      <TableRow key={leilao.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">{leilao.codigo}</TableCell>
                        <TableCell>
                          <p className="font-medium truncate max-w-[200px]">{leilao.titulo}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {leilao.data.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{leilao.lotes.length}</TableCell>
                        <TableCell>
                          {leilao.resultadosCompletos ? (
                            <span className="flex items-center gap-1 text-success text-sm">
                              <CheckCircle className="h-4 w-4" />
                              Completo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-warning text-sm">
                              <XCircle className="h-4 w-4" />
                              {lotesPendentes} pendentes
                            </span>
                          )}
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
              <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum leilão designado</p>
              <p className="text-sm mt-1">Aguarde a designação pelo administrador</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
