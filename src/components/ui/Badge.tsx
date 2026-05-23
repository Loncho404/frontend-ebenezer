import type { ReactNode } from 'react'

type Variant = 'brand' | 'neutral' | 'success' | 'danger'
type Size = 'sm' | 'md'

type BadgeProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-100',
  neutral: 'bg-surface-muted text-ink-muted border-line',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)]',
  danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger-700)] border-[var(--color-danger-200)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  )
}
