import type { ReactNode } from 'react'

type HeroProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  /* compact: menos alto, para páginas interiores donde el contenido es lo importante */
  compact?: boolean
  className?: string
}

export default function Hero({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
  className = '',
}: HeroProps) {
  const padding = compact
    ? 'px-6 py-7 sm:px-8 sm:py-8 lg:px-10'
    : 'px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16'

  return (
    <section
      className={`relative isolate mb-8 overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] ${padding} ${className}`}
      style={{
        background:
          'linear-gradient(125deg, var(--color-hero-from) 0%, var(--color-hero-via) 55%, var(--color-hero-to) 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-400/15 blur-3xl"
      />

      <div className="relative max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            {eyebrow}
          </p>
        )}

        <h1
          className={`mt-3 font-bold tracking-tight text-white ${
            compact ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-3xl lg:text-4xl'
          }`}
        >
          {title}
        </h1>

        {description && (
          <p className={`max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base ${compact ? 'mt-2' : 'mt-4'}`}>
            {description}
          </p>
        )}

        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  )
}
