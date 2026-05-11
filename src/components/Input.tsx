import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#212529] mb-1.5">
            {label}
            {props.required && <span className="text-[#FF6B6B] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2.5 border rounded-lg text-base transition-all duration-200
            placeholder:text-[#868E96]
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-red-200'
              : 'border-[#DEE2E6] focus:border-[#4263EB] focus:ring-blue-200'
            }
            disabled:bg-[#F8F9FA] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#FF6B6B]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#868E96]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#212529] mb-1.5">
            {label}
            {props.required && <span className="text-[#FF6B6B] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2.5 border rounded-lg text-base transition-all duration-200
            placeholder:text-[#868E96] resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-red-200'
              : 'border-[#DEE2E6] focus:border-[#4263EB] focus:ring-blue-200'
            }
            disabled:bg-[#F8F9FA] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#FF6B6B]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#868E96]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';