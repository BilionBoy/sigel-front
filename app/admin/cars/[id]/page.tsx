"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Hash, Palette, Car, DollarSign, Clock } from "lucide-react"

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getCarroById, auditoria } = useApp()

  const carro = getCarroById(id)

  if (!carro) {
    return (
      <AppShell title="Veículo não encontrado" requiredRole="admin">
        <div className="text-center py-12">
          <p className="text-muted-foreground">O veículo solicitado não foi encontrado.</p>
          <Link href="/admin/cars">
            <Button className="mt-4">Voltar para lista</Button>
          </Link>
        </div>
      </AppShell>
    )
  }

  // Get audit events for this car
  const carroAuditEvents = auditoria.filter((a) => a.entidadeId === carro.id || a.detalhes.includes(carro.placa))

  return (
    <AppShell title={`${carro.marca} ${carro.modelo}`} subtitle={`Placa: ${carro.placa}`} requiredRole="admin">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos do Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {carro.fotos.map((foto, index) => (
                  <Image
                    key={index}
                    src={foto || "/placeholder.svg"}
                    alt={`${carro.marca} ${carro.modelo} - Foto ${index + 1}`}
                    width={400}
                    height={300}
                    className="rounded-lg object-cover w-full aspect-video"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Completos</CardTitle>
              <CardDescription>Informações detalhadas do veículo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Placa</p>
                      <p className="font-mono font-semibold">{carro.placa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chassi</p>
                      <p className="font-mono text-sm">{carro.chassi}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Veículo</p>
                      <p className="font-semibold">
                        {carro.marca} {carro.modelo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ano</p>
                      <p className="font-semibold">{carro.ano}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Palette className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cor</p>
                      <p className="font-semibold">{carro.cor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Inicial</p>
                      <p className="font-semibold">R$ {carro.valorInicial.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Situação</span>
                <StatusBadge status={carro.status} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium">{carro.tipo}</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  Cadastrado em:{" "}
                  {carro.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico
              </CardTitle>
              <CardDescription>Alterações recentes</CardDescription>
            </CardHeader>
            <CardContent>
              {carroAuditEvents.length > 0 ? (
                <div className="space-y-4">
                  {carroAuditEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="border-l-2 border-primary/20 pl-4 py-1">
                      <p className="text-sm font-medium">{event.acao}</p>
                      <p className="text-xs text-muted-foreground">{event.detalhes}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.data.toLocaleDateString("pt-BR")} às{" "}
                        {event.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum evento registrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
