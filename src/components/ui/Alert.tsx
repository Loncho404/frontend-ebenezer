import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { ReactNode } from 'react'

type Variant = 'success' | 'error' | 'info' | 'warning'

type AlertProps = {
  variant?: Variant
  title?: string
  className?: string
  children: ReactNode
}

const styles: Record<
  Variant,
  { wrap: string; icon: IconDefinition; iconCls: string }
> = {
  success: {
    wrap: 'bg-[var(--color-success-50)] border-[var(--color-success-200)] text-[var(--color-success-700)]',
    icon: faCircleCheck,
    iconCls: 'text-[var(--color-success-600)]',
  },
  error: {
    wrap: 'bg-[var(--color-danger-50)] border-[var(--color-danger-200)] text-[var(--color-danger-700)]',
    icon: faCircleExclamation,
    iconCls: 'text-[var(--color-danger-600)]',
  },
  info: {
    wrap: 'bg-brand-50 border-brand-100 text-brand-700',
    icon: faCircleInfo,
    iconCls: 'text-brand-600',
  },
  warning: {
    wrap: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: faTriangleExclamation,
    iconCls: 'text-amber-600',
  },
}

export default function Alert({
  variant = 'info',
  title,
  className = '',
  children,
}: AlertProps) {
  const s = styles[variant]

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${s.wrap} ${className}`}
    >
      <FontAwesomeIcon icon={s.icon} className={`mt-0.5 shrink-0 ${s.iconCls}`} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}
