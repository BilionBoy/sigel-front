"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface AppShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Topbar title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
