import { cn } from "@/lib/utils"

type StatusVariant =
  | "rascunho"
  | "publicado"
  | "finalizado"
  | "apto"
  | "vinculado"
  | "arrematado"
  | "nao_arrematado"
  | "pendente"
  | "completo"

const variantStyles: Record<StatusVariant, string> = {
  rascunho: "bg-muted text-muted-foreground",
  publicado: "bg-info/20 text-info-foreground border-info/30",
  finalizado: "bg-success/20 text-success-foreground border-success/30",
  apto: "bg-success/20 text-success-foreground border-success/30",
  vinculado: "bg-info/20 text-info-foreground border-info/30",
  arrematado: "bg-accent/20 text-accent-foreground border-accent/30",
  nao_arrematado: "bg-destructive/20 text-destructive-foreground border-destructive/30",
  pendente: "bg-warning/20 text-warning-foreground border-warning/30",
  completo: "bg-success/20 text-success-foreground border-success/30",
}

const variantLabels: Record<StatusVariant, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  finalizado: "Finalizado",
  apto: "Apto",
  vinculado: "Vinculado",
  arrematado: "Arrematado",
  nao_arrematado: "Não Arrematado",
  pendente: "Pendente",
  completo: "Completo",
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/_/g, "_") as StatusVariant
  const variant = variantStyles[normalizedStatus] || variantStyles.rascunho
  const label = variantLabels[normalizedStatus] || status

  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border", variant, className)}
    >
      {label}
    </span>
  )
}
