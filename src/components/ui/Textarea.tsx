'use client'

import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export default function Textarea({
  label,
  error,
  className = '',
  rows = 5,
  ...rest
}: TextareaProps) {
  const base =
    'w-full rounded-[var(--radius-md)] border bg-surface-elevated px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none transition-all duration-150 resize-y'
  const state = error
    ? 'border-[var(--color-danger-200)] focus:border-[var(--color-danger-600)] focus:shadow-[var(--shadow-focus-danger)]'
    : 'border-line-strong focus:border-brand-500 focus:shadow-[var(--shadow-focus-brand)]'

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <textarea
        {...rest}
        rows={rows}
        className={`${base} ${state} ${className}`}
      />

      {error && (
        <p className="mt-2 text-xs text-[var(--color-danger-600)]">{error}</p>
      )}
    </div>
  )
}
