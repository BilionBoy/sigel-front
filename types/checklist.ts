 
export type ClassificacaoItem = 'B' | 'R' | 'I' | 'F';

export interface ClassificacaoItemConfig {
  codigo: ClassificacaoItem;
  descricao: string;
  pesoBase: number;
  color: string;
  bgColor: string;
}

export const CLASSIFICACOES: Record<ClassificacaoItem, ClassificacaoItemConfig> = {
  B: {
    codigo: 'B',
    descricao: 'Bom',
    pesoBase: 1.0,
    color: 'text-white',
    bgColor: 'bg-[#2C4A3E]',
  },
  R: {
    codigo: 'R',
    descricao: 'Regular',
    pesoBase: 0.7,
    color: 'text-white',
    bgColor: 'bg-amber-600',
  },
  I: {
    codigo: 'I',
    descricao: 'Imprestável',
    pesoBase: 0.3,
    color: 'text-white',
    bgColor: 'bg-red-600',
  },
  F: {
    codigo: 'F',
    descricao: 'Faltando',
    pesoBase: 0.0,
    color: 'text-white',
    bgColor: 'bg-gray-500',
  },
};

export interface ItemChecklist {
  id: number;
  descricao: string;
  etapaId: number;
  pesoRelativo: number;
  classificacao?: ClassificacaoItem;
  observacao?: string;
}

export interface EtapaChecklist {
  id: number;
  descricao: string;
  ordem: number;
  itens: ItemChecklist[];
  progresso?: number; // 0-100%
}

export interface Veiculo {
  id: number;
  numeroInterno: string;
  placa: string;
  chassi: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  statusId: number;
}

export interface Vistoria {
  id?: number;
  veiculoId: number;
  tipoVistoriaId: number;
  statusVistoriaId: number;
  realizadaPorId: number;
  realizadaEm?: string;
  etapas: EtapaChecklist[];
}

export interface ChecklistProgress {
  etapaAtual: number;
  totalEtapas: number;
  itensPreenchidos: number;
  totalItens: number;
  percentualGeral: number;
}

export interface VistoriaItem {
  vistoriaId: number;
  itemChecklistId: number;
  classificacaoItemId: number;
  classificacao: ClassificacaoItem;
  observacao?: string;
}

// Status da vistoria
export type StatusVistoria = 'rascunho' | 'concluida';

// Tipos de vistoria
export type TipoVistoria = 'mensal' | 'pre-leilao';
