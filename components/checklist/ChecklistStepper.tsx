// components/checklist/ChecklistStepper.tsx
'use client';

import { Check } from 'lucide-react';
import { EtapaChecklist } from '@/hooks/useChecklist';

interface ChecklistStepperProps {
  etapas: EtapaChecklist[];
  etapaAtual: number;
  calcularProgressoEtapa: (etapa: EtapaChecklist) => number;
  onEtapaClick?: (index: number) => void;
}

export function ChecklistStepper({
  etapas,
  etapaAtual,
  calcularProgressoEtapa,
  onEtapaClick,
}: ChecklistStepperProps) {
  const handleEtapaClick = (index: number) => {
    if (onEtapaClick) {
      onEtapaClick(index);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="text-xs font-medium text-gray-600 mb-2">
          Etapa {etapaAtual + 1} de {etapas.length}
        </div>

        {/* Progress bar geral */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((etapaAtual + 1) / etapas.length) * 100}%` }}
          />
        </div>

        {/* Círculos numerados - centralizados em telas grandes */}
        <div className="flex justify-center">
          <div className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar max-w-full">
            {etapas.map((etapa, index) => {
              const progresso = calcularProgressoEtapa(etapa);
              const isAtual = index === etapaAtual;
              const isCompleta = progresso === 100;
              const isPast = index < etapaAtual;

              return (
                <button
                  key={etapa.id}
                  onClick={() => handleEtapaClick(index)}
                  disabled={!onEtapaClick}
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-200
                    ${
                      isAtual
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110'
                        : isCompleta
                        ? 'bg-emerald-500 text-white'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }
                    ${onEtapaClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                >
                  {isCompleta ? <Check className="w-5 h-5" /> : index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Título da etapa atual */}
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-gray-700">
            {etapas[etapaAtual]?.descricao}
          </p>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}