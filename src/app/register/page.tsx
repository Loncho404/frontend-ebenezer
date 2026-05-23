'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser } from '@/lib/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircle,
} from '@fortawesome/free-solid-svg-icons'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    if (!isPasswordValid) {
      setError(
        'La contraseña debe tener al menos 6 caracteres, una letra y un número.'
      )
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
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Card padding="lg">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Registro
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Crear cuenta
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Regístrate para acceder a la plataforma de contenidos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre de usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
          />

          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            autoComplete="email"
          />

          <div>
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              autoComplete="new-password"
            />

            <div className="mt-3 space-y-2 rounded-[var(--radius-md)] border border-line bg-surface-muted/60 p-4">
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

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            hint={passwordsMatch ? 'Las contraseñas coinciden.' : undefined}
            error={passwordsDoNotMatch ? 'Las contraseñas no coinciden.' : undefined}
          />

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              className="sm:!w-auto"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>

            <Link
              href="/login"
              className="text-center text-sm font-medium text-ink-muted transition-colors hover:text-brand-600 sm:text-left"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </Card>
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
      className={`flex items-center gap-2 text-xs transition-colors ${
        valid
          ? 'text-[var(--color-success-700)]'
          : 'text-ink-subtle'
      }`}
    >
      <FontAwesomeIcon
        icon={valid ? faCircleCheck : faCircle}
        className={valid ? 'text-[var(--color-success-600)]' : 'text-ink-subtle/60'}
      />
      {text}
    </p>
  )
}
