"use client"

import { useApp } from "@/lib/context/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Key } from "lucide-react"

export default function ProfilePage() {
  const { currentUser } = useApp()

  return (
    <AppShell title="Meu Perfil" subtitle="Gerencie suas informações de conta">
      <div className="max-w-2xl space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Seus dados cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentUser?.nome}</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {currentUser?.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4" />
                  {currentUser?.role === "admin" ? "Administrador" : "Leiloeiro"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>Atualize sua senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Senha Atual</Label>
              <Input id="current" type="password" placeholder="••••••••" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="new">Nova Senha</Label>
              <Input id="new" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar Nova Senha</Label>
              <Input id="confirm" type="password" placeholder="••••••••" />
            </div>
            <Button className="bg-primary hover:bg-primary/90">Salvar Nova Senha</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
