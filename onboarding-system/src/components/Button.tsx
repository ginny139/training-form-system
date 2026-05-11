import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-[#4263EB] text-white hover:bg-[#3451C7] focus:ring-[#4263EB] disabled:bg-[#DEE2E6] disabled:cursor-not-allowed',
    secondary: 'bg-white border-2 border-[#4263EB] text-[#4263EB] hover:bg-blue-50 focus:ring-[#4263EB] disabled:border-[#DEE2E6] disabled:text-[#DEE2E6] disabled:cursor-not-allowed',
    danger: 'bg-[#FF6B6B] text-white hover:bg-[#fa5252] focus:ring-[#FF6B6B] disabled:bg-[#DEE2E6] disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-[#4263EB] hover:bg-blue-50 focus:ring-[#4263EB] disabled:text-[#DEE2E6] disabled:cursor-not-allowed',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};