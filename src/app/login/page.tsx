'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* ===========
  Iniciar sesión y guardar tokens en localStorage
  =========== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Debes completar usuario y contraseña.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await loginUser(username, password)

      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      window.dispatchEvent(new Event('authChanged'))

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8 lg:p-10">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-orange-600">Acceso</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Ingresa con tu cuenta para acceder al contenido y a las funciones
            disponibles según tus permisos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ===========
          Nombre de usuario
          =========== */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              placeholder="Ingresa tu usuario"
            />
          </div>

          {/* ===========
          Contraseña
          =========== */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-orange-400"
                placeholder="Ingresa tu contraseña"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* ===========
          Error general
          =========== */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ===========
          Acciones
          =========== */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <Link
              href="/register"
              className="text-center text-sm font-medium text-gray-600 hover:text-gray-900 sm:text-left"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}