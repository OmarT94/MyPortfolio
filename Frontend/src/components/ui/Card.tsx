import { type HTMLAttributes} from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = ({ hover = false, className = '', children, ...props }: CardProps) => (
  <div
    className={`
      bg-slate-900 border border-slate-800 rounded-xl p-6
      ${hover ? 'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ className = '', children }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle = ({ className = '', children }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-slate-100 ${className}`}>{children}</h3>
)
