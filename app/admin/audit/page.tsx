"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, History, User, Gavel, Car, Package } from "lucide-react"

export default function AdminAuditPage() {
  const { auditoria } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredAuditoria = auditoria.filter((event) => {
    const matchesSearch =
      event.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.usuario.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEntity = entityFilter === "all" || event.entidade === entityFilter
    const matchesRole = roleFilter === "all" || event.usuarioRole === roleFilter

    return matchesSearch && matchesEntity && matchesRole
  })

  const getEntityIcon = (entidade: string) => {
    switch (entidade) {
      case "leilao":
        return <Gavel className="h-4 w-4" />
      case "carro":
        return <Car className="h-4 w-4" />
      case "lote":
        return <Package className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  return (
    <AppShell title="Auditoria" subtitle="Histórico de ações do sistema" requiredRole="admin">
      <Card>
        <CardHeader>
          <CardTitle>Log de Auditoria</CardTitle>
          <CardDescription>{filteredAuditoria.length} eventos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ação, detalhes ou usuário..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Entidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="leilao">Leilão</SelectItem>
                  <SelectItem value="carro">Carro</SelectItem>
                  <SelectItem value="lote">Lote</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="auctioneer">Leiloeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {filteredAuditoria.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-40">Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead className="hidden md:table-cell">Entidade</TableHead>
                    <TableHead className="hidden lg:table-cell">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditoria.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/50">
                      <TableCell className="text-sm">
                        <div>
                          <p className="font-medium">{event.data.toLocaleDateString("pt-BR")}</p>
                          <p className="text-muted-foreground">
                            {event.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              event.usuarioRole === "admin" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                            }`}
                          >
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{event.usuario}</p>
                            <p className="text-xs text-muted-foreground capitalize">{event.usuarioRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{event.acao}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getEntityIcon(event.entidade)}
                          <span className="capitalize">{event.entidade}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{event.detalhes}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
