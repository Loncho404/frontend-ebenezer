'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { loginUser } from '@/lib/api'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      await login(data)

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Card padding="lg">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Acceso
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Ingresa con tu cuenta para acceder al contenido y a las funciones
            disponibles según tus permisos.
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
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
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
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>

            <Link
              href="/register"
              className="text-center text-sm font-medium text-ink-muted transition-colors hover:text-brand-600 sm:text-left"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
