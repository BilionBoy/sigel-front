"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { leiloeiros } from "@/lib/mock-data"
import type { LeilaoStatus } from "@/lib/types"

export default function NewAuctionPage() {
  const router = useRouter()
  const { createLeilao } = useApp()

  const [formData, setFormData] = useState({
    titulo: "",
    codigo: `LEI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
    data: "",
    observacoes: "",
    leiloeiroId: "",
  })

  const activeLeiloeiros = leiloeiros.filter((l) => l.ativo)

  const handleSaveRascunho = () => {
    if (!formData.titulo || !formData.leiloeiroId || !formData.data) {
      return
    }

    const newId = createLeilao({
      titulo: formData.titulo,
      codigo: formData.codigo,
      data: new Date(formData.data),
      observacoes: formData.observacoes,
      leiloeiroId: formData.leiloeiroId,
      status: "RASCUNHO" as LeilaoStatus,
    })

    router.push(`/admin/auctions/${newId}`)
  }

  const handleAvancar = () => {
    if (!formData.titulo || !formData.leiloeiroId || !formData.data) {
      return
    }

    const newId = createLeilao({
      titulo: formData.titulo,
      codigo: formData.codigo,
      data: new Date(formData.data),
      observacoes: formData.observacoes,
      leiloeiroId: formData.leiloeiroId,
      status: "RASCUNHO" as LeilaoStatus,
    })

    router.push(`/admin/auctions/${newId}?tab=lotes`)
  }

  const isValid = formData.titulo && formData.leiloeiroId && formData.data

  return (
    <AppShell title="Criar Novo Leilão" subtitle="Configure os dados do leilão" requiredRole="admin">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Leilão</CardTitle>
            <CardDescription>Preencha as informações básicas do leilão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" value={formData.codigo} disabled className="bg-muted font-mono" />
                <p className="text-xs text-muted-foreground">Gerado automaticamente</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">
                  Data do Leilão <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                placeholder="Ex: Leilão de Veículos - Secretaria de Administração"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leiloeiro">
                Leiloeiro Designado <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.leiloeiroId} onValueChange={(v) => setFormData({ ...formData, leiloeiroId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o leiloeiro" />
                </SelectTrigger>
                <SelectContent>
                  {activeLeiloeiros.map((leiloeiro) => (
                    <SelectItem key={leiloeiro.id} value={leiloeiro.id}>
                      {leiloeiro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais sobre o leilão..."
                rows={4}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleSaveRascunho} disabled={!isValid} className="bg-transparent">
                <Save className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleAvancar} disabled={!isValid}>
                Avançar para Selecionar Carros
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
