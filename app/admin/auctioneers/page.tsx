"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Users, Trash2, Edit } from "lucide-react"

export default function AdminAuctioneersPage() {
  const { leiloeiros, addLeiloeiro, updateLeiloeiro, deleteLeiloeiro } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    nome: "",
    email: "",
    ativo: true,
  })

  const filteredLeiloeiros = leiloeiros.filter((l) => {
    return (
      l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSubmit = () => {
    if (editingId) {
      updateLeiloeiro(editingId, form)
    } else {
      addLeiloeiro(form)
    }
    setForm({ nome: "", email: "", ativo: true })
    setEditingId(null)
    setDialogOpen(false)
  }

  const handleEdit = (id: string) => {
    const leiloeiro = leiloeiros.find((l) => l.id === id)
    if (leiloeiro) {
      setForm({ nome: leiloeiro.nome, email: leiloeiro.email, ativo: leiloeiro.ativo })
      setEditingId(id)
      setDialogOpen(true)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este leiloeiro?")) {
      deleteLeiloeiro(id)
    }
  }

  return (
    <AppShell title="Leiloeiros" subtitle="Gerenciamento de leiloeiros do sistema">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Leiloeiros</CardTitle>
              <CardDescription>{filteredLeiloeiros.length} leiloeiros cadastrados</CardDescription>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) {
                  setForm({ nome: "", email: "", ativo: true })
                  setEditingId(null)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Leiloeiro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar Leiloeiro" : "Adicionar Leiloeiro"}</DialogTitle>
                  <DialogDescription>
                    {editingId ? "Atualize os dados do leiloeiro" : "Cadastre um novo leiloeiro no sistema"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      placeholder="Nome do leiloeiro"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.gov.br"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ativo">Ativo</Label>
                    <Switch
                      id="ativo"
                      checked={form.ativo}
                      onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSubmit}
                    disabled={!form.nome || !form.email}
                  >
                    {editingId ? "Salvar" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {filteredLeiloeiros.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeiloeiros.map((leiloeiro) => (
                    <TableRow key={leiloeiro.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{leiloeiro.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{leiloeiro.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            leiloeiro.ativo ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {leiloeiro.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(leiloeiro.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(leiloeiro.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum leiloeiro cadastrado</p>
              <p className="text-sm mt-1">Adicione leiloeiros para designá-los aos leilões</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
