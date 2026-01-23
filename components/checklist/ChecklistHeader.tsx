// components/checklist/ChecklistHeader.tsx
'use client';

import { ArrowLeft } from 'lucide-react';

interface Veiculo {
  numeroInterno: string;
  placa: string;
  chassi: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
}

interface ChecklistHeaderProps {
  veiculo: Veiculo;
  onVoltar?: () => void;
  onSalvarRascunho?: () => void;
  salvando?: boolean;
}

export function ChecklistHeader({
  veiculo,
  onVoltar,
  onSalvarRascunho,
  salvando = false,
}: ChecklistHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onVoltar && (
            <button
              onClick={onVoltar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-x font-semibold text-gray-900">Checklist</h1>
              {salvando && (
                <span className="text-xs text-emerald-600 animate-pulse">
                  Salvando...
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{veiculo.placa}</span>
              {' • '}
              <span>{veiculo.marca} {veiculo.modelo}</span>
              {' • '}
              <span>{veiculo.ano}</span>
              {' • '}
              <span className="capitalize">{veiculo.cor}</span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
