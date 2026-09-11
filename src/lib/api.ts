import type {
  CalendarioActivo,
  Comentario,
  Contenido,
  Nivel,
  Tema,
  UserMe,
} from '@/lib/types'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

/* ===========
Error de API: conserva el status para que las páginas puedan
distinguir 401/403/404 de un error genérico
=========== */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/* ===========
Tokens: helpers de localStorage (seguros en SSR)
=========== */
const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getAccessToken() {
  return isBrowser() ? localStorage.getItem(ACCESS_KEY) : null
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

/* ===========
Extrae el primer mensaje de error útil de una respuesta DRF
(detail, error, o el primer error de campo)
=========== */
async function extractErrorMessage(response: Response, fallback: string) {
  const data = await response.json().catch(() => null)

  if (!data || typeof data !== 'object') return fallback

  if (typeof data.detail === 'string') return data.detail
  if (typeof data.error === 'string') return data.error

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
    if (typeof value === 'string') return value
  }

  return fallback
}

async function parseOrThrow<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    throw new ApiError(await extractErrorMessage(response, fallback), response.status)
  }
  return response.json()
}

/* ===========
Autenticación: refrescar access token usando refresh token.
Se comparte una única promesa para evitar refrescos concurrentes.
=========== */
let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refresh = localStorage.getItem(REFRESH_KEY)

    if (!refresh) {
      throw new ApiError('No refresh token available', 401)
    }

    const response = await fetch(`${API_URL}/users/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })

    if (!response.ok) {
      clearTokens()
      throw new ApiError('Tu sesión expiró. Vuelve a iniciar sesión.', 401)
    }

    const data = await response.json()
    localStorage.setItem(ACCESS_KEY, data.access)
    return data.access as string
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

/* ===========
fetch autenticado: adjunta el Bearer token y, si el access venció (401),
lo refresca una vez y reintenta la petición.
- auth: 'required' → lanza 401 si no hay token
- auth: 'optional' → envía el token solo si existe
=========== */
type AuthFetchOptions = RequestInit & { auth?: 'required' | 'optional' }

export async function authFetch(
  url: string,
  { auth = 'required', headers, ...init }: AuthFetchOptions = {}
) {
  let token = getAccessToken()

  if (!token && auth === 'required') {
    throw new ApiError('Debes iniciar sesión.', 401)
  }

  const doFetch = (accessToken: string | null) =>
    fetch(url, {
      ...init,
      headers: {
        ...(headers as Record<string, string>),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

  let response = await doFetch(token)

  if (response.status === 401 && token) {
    try {
      token = await refreshAccessToken()
    } catch (error) {
      clearTokens()
      throw error
    }
    response = await doFetch(token)
  }

  return response
}

/* ===========
Autenticación: iniciar sesión
=========== */
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  return parseOrThrow<{ access: string; refresh: string }>(
    response,
    'Error al iniciar sesión'
  )
}

/* ===========
Registro: crear una nueva cuenta de usuario
=========== */
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })

  return parseOrThrow<{ id: number; username: string; email: string }>(
    response,
    'No se pudo registrar el usuario'
  )
}

/* ===========
Usuario actual: obtener datos y permisos del usuario autenticado
=========== */
export async function getMe() {
  const response = await authFetch(`${API_URL}/users/me/`)
  return parseOrThrow<UserMe>(response, 'No se pudo obtener usuario')
}

/* ===========
Contenidos generales: obtener listado de contenidos
=========== */
export async function getContenidos() {
  const response = await authFetch(`${API_URL}/contenidos/`, { auth: 'optional' })
  return parseOrThrow<Contenido[]>(response, 'Error al obtener contenidos')
}

/* ===========
Corderitos: obtener niveles disponibles
=========== */
export async function getNiveles() {
  const response = await fetch(`${API_URL}/corderitos/niveles/`)
  return parseOrThrow<Nivel[]>(response, 'Error al obtener niveles')
}

/* ===========
Corderitos: obtener temas de un nivel específico
=========== */
export async function getTemasPorNivel(nivelId: number) {
  const response = await fetch(`${API_URL}/corderitos/niveles/${nivelId}/temas/`)
  return parseOrThrow<Tema[]>(response, 'Error al obtener temas')
}

/* ===========
Corderitos: obtener el contenido asociado a un tema específico
=========== */
export async function getContenidoPorTema(temaId: number) {
  const response = await fetch(`${API_URL}/corderitos/temas/${temaId}/contenido/`)
  return parseOrThrow<Contenido>(response, 'Error al obtener contenido')
}

/* ===========
Comentarios: obtener comentarios de un contenido
=========== */
export async function getComentarios(contenidoId: number) {
  const response = await fetch(`${API_URL}/contenidos/${contenidoId}/comentarios/`)
  return parseOrThrow<Comentario[]>(response, 'Error al obtener comentarios')
}

/* ===========
Comentarios: crear un nuevo comentario en un contenido
Requiere usuario autenticado
=========== */
export async function createComentario(contenidoId: number, mensaje: string) {
  const response = await authFetch(
    `${API_URL}/contenidos/${contenidoId}/comentarios/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    }
  )

  return parseOrThrow<Comentario>(response, 'Error al crear comentario')
}

/* ===========
Comentarios: responder un comentario como administrador
Requiere usuario autenticado con rol admin
=========== */
export async function responderComentario(
  comentarioId: number,
  respuesta: string
) {
  const response = await authFetch(
    `${API_URL}/comentarios/${comentarioId}/responder/`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuesta }),
    }
  )

  return parseOrThrow<{ mensaje: string }>(
    response,
    'No se pudo responder el comentario'
  )
}

/* ===========
PDF protegido: descargar archivo solo si el usuario tiene permisos
Requiere usuario autenticado y permiso validado por backend
=========== */
export async function downloadProtectedPdf(
  contenidoId: number,
  fallbackFilename = 'documento.pdf'
) {
  const response = await authFetch(
    `${API_URL}/contenidos/${contenidoId}/descargar-pdf/`
  )

  if (!response.ok) {
    throw new ApiError(
      await extractErrorMessage(response, 'No se pudo descargar el PDF'),
      response.status
    )
  }

  // El backend envía Content-Disposition; solo llega si CORS lo expone.
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)
  const filename = match ? decodeURIComponent(match[1]) : fallbackFilename

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)
}

/* ===========
Calendario del mes: obtener el calendario activo para mostrar en inicio
=========== */
export async function getCalendarioActivo() {
  const response = await fetch(`${API_URL}/calendario-activo/`)

  if (response.status === 404) {
    return null
  }

  return parseOrThrow<CalendarioActivo>(
    response,
    'Error al obtener el calendario activo'
  )
}
