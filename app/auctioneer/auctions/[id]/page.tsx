"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle, XCircle, Edit } from "lucide-react"
import type { LoteStatus } from "@/lib/types"

export default function AuctioneerAuctionDetailPage() {
  const params = useParams()
  const { getLeilaoById, getCarroById, lancarResultadoLote } = useApp()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null)

  const [resultado, setResultado] = useState({
    status: "ARREMATADO" as LoteStatus,
    arrematante: "",
    documento: "",
    valorArremate: 0,
    observacao: "",
  })

  const leilao = getLeilaoById(params.id as string)

  if (!leilao) {
    return (
      <AppShell title="Leilão não encontrado" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground">O leilão solicitado não foi encontrado.</p>
          <Link href="/auctioneer/auctions">
            <Button variant="link" className="mt-4">
              Voltar para Leilões
            </Button>
          </Link>
        </div>
      </AppShell>
    )
  }

  const handleOpenDialog = (loteId: string) => {
    const lote = leilao.lotes.find((l) => l.id === loteId)
    if (lote?.resultado) {
      setResultado({
        status: lote.status as LoteStatus,
        arrematante: lote.resultado.arrematante || "",
        documento: lote.resultado.documento || "",
        valorArremate: lote.resultado.valorArremate || 0,
        observacao: lote.resultado.observacao || "",
      })
    } else {
      setResultado({
        status: "ARREMATADO",
        arrematante: "",
        documento: "",
        valorArremate: lote?.valorInicial || 0,
        observacao: "",
      })
    }
    setSelectedLoteId(loteId)
    setDialogOpen(true)
  }

  const handleSaveResultado = () => {
    if (selectedLoteId) {
      lancarResultadoLote(leilao.id, selectedLoteId, resultado)
      setDialogOpen(false)
      setSelectedLoteId(null)
    }
  }

  const lotesPendentes = leilao.lotes.filter((l) => l.status !== "ARREMATADO" && l.status !== "NAO_ARREMATADO").length

  return (
    <AppShell title={leilao.titulo} subtitle={`Código: ${leilao.codigo}`}>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/auctioneer/auctions">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leilao.lotes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lotes Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{lotesPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {leilao.resultadosCompletos ? (
              <span className="flex items-center gap-2 text-success font-medium">
                <CheckCircle className="h-5 w-5" />
                Completo
              </span>
            ) : (
              <span className="flex items-center gap-2 text-warning font-medium">
                <XCircle className="h-5 w-5" />
                Pendente
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lotes do Leilão</CardTitle>
          <CardDescription>Lance os resultados de cada lote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Lote</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead className="hidden md:table-cell">Placa</TableHead>
                  <TableHead className="text-right">Valor Inicial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Valor Arremate</TableHead>
                  <TableHead className="w-24">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leilao.lotes.map((lote) => {
                  const carro = getCarroById(lote.carroId)
                  const isLancado = lote.status === "ARREMATADO" || lote.status === "NAO_ARREMATADO"
                  return (
                    <TableRow key={lote.id} className="hover:bg-muted/50">
                      <TableCell className="font-bold">#{lote.numero}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {carro?.marca} {carro?.modelo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {carro?.ano} • {carro?.cor}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono">{carro?.placa}</TableCell>
                      <TableCell className="text-right">R$ {lote.valorInicial.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>
                        <StatusBadge status={lote.status} />
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        {lote.resultado?.valorArremate
                          ? `R$ ${lote.resultado.valorArremate.toLocaleString("pt-BR")}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={isLancado ? "ghost" : "default"}
                          size="sm"
                          onClick={() => handleOpenDialog(lote.id)}
                          className={isLancado ? "" : "bg-primary hover:bg-primary/90"}
                        >
                          {isLancado ? <Edit className="h-4 w-4" /> : "Lançar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for Result */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lançar Resultado do Lote</DialogTitle>
            <DialogDescription>Informe o resultado da arrematação</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label>Situação</Label>
              <RadioGroup
                value={resultado.status}
                onValueChange={(value) => setResultado({ ...resultado, status: value as LoteStatus })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ARREMATADO" id="arrematado" />
                  <Label htmlFor="arrematado" className="font-normal">
                    Arrematado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NAO_ARREMATADO" id="nao_arrematado" />
                  <Label htmlFor="nao_arrematado" className="font-normal">
                    Não Arrematado
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {resultado.status === "ARREMATADO" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="arrematante">Nome do Arrematante</Label>
                  <Input
                    id="arrematante"
                    placeholder="Nome completo ou razão social"
                    value={resultado.arrematante}
                    onChange={(e) => setResultado({ ...resultado, arrematante: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input
                    id="documento"
                    placeholder="000.000.000-00"
                    value={resultado.documento}
                    onChange={(e) => setResultado({ ...resultado, documento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor de Arremate (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={resultado.valorArremate || ""}
                    onChange={(e) => setResultado({ ...resultado, valorArremate: Number(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Observações sobre o lote..."
                value={resultado.observacao}
                onChange={(e) => setResultado({ ...resultado, observacao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveResultado}
              disabled={resultado.status === "ARREMATADO" && (!resultado.arrematante || !resultado.valorArremate)}
            >
              Salvar Resultado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
