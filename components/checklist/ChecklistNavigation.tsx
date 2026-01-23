// components/checklist/ChecklistNavigation.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChecklistNavigationProps {
  podeVoltar: boolean;
  podeAvancar: boolean;
  etapaAtual: number;
  totalEtapas: number;
  etapaCompleta: boolean;
  onVoltar: () => void;
  onAvancar: () => void;
  onFinalizar?: () => void;
  finalizando?: boolean;
}

export function ChecklistNavigation({
  podeVoltar,
  podeAvancar,
  etapaAtual,
  totalEtapas,
  etapaCompleta,
  onVoltar,
  onAvancar,
  onFinalizar,
  finalizando = false,
}: ChecklistNavigationProps) {
  const isUltimaEtapa = etapaAtual === totalEtapas - 1;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Botão Anterior */}
          <button
            onClick={onVoltar}
            disabled={!podeVoltar}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                podeVoltar
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Indicador de página */}
          <div className="text-sm text-gray-600">
            Etapa <span className="font-semibold">{etapaAtual + 1}</span> de{' '}
            <span className="font-semibold">{totalEtapas}</span>
          </div>

          {/* Botão Próximo ou Finalizar */}
          {isUltimaEtapa && etapaCompleta ? (
            <button
              onClick={onFinalizar}
              disabled={finalizando}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                ${
                  finalizando
                    ? 'bg-emerald-400 text-white cursor-wait'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }
              `}
            >
              {finalizando ? 'Finalizando...' : 'Finalizar Checklist'}
            </button>
          ) : (
            <button
              onClick={onAvancar}
              disabled={!podeAvancar || !etapaCompleta}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  podeAvancar && etapaCompleta
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span className="hidden sm:inline">Próximo</span>
              <span className="sm:hidden">Próximo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Aviso quando não pode avançar */}
        {!etapaCompleta && (
          <div className="mt-1 text-center">
            <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
              ⚠️ Complete todos os itens desta etapa para continuar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
