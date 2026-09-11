'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBookOpen, faShield } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useAuth } from '@/context/AuthContext'
import UserAvatar from '@/components/ui/UserAvatar'
import Button from '@/components/ui/Button'

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
    <Link href={href} aria-current={active ? 'page' : undefined} className={`${base} ${stateCls}`}>
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

/* ===========
Tarjeta de sesión: muestra quién está conectado.
Los permisos (PDF/comentarios) no se muestran al usuario.
=========== */
function SessionCard() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-line/70" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded-full bg-line/70" />
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-line/60" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-5 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
          Tu cuenta
        </p>
        <h3 className="mt-2 text-sm font-semibold text-ink">No has iniciado sesión</h3>
        <p className="mt-2 text-xs leading-5 text-ink-muted">
          Ingresa para participar en los comentarios y acceder al material de apoyo de las clases.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button as="link" href="/login" variant="primary" size="sm" fullWidth>
            Iniciar sesión
          </Button>
          <Button as="link" href="/register" variant="ghost" size="sm" fullWidth>
            Crear cuenta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <UserAvatar name={user.username} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.username}</p>
          <p className="truncate text-xs text-ink-muted">{user.email || 'Sin correo'}</p>
        </div>
      </div>

      {isAdmin && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-inset ring-brand-100">
          <FontAwesomeIcon icon={faShield} className="text-[10px]" />
          Administrador
        </p>
      )}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-surface px-4 py-8 lg:block">
      <div className="sticky top-[calc(var(--header-h)+2rem)]">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
          Menú
        </p>

        <nav className="space-y-1" aria-label="Lateral">
          <SidebarItem href="/" icon={faHouse} label="Inicio" active={isInicio} />
          <SidebarItem href="/corderitos" icon={faBookOpen} label="Corderitos" active={isCorderitos} />
        </nav>

        <SessionCard />
      </div>
    </aside>
  )
}
