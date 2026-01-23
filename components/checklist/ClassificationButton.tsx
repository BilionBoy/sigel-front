 
'use client';

import { ClassificacaoItem, CLASSIFICACOES } from '../../types/checklist';

interface ClassificationButtonProps {
  classificacao: ClassificacaoItem;
  isSelected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function ClassificationButton({
  classificacao,
  isSelected,
  onClick,
  size = 'md',
}: ClassificationButtonProps) {
  const config = CLASSIFICACOES[classificacao];
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        font-semibold rounded transition-all
        ${isSelected 
          ? `${config.bgColor} ${config.color} ring-2 ring-offset-2 ring-${config.bgColor.split('-')[1]}-500 scale-110` 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
      title={config.descricao}
    >
      {classificacao}
    </button>
  );
}
