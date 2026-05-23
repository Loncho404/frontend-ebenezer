'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import type { InputHTMLAttributes } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  className = '',
  type = 'text',
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const effectiveType = isPassword && showPassword ? 'text' : type

  const baseInput =
    'w-full rounded-[var(--radius-md)] border bg-surface-elevated px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none transition-all duration-150'
  const stateInput = error
    ? 'border-[var(--color-danger-200)] focus:border-[var(--color-danger-600)] focus:shadow-[var(--shadow-focus-danger)]'
    : 'border-line-strong focus:border-brand-500 focus:shadow-[var(--shadow-focus-brand)]'

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...rest}
          type={effectiveType}
          className={`${baseInput} ${stateInput} ${isPassword ? 'pr-12' : ''} ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-danger-600)]">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-[10px]" />
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="mt-2 text-xs text-ink-subtle">{hint}</p>
      )}
    </div>
  )
}
