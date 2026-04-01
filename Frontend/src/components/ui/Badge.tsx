interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default'
  children: React.ReactNode
}

const variants = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  danger:  'bg-red-500/10 text-red-400 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info:    'bg-primary-500/10 text-primary-400 border-primary-500/20',
  default: 'bg-slate-700 text-slate-300 border-slate-600',
}

export const Badge = ({ variant = 'default', children }: BadgeProps) => (
  <span className={`
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
    ${variants[variant]}
  `}>
    {children}
  </span>
)
