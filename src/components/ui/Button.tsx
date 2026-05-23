'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    as?: 'button'
    href?: never
  }

type ButtonAsLink = CommonProps & {
  as: 'link'
  href: string
  target?: string
  rel?: string
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:shadow-[var(--shadow-focus-brand)]',
  secondary:
    'bg-ink text-white hover:bg-ink/90 active:bg-ink/80 focus-visible:shadow-[0_0_0_4px_rgb(15_23_42_/_0.15)]',
  ghost:
    'bg-transparent text-ink-muted hover:bg-ink/5 hover:text-ink active:bg-ink/10',
  outline:
    'border border-line-strong bg-surface-elevated text-ink hover:bg-surface-muted active:bg-surface',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
  } = props

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60'

  const composed = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  )

  if (props.as === 'link') {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={composed}
      >
        {content}
      </Link>
    )
  }

  const { as: _as, leftIcon: _l, rightIcon: _r, loading: _lo, fullWidth: _fw, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton

  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={composed}
    >
      {content}
    </button>
  )
}
