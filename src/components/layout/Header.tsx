'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faXmark,
  faHouse,
  faBookOpen,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import UserAvatar from '@/components/ui/UserAvatar'

type NavLinkProps = {
  href: string
  icon: IconDefinition
  active: boolean
  children: React.ReactNode
  onClick?: () => void
  block?: boolean
}

function NavLink({ href, icon, active, children, onClick, block }: NavLinkProps) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150'
  const blockCls = block ? 'flex w-full justify-start' : ''
  const stateCls = active
    ? 'bg-ink/5 text-ink ring-1 ring-inset ring-ink/5'
    : 'text-ink-muted hover:bg-ink/5 hover:text-ink'

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`${base} ${blockCls} ${stateCls}`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-xs ${active ? 'text-brand-600' : 'text-ink-subtle'}`}
      />
      {children}
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: loadingUser, isAdmin, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  /* ===========
  Bloquear el scroll del body mientras el menú móvil está abierto
  (el menú se cierra en cada NavLink/Button al navegar)
  =========== */
  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

  /* ===========
  Cerrar sesión
  =========== */
  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push('/')
  }

  const loginHref =
    pathname === '/login' || pathname === '/register' || pathname === '/'
      ? '/login'
      : `/login?next=${encodeURIComponent(pathname)}`

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-surface-elevated/85 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/70">
        <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Ir al inicio">
            <Image
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-xl object-contain sm:h-11 sm:w-11"
              priority
            />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="truncate text-sm font-bold tracking-tight text-ink">
                Bajo una sola voz
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                Plataforma de contenidos
              </span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {loadingUser ? (
              <div className="h-9 w-32 animate-pulse rounded-full bg-line/70" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3">
                  <UserAvatar name={user.username} size="sm" />
                  <div className="flex flex-col leading-tight">
                    <span className="max-w-[140px] truncate text-sm font-semibold text-ink">
                      {user.username}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                        Administrador
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button as="link" href={loginHref} variant="ghost" size="sm">
                  Iniciar sesión
                </Button>

                <Button as="link" href="/register" variant="primary" size="sm">
                  Registrarse
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-surface-elevated shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-sm font-semibold text-ink">Menú</span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label="Cerrar menú"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 border-b border-line px-5 py-4 md:hidden">
                <UserAvatar name={user.username} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{user.username}</p>
                  <p className="truncate text-xs text-ink-muted">{user.email}</p>
                </div>
                {isAdmin && (
                  <Badge variant="brand" size="sm" className="ml-auto">
                    Admin
                  </Badge>
                )}
              </div>
            )}

            <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Principal">
              <NavLink
                href="/"
                icon={faHouse}
                active={isInicio}
                onClick={() => setMobileMenuOpen(false)}
                block
              >
                Inicio
              </NavLink>

              <NavLink
                href="/corderitos"
                icon={faBookOpen}
                active={isCorderitos}
                onClick={() => setMobileMenuOpen(false)}
                block
              >
                Corderitos
              </NavLink>
            </nav>

            <div className="border-t border-line px-5 py-5 md:hidden">
              {loadingUser ? null : user ? (
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={handleLogout}
                  leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    as="link"
                    href={loginHref}
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Button>

                  <Button
                    as="link"
                    href="/register"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
