interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div className={`
    ${sizes[size]} border-2 border-slate-700 border-t-primary-500
    rounded-full animate-spin ${className}
  `} />
)

export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
)
