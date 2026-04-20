'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser } from '@/lib/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* ===========
  Reglas básicas de validación para la contraseña
  =========== */
  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
    }),
    [password]
  )

  /* ===========
  Validación general de fortaleza mínima
  =========== */
  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasLetter &&
    passwordChecks.hasNumber

  /* ===========
  Validación de coincidencia entre contraseña y confirmación
  =========== */
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  /* ===========
  Registrar usuario y luego iniciar sesión automáticamente
  =========== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Debes completar todos los campos.')
      return
    }

    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 6 caracteres, una letra y un número.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      setError('')

      await registerUser(username, email, password)

      const loginData = await loginUser(username, password)

      localStorage.setItem('access_token', loginData.access)
      localStorage.setItem('refresh_token', loginData.refresh)

      window.dispatchEvent(new Event('authChanged'))

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8 lg:p-10">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-orange-600">Registro</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Crear cuenta
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Regístrate para acceder a la plataforma de contenidos.
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
          Correo electrónico
          =========== */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              placeholder="Ingresa tu correo"
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

            <div className="mt-3 space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <ValidationItem
                valid={passwordChecks.minLength}
                text="Al menos 6 caracteres"
              />
              <ValidationItem
                valid={passwordChecks.hasLetter}
                text="Contiene al menos una letra"
              />
              <ValidationItem
                valid={passwordChecks.hasNumber}
                text="Contiene al menos un número"
              />
            </div>
          </div>

          {/* ===========
          Confirmar contraseña
          =========== */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-orange-400"
                placeholder="Repite tu contraseña"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {passwordsMatch && (
              <p className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <FontAwesomeIcon icon={faCircleCheck} />
                Las contraseñas coinciden.
              </p>
            )}

            {passwordsDoNotMatch && (
              <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <FontAwesomeIcon icon={faCircleXmark} />
                Las contraseñas no coinciden.
              </p>
            )}
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
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <Link
              href="/login"
              className="text-center text-sm font-medium text-gray-600 hover:text-gray-900 sm:text-left"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}

/* ===========
Elemento visual de validación de contraseña
=========== */
function ValidationItem({
  valid,
  text,
}: {
  valid: boolean
  text: string
}) {
  return (
    <p
      className={`flex items-center gap-2 text-sm ${
        valid ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      <FontAwesomeIcon icon={valid ? faCircleCheck : faCircleXmark} />
      {text}
    </p>
  )
}