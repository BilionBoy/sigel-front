"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  DollarSign,
  Users,
  Package,
} from "lucide-react"

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    getLeilaoById,
    getLeiloeiroById,
    getCarrosAptos,
    getCarroById,
    vincularCarrosAoLeilao,
    removerLoteDoLeilao,
    publicarLeilao,
    finalizarLeilao,
    gerarPrestacaoContas,
    prestacoesContas,
  } = useApp()

  const [activeTab, setActiveTab] = useState("resumo")
  const [selectedCarros, setSelectedCarros] = useState<string[]>([])
  const [publicacaoDialogOpen, setPublicacaoDialogOpen] = useState(false)
  const [publicacaoData, setPublicacaoData] = useState({
    data: new Date().toISOString().split("T")[0],
    local: "",
  })

  const leilao = getLeilaoById(id)
  const leiloeiro = leilao ? getLeiloeiroById(leilao.leiloeiroId) : null
  const carrosAptos = getCarrosAptos()

  // Get prestação de contas for this auction
  const prestacoes = prestacoesContas.filter((p) => p.leilaoId === id)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  if (!leilao) {
    return (
      <AppShell title="Leilão não encontrado" requiredRole="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground">O leilão solicitado não foi encontrado.</p>
          <Link href="/admin/auctions">
            <Button className="mt-4">Voltar para lista</Button>
          </Link>
        </div>
      </AppShell>
    )
  }

  const handleVincularCarros = () => {
    if (selectedCarros.length > 0) {
      vincularCarrosAoLeilao(leilao.id, selectedCarros)
      setSelectedCarros([])
    }
  }

  const handlePublicar = () => {
    if (publicacaoData.local) {
      publicarLeilao(leilao.id, {
        data: new Date(publicacaoData.data),
        local: publicacaoData.local,
      })
      setPublicacaoDialogOpen(false)
    }
  }

  const handleFinalizar = () => {
    finalizarLeilao(leilao.id)
  }

  const canFinalizar = leilao.status === "PUBLICADO" && leilao.resultadosCompletos

  // Calculate stats
  const totalLotes = leilao.lotes.length
  const lotesArrematados = leilao.lotes.filter((l) => l.status === "ARREMATADO").length
  const lotesNaoArrematados = leilao.lotes.filter((l) => l.status === "NAO_ARREMATADO").length
  const totalArrecadado = leilao.lotes.reduce((sum, l) => sum + (l.resultado?.valorArremate || 0), 0)

  return (
    <AppShell title={leilao.titulo} subtitle={`Código: ${leilao.codigo}`} requiredRole="admin">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <StatusBadge status={leilao.status} className="text-sm px-3 py-1.5" />
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${leilao.status === "RASCUNHO" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">
                1
              </div>
              Rascunho
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${leilao.status === "PUBLICADO" ? "bg-info text-info-foreground" : leilao.status === "FINALIZADO" ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground/50"}`}
            >
              <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">
                2
              </div>
              Publicado
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${leilao.status === "FINALIZADO" ? "bg-success text-success-foreground" : "bg-muted/50 text-muted-foreground/50"}`}
            >
              <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">
                3
              </div>
              Finalizado
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="lotes">Carros/Lotes</TabsTrigger>
          <TabsTrigger value="publicacao">Publicação</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
          <TabsTrigger value="prestacao">Prestação de Contas</TabsTrigger>
        </TabsList>

        {/* RESUMO TAB */}
        <TabsContent value="resumo">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total de Lotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalLotes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leiloeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{leiloeiro?.nome}</div>
                <p className="text-sm text-muted-foreground">{leiloeiro?.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Arrecadado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {leilao.status === "FINALIZADO" ? `R$ ${totalArrecadado.toLocaleString("pt-BR")}` : "-"}
                </div>
              </CardContent>
            </Card>

            {/* Results summary for finalized */}
            {leilao.status === "FINALIZADO" && (
              <>
                <Card className="border-success/30 bg-success/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-2xl font-bold">{lotesArrematados}</p>
                        <p className="text-sm text-muted-foreground">Lotes Arrematados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-destructive" />
                      <div>
                        <p className="text-2xl font-bold">{lotesNaoArrematados}</p>
                        <p className="text-sm text-muted-foreground">Não Arrematados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Awaiting results warning */}
            {leilao.status === "PUBLICADO" && !leilao.resultadosCompletos && (
              <Card className="lg:col-span-3 border-warning/50 bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                    <div>
                      <p className="font-semibold">Aguardando leiloeiro lançar resultados</p>
                      <p className="text-sm text-muted-foreground">
                        O leiloeiro {leiloeiro?.nome} ainda não preencheu os resultados de todos os lotes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Auction Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Detalhes do Leilão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-mono font-medium">{leilao.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data do Leilão</p>
                  <p className="font-medium">{leilao.data.toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{leilao.observacoes || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOTES TAB */}
        <TabsContent value="lotes">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Available Cars */}
            {leilao.status === "RASCUNHO" && (
              <Card>
                <CardHeader>
                  <CardTitle>Carros Aptos Disponíveis</CardTitle>
                  <CardDescription>Selecione os carros para vincular ao leilão</CardDescription>
                </CardHeader>
                <CardContent>
                  {carrosAptos.length > 0 ? (
                    <>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {carrosAptos.map((carro) => (
                          <div
                            key={carro.id}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50"
                          >
                            <Checkbox
                              id={carro.id}
                              checked={selectedCarros.includes(carro.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCarros([...selectedCarros, carro.id])
                                } else {
                                  setSelectedCarros(selectedCarros.filter((id) => id !== carro.id))
                                }
                              }}
                            />
                            <Image
                              src={carro.fotos[0] || "/placeholder.svg"}
                              alt={carro.placa}
                              width={60}
                              height={40}
                              className="rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">
                                {carro.marca} {carro.modelo}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {carro.placa} • {carro.ano} • R$ {carro.valorInicial.toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4 bg-primary hover:bg-primary/90"
                        onClick={handleVincularCarros}
                        disabled={selectedCarros.length === 0}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Vincular {selectedCarros.length} Carro(s) Selecionado(s)
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Nenhum carro apto disponível</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Linked Lots */}
            <Card className={leilao.status !== "RASCUNHO" ? "lg:col-span-2" : ""}>
              <CardHeader>
                <CardTitle>Lotes do Leilão</CardTitle>
                <CardDescription>
                  {leilao.lotes.length} lote(s) vinculado(s) • Valor total inicial: R${" "}
                  {leilao.lotes.reduce((sum, l) => sum + l.valorInicial, 0).toLocaleString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leilao.lotes.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-16">Nº</TableHead>
                          <TableHead>Veículo</TableHead>
                          <TableHead className="hidden md:table-cell">Placa</TableHead>
                          <TableHead className="text-right">Valor Inicial</TableHead>
                          <TableHead>Status</TableHead>
                          {leilao.status === "RASCUNHO" && <TableHead className="w-16"></TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leilao.lotes.map((lote) => {
                          const carro = getCarroById(lote.carroId)
                          return (
                            <TableRow key={lote.id}>
                              <TableCell className="font-bold text-lg">{lote.numero}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={carro?.fotos[0] || "/placeholder.svg"}
                                    alt={carro?.placa || ""}
                                    width={50}
                                    height={35}
                                    className="rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {carro?.marca} {carro?.modelo}
                                    </p>
                                    <p className="text-sm text-muted-foreground md:hidden">{carro?.placa}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell font-mono">{carro?.placa}</TableCell>
                              <TableCell className="text-right">
                                R$ {lote.valorInicial.toLocaleString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={lote.status} />
                              </TableCell>
                              {leilao.status === "RASCUNHO" && (
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => removerLoteDoLeilao(leilao.id, lote.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhum lote vinculado</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PUBLICAÇÃO TAB */}
        <TabsContent value="publicacao">
          <Card>
            <CardHeader>
              <CardTitle>Publicação do Edital</CardTitle>
              <CardDescription>
                {leilao.status === "RASCUNHO"
                  ? "Gere o edital e registre a publicação para iniciar o leilão"
                  : "Informações da publicação do edital"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Edital Preview */}
              <div className="p-6 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Preview do Edital
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Leilão:</strong> {leilao.titulo}
                  </p>
                  <p>
                    <strong>Código:</strong> {leilao.codigo}
                  </p>
                  <p>
                    <strong>Data:</strong> {leilao.data.toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Leiloeiro:</strong> {leiloeiro?.nome}
                  </p>
                  <p>
                    <strong>Total de Lotes:</strong> {leilao.lotes.length}
                  </p>
                  {leilao.lotes.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Lotes:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {leilao.lotes.map((lote) => {
                          const carro = getCarroById(lote.carroId)
                          return (
                            <li key={lote.id}>
                              Lote {lote.numero}: {carro?.marca} {carro?.modelo} ({carro?.placa}) - R${" "}
                              {lote.valorInicial.toLocaleString("pt-BR")}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {leilao.status === "RASCUNHO" ? (
                <div className="flex gap-4">
                  <Button variant="outline" disabled={leilao.lotes.length === 0} className="bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={leilao.lotes.length === 0}
                    onClick={() => setPublicacaoDialogOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Registrar Publicação
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-lg border bg-success/5 border-success/30">
                  <h4 className="font-semibold flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Edital Publicado
                  </h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Data:</strong> {leilao.publicacao?.data.toLocaleDateString("pt-BR")}
                    </p>
                    <p>
                      <strong>Local:</strong> {leilao.publicacao?.local}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publication Dialog */}
          <Dialog open={publicacaoDialogOpen} onOpenChange={setPublicacaoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Publicação</DialogTitle>
                <DialogDescription>Informe os dados da publicação do edital</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="pub-data">Data da Publicação</Label>
                  <Input
                    id="pub-data"
                    type="date"
                    value={publicacaoData.data}
                    onChange={(e) => setPublicacaoData({ ...publicacaoData, data: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pub-local">Local/Veículo de Publicação</Label>
                  <Input
                    id="pub-local"
                    placeholder="Ex: Diário Oficial - Edição 1234"
                    value={publicacaoData.local}
                    onChange={(e) => setPublicacaoData({ ...publicacaoData, local: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPublicacaoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handlePublicar}
                  disabled={!publicacaoData.local}
                >
                  Publicar Leilão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* RESULTADOS TAB */}
        <TabsContent value="resultados">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados do Leilão</CardTitle>
                  <CardDescription>
                    {leilao.resultadosCompletos
                      ? "Todos os lotes tiveram resultados lançados"
                      : "Aguardando lançamento de resultados pelo leiloeiro"}
                  </CardDescription>
                </div>
                <StatusBadge status={leilao.resultadosCompletos ? "completo" : "pendente"} />
              </div>
            </CardHeader>
            <CardContent>
              {leilao.lotes.length > 0 ? (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-16">Lote</TableHead>
                          <TableHead>Veículo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Arrematante</TableHead>
                          <TableHead className="text-right">Valor Arrematado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leilao.lotes.map((lote) => {
                          const carro = getCarroById(lote.carroId)
                          return (
                            <TableRow key={lote.id}>
                              <TableCell className="font-bold">{lote.numero}</TableCell>
                              <TableCell>
                                {carro?.marca} {carro?.modelo} ({carro?.placa})
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={lote.status} />
                              </TableCell>
                              <TableCell>
                                {lote.resultado?.arrematante ? (
                                  <div>
                                    <p className="font-medium">{lote.resultado.arrematante}</p>
                                    <p className="text-xs text-muted-foreground">{lote.resultado.documento}</p>
                                  </div>
                                ) : lote.resultado?.observacao ? (
                                  <p className="text-muted-foreground text-sm">{lote.resultado.observacao}</p>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {lote.resultado?.valorArremate
                                  ? `R$ ${lote.resultado.valorArremate.toLocaleString("pt-BR")}`
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Finalize button */}
                  {leilao.status === "PUBLICADO" && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        disabled={!canFinalizar}
                        onClick={handleFinalizar}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Finalizar Leilão
                      </Button>
                    </div>
                  )}
                  {leilao.status === "PUBLICADO" && !leilao.resultadosCompletos && (
                    <p className="text-sm text-muted-foreground mt-2 text-right">
                      Não é possível finalizar enquanto houver lotes sem resultado
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum lote neste leilão</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRESTAÇÃO DE CONTAS TAB */}
        <TabsContent value="prestacao">
          <Card>
            <CardHeader>
              <CardTitle>Prestação de Contas</CardTitle>
              <CardDescription>Gere relatórios consolidados do leilão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {leilao.status === "FINALIZADO" ? (
                <>
                  <div className="flex gap-4">
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => gerarPrestacaoContas(leilao.id, "pdf")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Gerar PDF
                    </Button>
                    <Button variant="outline" onClick={() => gerarPrestacaoContas(leilao.id, "planilha")}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Planilha
                    </Button>
                  </div>

                  {/* Generated reports */}
                  {prestacoes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Relatórios Gerados</h4>
                      <div className="space-y-2">
                        {prestacoes.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  Prestação de Contas v{p.versao} ({p.tipo.toUpperCase()})
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Gerado por {p.usuario} em {p.dataGeracao.toLocaleDateString("pt-BR")} às{" "}
                                  {p.dataGeracao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Prestação de contas disponível apenas para leilões finalizados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
