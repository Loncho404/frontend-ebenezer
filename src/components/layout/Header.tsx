'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faXmark,
  faHouse,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Button from '@/components/ui/Button'

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
    <Link href={href} onClick={onClick} className={`${base} ${blockCls} ${stateCls}`}>
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
  const { user, loading: loadingUser, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  /* ===========
  Cerrar sesión
  =========== */
  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-surface-elevated/85 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/70">
        <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoheader.png"
              alt="Ebenezer San Bernardo"
              width={160}
              height={48}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/" icon={faHouse} active={isInicio}>
              Inicio
            </NavLink>

            <NavLink href="/corderitos" icon={faBookOpen} active={isCorderitos}>
              Corderitos
            </NavLink>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {loadingUser ? null : user ? (
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Button as="link" href="/login" variant="ghost" size="sm">
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
            className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink md:hidden"
            aria-label="Abrir menú"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
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

            <nav className="flex-1 space-y-1 px-3 py-5">
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

            <div className="border-t border-line px-5 py-5">
              {loadingUser ? null : user ? (
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    as="link"
                    href="/login"
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
