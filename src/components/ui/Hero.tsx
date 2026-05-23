import type { ReactNode } from 'react'

type HeroProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export default function Hero({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}: HeroProps) {
  return (
    <section
      className={`relative isolate mb-8 overflow-hidden rounded-[var(--radius-2xl)] px-6 py-10 shadow-[var(--shadow-card)] sm:px-10 sm:py-14 lg:px-12 lg:py-16 ${className}`}
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

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {description}
          </p>
        )}

        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  )
}
