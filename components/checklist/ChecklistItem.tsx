// components/checklist/ChecklistItem.tsx
'use client';

import { ItemChecklist, CLASSIFICACOES } from '@/hooks/useChecklist';

interface ChecklistItemProps {
  item: ItemChecklist;
  onClassificar: (classificacao: 'B' | 'R' | 'I' | 'F') => void;
  onObservacao?: (observacao: string) => void;
}

export function ChecklistItem({
  item,
  onClassificar,
  onObservacao,
}: ChecklistItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{item.descricao}</h3>
          {item.classificacao && (
            <div className="mt-1">
              <span
                className={`
                  inline-flex items-center px-2 py-1 rounded text-xs font-medium
                  ${CLASSIFICACOES.find((c) => c.codigo === item.classificacao)?.bgColor}
                  ${CLASSIFICACOES.find((c) => c.codigo === item.classificacao)?.textColor}
                `}
              >
                {CLASSIFICACOES.find((c) => c.codigo === item.classificacao)?.descricao}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botões de classificação */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {CLASSIFICACOES.map((classificacao) => {
          const isSelected = item.classificacao === classificacao.codigo;

          return (
            <button
              key={classificacao.codigo}
              onClick={() => onClassificar(classificacao.codigo)}
              className={`
                px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200
                ${
                  isSelected
                    ? `${classificacao.cor} text-white ring-2 ring-offset-2 ${classificacao.cor.replace('bg-', 'ring-')}`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }
              `}
            >
              {classificacao.codigo}
            </button>
          );
        })}
      </div>

      {/* Campo de observação (opcional) */}
      {item.classificacao && (item.classificacao === 'R' || item.classificacao === 'I' || item.classificacao === 'F') && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Observação {item.classificacao !== 'B' ? '(recomendada)' : '(opcional)'}
          </label>
          <textarea
            value={item.observacao || ''}
            onChange={(e) => onObservacao?.(e.target.value)}
            placeholder="Adicione detalhes sobre o problema..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      )}
    </div>
  );
}
