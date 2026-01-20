"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/context/app-context"
import { LayoutDashboard, Car, Gavel, FileText, ClipboardList, History, User, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Carros Aptos", icon: Car },
  { href: "/admin/auctioneers", label: "Leiloeiros", icon: Users },
  { href: "/admin/auctions", label: "Leilões", icon: Gavel },
  { href: "/admin/results", label: "Resultados", icon: FileText },
  { href: "/admin/accountability", label: "Prestação de Contas", icon: ClipboardList },
  { href: "/admin/audit", label: "Auditoria", icon: History },
]

const auctioneerLinks = [
  { href: "/auctioneer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/auctioneer/auctions", label: "Leilões Designados", icon: Gavel },
  { href: "/auctioneer/history", label: "Histórico", icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentUser, currentRole, setCurrentRole } = useApp()

  const links = currentRole === "admin" ? adminLinks : auctioneerLinks
  const roleLabel = currentRole === "admin" ? "Administrador" : "Leiloeiro"

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Gavel className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">SIGEL</h1>
          <p className="text-xs text-sidebar-foreground/60">Sistema de Leilões</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-accent-foreground">{currentUser.nome}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <p className="text-xs text-sidebar-foreground/60 px-2 mb-2">Trocar Perfil</p>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            currentRole === "admin"
              ? "bg-sidebar-primary/20 text-sidebar-foreground"
              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          )}
          onClick={() => {
            setCurrentRole("admin")
            window.location.href = "/admin/dashboard"
          }}
        >
          <User className="mr-2 h-4 w-4" />
          Admin
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            currentRole === "auctioneer"
              ? "bg-sidebar-primary/20 text-sidebar-foreground"
              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          )}
          onClick={() => {
            setCurrentRole("auctioneer")
            window.location.href = "/auctioneer/dashboard"
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          Leiloeiro
        </Button>
      </div>
    </aside>
  )
}
