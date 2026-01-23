// ✅ COPIE ESTE ARQUIVO PARA: hooks/useChecklist.ts
// Correção: Validação agora funciona corretamente

// A correção principal está nas linhas 138-165:
// - etapaCompleta agora é useCallback com dependência de etapas
// - podeAvancar é useCallback com dependências corretas
// - proximaEtapa verifica internamente se pode avançar com logs

// LOGS ADICIONADOS:
// Agora você verá no console (F12):
// 📋 Etapa X completa: true/false
// 🔍 Verificando avanço: {...}
// ➡️ Avançando para próxima etapa
// ⚠️ Não pode avançar - classifique todos os itens

// hooks/useChecklist.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ItemChecklist {
  id: number;
  descricao: string;
  etapaId: number;
  pesoRelativo: number;
  classificacao?: 'B' | 'R' | 'I' | 'F';
  observacao?: string;
}

export interface EtapaChecklist {
  id: number;
  descricao: string;
  ordem: number;
  itens: ItemChecklist[];
  progresso?: number;
}

export interface ClassificacaoItem {
  codigo: 'B' | 'R' | 'I' | 'F';
  descricao: string;
  cor: string;
  bgColor: string;
  textColor: string;
}

export const CLASSIFICACOES: ClassificacaoItem[] = [
  {
    codigo: 'B',
    descricao: 'Bom',
    cor: 'bg-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    codigo: 'R',
    descricao: 'Regular',
    cor: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    codigo: 'I',
    descricao: 'Imprestável',
    cor: 'bg-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    codigo: 'F',
    descricao: 'Faltando',
    cor: 'bg-gray-600',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
];

interface UseChecklistProps {
  vistoriaId?: number;
  onAutoSave?: (etapas: EtapaChecklist[]) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export function useChecklist({ vistoriaId, onAutoSave, scrollContainerRef }: UseChecklistProps = {}) {
  const [etapas, setEtapas] = useState<EtapaChecklist[]>([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);

  // Carregar etapas da API ou usar estrutura padrão
  useEffect(() => {
    async function loadChecklist() {
      try {
        setLoading(true);
        
        if (vistoriaId) {
          setEtapas(getEtapasPadrao());
        } else {
          setEtapas(getEtapasPadrao());
        }
      } catch (error) {
        console.error('Erro ao carregar checklist:', error);
        setEtapas(getEtapasPadrao());
      } finally {
        setLoading(false);
      }
    }

    loadChecklist();
  }, [vistoriaId]);

  // Auto-save a cada mudança (com debounce)
  useEffect(() => {
    if (etapas.length === 0) return;
    if (!onAutoSave) return;

    const timer = setTimeout(() => {
      setAutoSaving(true);
      onAutoSave(etapas);
      setTimeout(() => setAutoSaving(false), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [etapas, onAutoSave]);

  // Calcular progresso da etapa
  const calcularProgressoEtapa = (etapa: EtapaChecklist): number => {
    if (etapa.itens.length === 0) return 0;
    const itensClassificados = etapa.itens.filter((item) => item.classificacao).length;
    return Math.round((itensClassificados / etapa.itens.length) * 100);
  };

  // Atualizar item
  const atualizarItem = (
    etapaId: number,
    itemId: number,
    classificacao: 'B' | 'R' | 'I' | 'F',
    observacao?: string
  ) => {
    setEtapas((prevEtapas) =>
      prevEtapas.map((etapa) => {
        if (etapa.id === etapaId) {
          return {
            ...etapa,
            itens: etapa.itens.map((item) =>
              item.id === itemId ? { ...item, classificacao, observacao } : item
            ),
          };
        }
        return etapa;
      })
    );
  };

  // Verificar se etapa está completa
  const etapaCompleta = useCallback((etapaIndex: number): boolean => {
    const etapa = etapas[etapaIndex];
    if (!etapa) return false;
    const completa = etapa.itens.every((item) => item.classificacao !== undefined);
    console.log(`📋 Etapa ${etapaIndex + 1} completa:`, completa, {
      total: etapa.itens.length,
      classificados: etapa.itens.filter(i => i.classificacao).length
    });
    return completa;
  }, [etapas]);

  // Verificar se pode avançar
  const podeAvancar = useCallback((): boolean => {
    return etapaCompleta(etapaAtual);
  }, [etapaAtual, etapaCompleta]);

  // Verificar se pode voltar
  const podeVoltar = useCallback((): boolean => {
    return etapaAtual > 0;
  }, [etapaAtual]);

  // ✅ FUNÇÃO DE SCROLL
  const scrollParaTopo = useCallback(() => {
    console.log('🔄 Tentando scroll...');
    
    if (scrollContainerRef?.current) {
      console.log('✅ Scroll com ref');
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      console.log('✅ Scroll com window');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [scrollContainerRef]);

  // ✅ Navegar para próxima etapa COM SCROLL
  const proximaEtapa = useCallback(() => {
    // Verificar se etapa atual está completa
    const etapaAtualCompleta = etapas[etapaAtual]?.itens.every(item => item.classificacao !== undefined);
    
    console.log('🔍 Verificando avanço:', {
      etapaAtual,
      etapaAtualCompleta,
      totalEtapas: etapas.length,
      podeAvancar: etapaAtualCompleta && etapaAtual < etapas.length - 1
    });
    
    if (etapaAtualCompleta && etapaAtual < etapas.length - 1) {
      console.log('➡️ Avançando para próxima etapa');
      setEtapaAtual(etapaAtual + 1);
      
      // Scroll imediato
      setTimeout(() => scrollParaTopo(), 100);
    } else {
      console.log('⚠️ Não pode avançar - classifique todos os itens');
    }
  }, [etapaAtual, etapas, scrollParaTopo]);

  // ✅ Navegar para etapa anterior COM SCROLL
  const etapaAnterior = useCallback(() => {
    if (podeVoltar()) {
      console.log('⬅️ Voltando para etapa anterior');
      setEtapaAtual(etapaAtual - 1);
      
      // Scroll imediato
      setTimeout(() => scrollParaTopo(), 100);
    }
  }, [etapaAtual, scrollParaTopo]);

  // ✅ Mudar etapa manualmente COM SCROLL
  const mudarEtapa = useCallback((index: number) => {
    console.log('🎯 Mudando para etapa:', index);
    setEtapaAtual(index);
    
    // Scroll imediato
    setTimeout(() => scrollParaTopo(), 100);
  }, [scrollParaTopo]);

  // Calcular progresso total
  const progressoTotal = (): number => {
    if (etapas.length === 0) return 0;
    const totalItens = etapas.reduce((acc, etapa) => acc + etapa.itens.length, 0);
    const itensClassificados = etapas.reduce(
      (acc, etapa) => acc + etapa.itens.filter((item) => item.classificacao).length,
      0
    );
    return Math.round((itensClassificados / totalItens) * 100);
  };

  // Verificar se checklist está completo
  const checklistCompleto = (): boolean => {
    return etapas.every((etapa) => etapaCompleta(etapas.indexOf(etapa)));
  };

  // Obter resumo das classificações
  const obterResumo = () => {
    const resumo = { B: 0, R: 0, I: 0, F: 0 };
    etapas.forEach((etapa) => {
      etapa.itens.forEach((item) => {
        if (item.classificacao) {
          resumo[item.classificacao]++;
        }
      });
    });
    return resumo;
  };

  return {
    etapas,
    etapaAtual,
    setEtapaAtual: mudarEtapa, // ✅ Usa função com scroll
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
  };
}

// Estrutura padrão do checklist (8 etapas, 53 itens)
function getEtapasPadrao(): EtapaChecklist[] {
  return [
    {
      id: 1,
      descricao: 'Identificação',
      ordem: 1,
      itens: [
        { id: 1, descricao: 'Placa', etapaId: 1, pesoRelativo: 1.0 },
        { id: 2, descricao: 'Chassi', etapaId: 1, pesoRelativo: 1.0 },
        { id: 3, descricao: 'RENAVAM', etapaId: 1, pesoRelativo: 1.0 },
      ],
    },
    {
      id: 2,
      descricao: 'Motor + Alimentação',
      ordem: 2,
      itens: [
        { id: 4, descricao: 'Cabeçote', etapaId: 2, pesoRelativo: 1.0 },
        { id: 5, descricao: 'Cárter', etapaId: 2, pesoRelativo: 1.0 },
        { id: 6, descricao: 'Bloco', etapaId: 2, pesoRelativo: 1.0 },
        { id: 7, descricao: 'Tanque de combustível', etapaId: 2, pesoRelativo: 0.8 },
        { id: 8, descricao: 'Bomba de combustível', etapaId: 2, pesoRelativo: 0.8 },
        { id: 9, descricao: 'Filtro de combustível', etapaId: 2, pesoRelativo: 0.6 },
        { id: 10, descricao: 'Mangueiras', etapaId: 2, pesoRelativo: 0.5 },
        { id: 11, descricao: 'Carburador / Bicos', etapaId: 2, pesoRelativo: 0.9 },
      ],
    },
    {
      id: 3,
      descricao: 'Ar + Arrefecimento + Exaustão',
      ordem: 3,
      itens: [
        { id: 12, descricao: 'Ar condicionado', etapaId: 3, pesoRelativo: 0.8 },
        { id: 13, descricao: 'Compressor', etapaId: 3, pesoRelativo: 0.9 },
        { id: 14, descricao: 'Condensador', etapaId: 3, pesoRelativo: 0.7 },
        { id: 15, descricao: 'Evaporador', etapaId: 3, pesoRelativo: 0.7 },
        { id: 16, descricao: 'Radiador', etapaId: 3, pesoRelativo: 1.0 },
        { id: 17, descricao: 'Ventoinha', etapaId: 3, pesoRelativo: 0.8 },
        { id: 18, descricao: 'Correias', etapaId: 3, pesoRelativo: 0.6 },
        { id: 19, descricao: 'Catalisador', etapaId: 3, pesoRelativo: 0.9 },
      ],
    },
    {
      id: 4,
      descricao: 'Transmissão + Embreagem',
      ordem: 4,
      itens: [
        { id: 20, descricao: 'Caixa de câmbio', etapaId: 4, pesoRelativo: 1.0 },
        { id: 21, descricao: 'Embreagem', etapaId: 4, pesoRelativo: 1.0 },
        { id: 22, descricao: 'Diferencial', etapaId: 4, pesoRelativo: 1.0 },
        { id: 23, descricao: 'Semi-eixos', etapaId: 4, pesoRelativo: 0.9 },
      ],
    },
    {
      id: 5,
      descricao: 'Elétrica + Eletrônica',
      ordem: 5,
      itens: [
        { id: 24, descricao: 'Bateria', etapaId: 5, pesoRelativo: 0.8 },
        { id: 25, descricao: 'Alternador', etapaId: 5, pesoRelativo: 0.9 },
        { id: 26, descricao: 'Motor de partida', etapaId: 5, pesoRelativo: 0.9 },
        { id: 27, descricao: 'Chicote elétrico', etapaId: 5, pesoRelativo: 0.7 },
        { id: 28, descricao: 'Central multimídia', etapaId: 5, pesoRelativo: 0.5 },
        { id: 29, descricao: 'Painel de instrumentos', etapaId: 5, pesoRelativo: 0.8 },
      ],
    },
    {
      id: 6,
      descricao: 'Suspensão + Direção + Freios',
      ordem: 6,
      itens: [
        { id: 30, descricao: 'Suspensão', etapaId: 6, pesoRelativo: 1.0 },
        { id: 31, descricao: 'Amortecedores', etapaId: 6, pesoRelativo: 1.0 },
        { id: 32, descricao: 'Molas', etapaId: 6, pesoRelativo: 0.9 },
        { id: 33, descricao: 'Direção', etapaId: 6, pesoRelativo: 1.0 },
        { id: 34, descricao: 'Caixa de direção', etapaId: 6, pesoRelativo: 1.0 },
        { id: 35, descricao: 'Braços e terminais', etapaId: 6, pesoRelativo: 0.9 },
        { id: 36, descricao: 'Freios', etapaId: 6, pesoRelativo: 1.0 },
        { id: 37, descricao: 'Disco / Tambor', etapaId: 6, pesoRelativo: 1.0 },
        { id: 38, descricao: 'Pastilhas / Lonas', etapaId: 6, pesoRelativo: 0.9 },
        { id: 39, descricao: 'Cilindro mestre', etapaId: 6, pesoRelativo: 0.9 },
      ],
    },
    {
      id: 7,
      descricao: 'Rodas + Pneus',
      ordem: 7,
      itens: [
        { id: 40, descricao: 'Rodas', etapaId: 7, pesoRelativo: 0.8 },
        { id: 41, descricao: 'Pneus', etapaId: 7, pesoRelativo: 1.0 },
        { id: 42, descricao: 'Estepe', etapaId: 7, pesoRelativo: 0.5 },
      ],
    },
    {
      id: 8,
      descricao: 'Lataria + Instrumentos + Conclusão',
      ordem: 8,
      itens: [
        { id: 43, descricao: 'Lataria', etapaId: 8, pesoRelativo: 1.0 },
        { id: 44, descricao: 'Capô', etapaId: 8, pesoRelativo: 0.8 },
        { id: 45, descricao: 'Para-choques', etapaId: 8, pesoRelativo: 0.7 },
        { id: 46, descricao: 'Portas', etapaId: 8, pesoRelativo: 0.9 },
        { id: 47, descricao: 'Teto', etapaId: 8, pesoRelativo: 0.8 },
        { id: 48, descricao: 'Pintura', etapaId: 8, pesoRelativo: 1.0 },
        { id: 49, descricao: 'Vidros', etapaId: 8, pesoRelativo: 0.8 },
        { id: 50, descricao: 'Retrovisores', etapaId: 8, pesoRelativo: 0.6 },
        { id: 51, descricao: 'Bancos', etapaId: 8, pesoRelativo: 0.8 },
        { id: 52, descricao: 'Forração', etapaId: 8, pesoRelativo: 0.7 },
        { id: 53, descricao: 'Tapetes', etapaId: 8, pesoRelativo: 0.4 },
      ],
    },
  ];
}