'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearTokens, getAccessToken, getMe, setTokens } from '@/lib/api'
import type { UserMe } from '@/lib/types'

type AuthContextValue = {
  user: UserMe | null
  loading: boolean
  isLoggedIn: boolean
  isAdmin: boolean
  canComment: boolean
  canDownloadPdf: boolean
  /* Guarda los tokens y carga el usuario desde /me */
  login: (tokens: { access: string; refresh: string }) => Promise<void>
  logout: () => void
  /* Vuelve a consultar /me (por ejemplo, tras cambiar permisos) */
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null)
  const [loading, setLoading] = useState(true)

  /* ===========
  Cargar usuario autenticado desde /me si hay token guardado
  =========== */
  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const me = await getMe()
      setUser(me)
    } catch (error) {
      console.error('No se pudo cargar el usuario autenticado', error)
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  /* ===========
  Sincronizar sesión entre pestañas (login/logout en otra pestaña)
  =========== */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'refresh_token' || e.key === null) {
        refreshUser()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refreshUser])

  const login = useCallback(
    async (tokens: { access: string; refresh: string }) => {
      setTokens(tokens.access, tokens.refresh)
      setLoading(true)
      await refreshUser()
    },
    [refreshUser]
  )

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const isAdmin = user?.rol === 'admin'
    return {
      user,
      loading,
      isLoggedIn: !!user,
      isAdmin,
      canComment: isAdmin || !!user?.puede_comentar,
      canDownloadPdf: isAdmin || !!user?.puede_descargar_pdfs,
      login,
      logout,
      refreshUser,
    }
  }, [user, loading, login, logout, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }

  return ctx
}
