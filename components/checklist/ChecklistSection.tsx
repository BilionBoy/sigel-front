// components/checklist/ChecklistSection.tsx
'use client';

import { EtapaChecklist } from '@/hooks/useChecklist';
import { ChecklistItem } from './ChecklistItem';
import { AlertCircle } from 'lucide-react';

interface ChecklistSectionProps {
  etapa: EtapaChecklist;
  progresso: number;
  atualizarItem: (itemId: number, classificacao: 'B' | 'R' | 'I' | 'F', observacao?: string) => void;
  etapaCompleta: boolean;
}

export function ChecklistSection({
  etapa,
  progresso,
  atualizarItem,
  etapaCompleta,
}: ChecklistSectionProps) {
  return (
    <div className="min-h-full bg-gray-50">
      {/* ✅ Cabeçalho STICKY da etapa */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-900">{etapa.descricao}</h2>
              <span className="text-xs font-bold text-emerald-600">{progresso}%</span>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  progresso === 100 ? 'bg-emerald-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${progresso}%` }}
              />
            </div>

            {/* Contador de itens */}
            <div className="text-xs text-gray-600 text-center font-medium">
              {etapa.itens.filter((i) => i.classificacao).length} de {etapa.itens.length} itens classificados
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Conteúdo (SEM overflow próprio) */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Aviso se não completo */}
          {!etapaCompleta && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Classifique todos os itens antes de avançar para a próxima etapa.
              </p>
            </div>
          )}

          {/* Lista de itens */}
          <div className="space-y-3">
            {etapa.itens.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onClassificar={(classificacao) => atualizarItem(item.id, classificacao, item.observacao)}
                onObservacao={(observacao) => atualizarItem(item.id, item.classificacao!, observacao)}
              />
            ))}
          </div>

          {/* Espaço extra no final para respirar */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
