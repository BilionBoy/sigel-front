// app/checklist/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checklist - SIGEL',
  description: 'Sistema de verificação de veículos',
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
