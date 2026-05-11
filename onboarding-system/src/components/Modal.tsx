import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* 内容 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${sizeStyles[size]} bg-white rounded-xl shadow-2xl
            transform transition-all duration-300
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEE2E6]">
            <h3 className="text-lg font-semibold text-[#212529]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#F8F9FA] transition-colors"
            >
              <svg className="w-5 h-5 text-[#868E96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区 */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* 底部 */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#DEE2E6]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};