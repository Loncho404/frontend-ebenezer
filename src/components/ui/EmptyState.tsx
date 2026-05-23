import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: IconDefinition
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon = faFolderOpen,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] border border-dashed border-line-strong bg-surface-elevated px-6 py-10 text-center shadow-[var(--shadow-card)] sm:py-14 ${className}`}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-ink-subtle">
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>

      <h3 className="text-base font-semibold text-ink sm:text-lg">{title}</h3>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
