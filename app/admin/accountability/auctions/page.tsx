"use client"

import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Plus, Search, Eye, Filter, Gavel, CheckCircle, XCircle } from "lucide-react"

export default function AdminAuctionsPage() {
  const { leiloes, getLeiloeiroById } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredLeiloes = leiloes.filter((leilao) => {
    const matchesSearch =
      leilao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leilao.codigo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || leilao.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <AppShell title="Leilões" subtitle="Gerenciamento de leilões de veículos" requiredRole="admin">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Leilões</CardTitle>
              <CardDescription>
                {filteredLeiloes.length} leilões encontrados de {leiloes.length} total
              </CardDescription>
            </div>
            <Link href="/admin/auctions/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Leilão
              </Button>
            </Link>
          </div>
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
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="RASCUNHO">Rascunho</SelectItem>
                  <SelectItem value="PUBLICADO">Publicado</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Código</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden lg:table-cell">Leiloeiro</TableHead>
                  <TableHead className="hidden sm:table-cell">Lotes</TableHead>
                  <TableHead>Resultados</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeiloes.map((leilao) => {
                  const leiloeiro = getLeiloeiroById(leilao.leiloeiroId)
                  return (
                    <TableRow key={leilao.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">{leilao.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{leilao.titulo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{leilao.data.toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{leiloeiro?.nome}</TableCell>
                      <TableCell className="hidden sm:table-cell">{leilao.lotes.length}</TableCell>
                      <TableCell>
                        {leilao.status === "RASCUNHO" ? (
                          <span className="text-muted-foreground text-sm">-</span>
                        ) : leilao.resultadosCompletos ? (
                          <span className="flex items-center gap-1 text-success text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Sim
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-warning text-sm">
                            <XCircle className="h-4 w-4" />
                            Não
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={leilao.status} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/auctions/${leilao.id}`}>
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

          {filteredLeiloes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum leilão encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
