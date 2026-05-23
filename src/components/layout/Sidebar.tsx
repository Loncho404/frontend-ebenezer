'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type ItemProps = {
  href: string
  icon: IconDefinition
  label: string
  active: boolean
}

function SidebarItem({ href, icon, label, active }: ItemProps) {
  const base =
    'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-all duration-150'
  const stateCls = active
    ? 'bg-surface-elevated text-ink shadow-[var(--shadow-card)] ring-1 ring-inset ring-line'
    : 'text-ink-muted hover:bg-surface-elevated hover:text-ink'

  return (
    <Link href={href} className={`${base} ${stateCls}`}>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-xs transition-colors ${
          active
            ? 'bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100'
            : 'bg-surface-muted text-ink-subtle'
        }`}
      >
        <FontAwesomeIcon icon={icon} />
      </span>
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-surface px-4 py-8 lg:block">
      <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
        Navegación
      </p>

      <nav className="space-y-1">
        <SidebarItem
          href="/"
          icon={faHouse}
          label="Inicio"
          active={isInicio}
        />

        <SidebarItem
          href="/corderitos"
          icon={faBookOpen}
          label="Corderitos"
          active={isCorderitos}
        />
      </nav>

      <div className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-5 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
          Sección activa
        </p>
        <h3 className="mt-2 text-sm font-semibold text-ink">
          {isInicio ? 'Inicio' : 'Corderitos'}
        </h3>
        <p className="mt-2 text-xs leading-5 text-ink-muted">
          {isInicio
            ? 'Resumen y acceso rápido a la plataforma.'
            : 'Aquí se organizan niveles, temas y contenidos.'}
        </p>
      </div>
    </aside>
  )
}
