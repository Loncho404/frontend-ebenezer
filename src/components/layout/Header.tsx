'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getMe } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

type UserMe = {
  id: number
  username: string
  email: string
  rol: string
  puede_descargar_pdfs: boolean
  puede_comentar: boolean
  activo_en_plataforma: boolean
}

export default function Header() {
  const pathname = usePathname()

  const [user, setUser] = useState<UserMe | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  /* ===========
  Cargar usuario autenticado desde /me
  =========== */
  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setUser(null)
        return
      }

      const me = await getMe()
      setUser(me)
    } catch (error) {
      console.error('No se pudo cargar el usuario del header', error)
      setUser(null)
    } finally {
      setLoadingUser(false)
    }
  }

  /* ===========
  Escuchar cambios de autenticación
  =========== */
  useEffect(() => {
    cargarUsuario()

    const handleAuthChanged = () => {
      cargarUsuario()
    }

    window.addEventListener('authChanged', handleAuthChanged)

    return () => {
      window.removeEventListener('authChanged', handleAuthChanged)
    }
  }, [])

  /* ===========
  Cerrar sesión
  =========== */
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.dispatchEvent(new Event('authChanged'))
    window.location.href = '/'
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logoheader.png"
              alt="Ebenezer San Bernardo"
              width={120}
              height={120}
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>

          <nav className="hidden items-center gap-4 md:flex lg:gap-8">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isInicio
                  ? 'bg-orange-50 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inicio
            </Link>

            <Link
              href="/corderitos"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isCorderitos
                  ? 'bg-orange-50 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Corderitos
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {loadingUser ? null : user ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <span className="text-sm font-semibold text-gray-900">Menú</span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 text-gray-700 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>

            <div className="space-y-3 px-4 py-5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isInicio
                    ? 'bg-orange-50 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inicio
              </Link>

              <Link
                href="/corderitos"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isCorderitos
                    ? 'bg-orange-50 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Corderitos
              </Link>

              <div className="pt-4">
                {loadingUser ? null : user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700"
                    >
                      Iniciar sesión
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}