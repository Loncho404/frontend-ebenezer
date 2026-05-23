import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

type NavItemCardProps = {
  orden: number
  eyebrow: string
  title: string
  description: string
  href: string
  cta?: string
}

export default function NavItemCard({
  orden,
  eyebrow,
  title,
  description,
  href,
  cta = 'Ver más',
}: NavItemCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-base font-bold text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors duration-200 group-hover:bg-brand-100">
        {orden}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-lg font-bold text-ink sm:text-xl">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors group-hover:text-brand-600">
        {cta}
        <FontAwesomeIcon
          icon={faArrowRight}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  )
}
