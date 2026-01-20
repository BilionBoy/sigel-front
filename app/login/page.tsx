"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel, Shield, Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()

  const handleLogin = (role: "admin" | "auctioneer") => {
    login(role)
    router.push(role === "admin" ? "/admin/dashboard" : "/auctioneer/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
            <Gavel className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SIGEL</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Leilões</p>
          <p className="text-sm text-muted-foreground">Poder Executivo</p>
        </div>

        {/* Login Options */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Acesso ao Sistema</CardTitle>
            <CardDescription>Selecione seu perfil de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-auto py-4 px-4 flex items-start gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all bg-transparent"
              onClick={() => handleLogin("admin")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Administrador</p>
                <p className="text-sm text-muted-foreground">Gestão completa de leilões, carros e relatórios</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-auto py-4 px-4 flex items-start gap-4 border-2 hover:border-accent hover:bg-accent/5 transition-all bg-transparent"
              onClick={() => handleLogin("auctioneer")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Leiloeiro</p>
                <p className="text-sm text-muted-foreground">Lançamento de resultados dos leilões designados</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Sistema protótipo para demonstração de fluxo de leilão
        </p>
      </div>
    </div>
  )
}
