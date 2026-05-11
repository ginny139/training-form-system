import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface TagProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  icon?: boolean;
}

export const Tag: React.FC<TagProps> = ({ type, children, icon = false }) => {
  const typeStyles = {
    success: 'bg-[#D3F9D8] text-[#2B8A3E]',
    warning: 'bg-[#FFF3BF] text-[#E67700]',
    error: 'bg-[#FFE3E3] text-[#C92A2A]',
    info: 'bg-[#E7E5FF] text-[#4263EB]',
  };

  const icons = {
    success: <CheckCircle className="w-3.5 h-3.5" />,
    warning: <Clock className="w-3.5 h-3.5" />,
    error: <XCircle className="w-3.5 h-3.5" />,
    info: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeStyles[type]}`}>
      {icon && icons[type]}
      {children}
    </span>
  );
};

// 状态显示组件
interface StatusBadgeProps {
  status: 'completed' | 'pending';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-[#2B8A3E]">
        <CheckCircle className="w-4 h-4" />
        {label && <span className="text-sm">{label}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[#C92A2A]">
      <XCircle className="w-4 h-4" />
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
};