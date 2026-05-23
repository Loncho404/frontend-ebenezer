import type { ElementType, ReactNode } from 'react'

type Padding = 'none' | 'sm' | 'md' | 'lg'

type CardProps = {
  as?: ElementType
  padding?: Padding
  interactive?: boolean
  className?: string
  children: ReactNode
}

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8 lg:p-10',
}

export default function Card({
  as,
  padding = 'md',
  interactive = false,
  className = '',
  children,
}: CardProps) {
  const Tag = (as ?? 'div') as ElementType

  const base =
    'rounded-[var(--radius-xl)] border border-line bg-surface-elevated shadow-[var(--shadow-card)]'

  const interactiveCls = interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] hover:border-line-strong cursor-pointer'
    : ''

  const composed = [base, interactiveCls, paddingClasses[padding], className]
    .filter(Boolean)
    .join(' ')

  return <Tag className={composed}>{children}</Tag>
}
