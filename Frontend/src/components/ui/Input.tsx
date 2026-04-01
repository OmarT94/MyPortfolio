import {type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-lg text-sm
          bg-slate-800 border text-slate-100
          placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-primary-500/50
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-slate-700 hover:border-slate-600'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
