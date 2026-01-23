 
'use client';

import { CLASSIFICACOES, EtapaChecklist } from '../../types/checklist';

interface ChecklistConclusaoProps {
  etapas: EtapaChecklist[];
  onConfirmar: () => void;
  onCancelar: () => void;
  isOpen: boolean;
}

export function ChecklistConclusao({
  etapas,
  onConfirmar,
  onCancelar,
  isOpen,
}: ChecklistConclusaoProps) {
  if (!isOpen) return null;

  // Calcular estatísticas
  const estatisticas = etapas.reduce(
    (acc, etapa) => {
      etapa.itens.forEach((item) => {
        if (item.classificacao) {
          acc[item.classificacao] = (acc[item.classificacao] || 0) + 1;
          acc.total += 1;
        }
      });
      return acc;
    },
    { B: 0, R: 0, I: 0, F: 0, total: 0 }
  );

  const percentualBom = Math.round((estatisticas.B / estatisticas.total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2C4A3E] text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Resumo da Verificação</h2>
          <p className="text-sm opacity-90 mt-1">
            Revise antes de finalizar
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Estatísticas gerais */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Classificação dos Itens
            </h3>
            <div className="space-y-2">
              {(['B', 'R', 'I', 'F'] as const).map((codigo) => {
                const config = CLASSIFICACOES[codigo];
                const quantidade = estatisticas[codigo];
                const percentual = Math.round((quantidade / estatisticas.total) * 100);

                return (
                  <div key={codigo} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${config.bgColor} ${config.color} rounded flex items-center justify-center font-bold`}
                    >
                      {codigo}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{config.descricao}</span>
                        <span className="font-semibold text-gray-900">
                          {quantidade} ({percentual}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${config.bgColor}`}
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estado de conservação estimado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Estado de Conservação Estimado
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      percentualBom >= 80
                        ? 'bg-green-500'
                        : percentualBom >= 60
                        ? 'bg-yellow-500'
                        : percentualBom >= 40
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${percentualBom}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {percentualBom}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {percentualBom >= 80
                ? 'Excelente - Veículo em ótimo estado'
                : percentualBom >= 60
                ? 'Bom - Veículo em bom estado de conservação'
                : percentualBom >= 40
                ? 'Regular - Veículo necessita reparos'
                : 'Crítico - Veículo em estado precário'}
            </p>
          </div>

          {/* Resumo por etapa */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Por Etapa</h3>
            <div className="space-y-2">
              {etapas.map((etapa) => {
                const concluidos = etapa.itens.filter(
                  (item) => item.classificacao
                ).length;
                const total = etapa.itens.length;
                const percentual = Math.round((concluidos / total) * 100);

                return (
                  <div
                    key={etapa.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{etapa.descricao}</span>
                    <span className="font-medium text-gray-900">
                      {concluidos}/{total} ({percentual}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Atenção</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Após finalizar, o checklist não poderá ser editado.
                  Certifique-se de que todas as informações estão corretas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Revisar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="flex-1 py-3 px-4 bg-[#2C4A3E] text-white rounded-lg font-medium hover:bg-[#234032] transition-colors"
          >
            Finalizar Checklist
          </button>
        </div>
      </div>
    </div>
  );
}
