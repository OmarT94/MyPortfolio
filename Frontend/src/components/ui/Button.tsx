import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'bg-transparent hover:bg-slate-800 text-slate-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || isLoading}
    className={`
      inline-flex items-center justify-center gap-2 rounded-lg font-medium
      transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {isLoading && (
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    )}
    {children}
  </button>
)
