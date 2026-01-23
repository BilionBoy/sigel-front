// app/vistorias/[id]/checklist/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useChecklist } from '@/hooks/useChecklist';
import { ChecklistHeader } from '@/components/checklist/ChecklistHeader';
import { ChecklistStepper } from '@/components/checklist/ChecklistStepper';
import { ChecklistSection } from '@/components/checklist/ChecklistSection';
import { ChecklistNavigation } from '@/components/checklist/ChecklistNavigation';
import { useState, useRef, useEffect } from 'react';

// Dados mockados do veículo (substitua pela chamada à API)
const VEICULO_MOCK = {
  id: 1,
  numeroInterno: 'ABC-1D23',
  placa: 'ABC-1D23',
  chassi: '9BWZZZ1234567890',
  renavam: '12345678901',
  marca: 'VW',
  modelo: 'Gol',
  ano: 2018,
  cor: 'prata',
};

export default function ChecklistPage() {
  const router = useRouter();
  const params = useParams();
  const vistoriaId = params?.id ? Number(params.id) : undefined;

  const [finalizando, setFinalizando] = useState(false);
  const [ultimoSave, setUltimoSave] = useState<Date | null>(null);
  
  // ✅ Ref para o container principal de scroll
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Hook do checklist com auto-save REAL e ref de scroll
  const {
    etapas,
    etapaAtual,
    setEtapaAtual,
    loading,
    autoSaving,
    atualizarItem,
    proximaEtapa,
    etapaAnterior,
    podeAvancar,
    podeVoltar,
    etapaCompleta,
    calcularProgressoEtapa,
    progressoTotal,
    checklistCompleto,
    obterResumo,
  } = useChecklist({
    vistoriaId,
    scrollContainerRef: mainScrollRef, // ✅ Passa a ref
    onAutoSave: async (etapas) => {
      // ✅ SALVAMENTO REAL NA API
      console.log('🔄 Salvando na API...', { 
        vistoriaId, 
        progresso: calcularProgressoTotal(etapas),
        totalItensClassificados: contarItensClassificados(etapas)
      });
      
      try {
        // TODO: Descomente quando sua API estiver pronta
        // await vistoriasApi.update(vistoriaId!, {
        //   etapas: etapas,
        //   progresso: calcularProgressoTotal(etapas),
        //   status: 'em_andamento',
        //   ultima_atualizacao: new Date().toISOString()
        // });
        
        // Por enquanto, simula delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUltimoSave(new Date());
        console.log('✅ Salvo com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao salvar:', error);
      }
    },
  });

  const etapaAtualData = etapas[etapaAtual];
  const progresso = etapaAtualData ? calcularProgressoEtapa(etapaAtualData) : 0;
  const completa = etapaCompleta(etapaAtual);

  // Voltar para lista de vistorias
  const handleVoltar = () => {
    router.push('/vistorias');
  };

  // Salvar rascunho manualmente
  const handleSalvarRascunho = async () => {
    console.log('💾 Salvando rascunho manualmente...', { vistoriaId, etapas });
    
    try {
      // TODO: Descomente quando sua API estiver pronta
      // await vistoriasApi.update(vistoriaId!, {
      //   status: 'rascunho',
      //   etapas: etapas,
      //   progresso: progressoTotal(),
      // });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setUltimoSave(new Date());
      
      alert('✅ Rascunho salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert('❌ Erro ao salvar rascunho. Tente novamente.');
    }
  };

  // Finalizar checklist
  const handleFinalizar = async () => {
    if (!checklistCompleto()) {
      alert('⚠️ Complete todas as etapas antes de finalizar!');
      return;
    }

    try {
      setFinalizando(true);

      const resumo = obterResumo();
      console.log('🏁 Finalizando checklist...', {
        vistoriaId,
        etapas,
        resumo,
        progresso: 100,
      });

      // TODO: Descomente quando sua API estiver pronta
      // await vistoriasApi.finalizar(vistoriaId!, {
      //   etapas: etapas,
      //   resumo: resumo,
      //   progresso: 100,
      //   status: 'concluida',
      //   finalizada_em: new Date().toISOString()
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirecionar para resultado
      router.push(`/vistorias/${vistoriaId}/resultado`);
    } catch (error) {
      console.error('❌ Erro ao finalizar:', error);
      alert('Erro ao finalizar checklist. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  };

  // Atualizar item específico
  const handleAtualizarItem = (
    itemId: number,
    classificacao: 'B' | 'R' | 'I' | 'F',
    observacao?: string
  ) => {
    atualizarItem(etapaAtualData.id, itemId, classificacao, observacao);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - FIXO */}
      <ChecklistHeader
        veiculo={VEICULO_MOCK}
        onVoltar={handleVoltar}
        onSalvarRascunho={handleSalvarRascunho}
        salvando={autoSaving}
      />

      {/* Último save (debug) - FIXO */}
      {ultimoSave && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2">
          <p className="text-xs text-emerald-700 text-center">
            ✅ Último salvamento: {ultimoSave.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )}

      {/* Stepper - FIXO */}
      <ChecklistStepper
        etapas={etapas}
        etapaAtual={etapaAtual}
        calcularProgressoEtapa={calcularProgressoEtapa}
        onEtapaClick={(index) => setEtapaAtual(index)}
      />

      {/* ✅ CONTAINER PRINCIPAL COM SCROLL */}
      <div 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Conteúdo da etapa */}
        {etapaAtualData && (
          <ChecklistSection
            etapa={etapaAtualData}
            progresso={progresso}
            atualizarItem={handleAtualizarItem}
            etapaCompleta={completa}
          />
        )}
      </div>

      {/* Navegação - FIXO */}
      <ChecklistNavigation
        podeVoltar={podeVoltar()}
        podeAvancar={podeAvancar()}
        etapaAtual={etapaAtual}
        totalEtapas={etapas.length}
        etapaCompleta={completa}
        onVoltar={etapaAnterior}
        onAvancar={proximaEtapa}
        onFinalizar={handleFinalizar}
        finalizando={finalizando}
      />
    </div>
  );
}

// ✅ Funções auxiliares
function calcularProgressoTotal(etapas: any[]): number {
  if (etapas.length === 0) return 0;
  const totalItens = etapas.reduce((acc, etapa) => acc + etapa.itens.length, 0);
  const itensClassificados = etapas.reduce(
    (acc, etapa) => acc + etapa.itens.filter((item: any) => item.classificacao).length,
    0
  );
  return Math.round((itensClassificados / totalItens) * 100);
}

function contarItensClassificados(etapas: any[]): number {
  return etapas.reduce(
    (acc, etapa) => acc + etapa.itens.filter((item: any) => item.classificacao).length,
    0
  );
}
