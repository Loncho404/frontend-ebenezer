const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

/* ===========
Autenticación: iniciar sesión
=========== */
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || 'Error al iniciar sesión')
  }

  return response.json()
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })

  if (!response.ok) {
    const data = await response.json()

    const firstError =
      data.username?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      data.detail ||
      'No se pudo registrar el usuario'

    throw new Error(firstError)
  }

  return response.json()
}

/* ===========
Autenticación: refrescar access token usando refresh token
=========== */
export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token')

  if (!refresh) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_URL}/users/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    throw new Error('No se pudo refrescar el token')
  }

  const data = await response.json()

  if (data.access) {
    localStorage.setItem('access_token', data.access)
  }

  return data.access
}

/* ===========
Usuario actual: obtener datos y permisos del usuario autenticado
Si el access token venció, intenta refrescarlo automáticamente
=========== */
export async function getMe() {
  let token = localStorage.getItem('access_token')

  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${API_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  let response = await makeRequest(token)

  if (response.status === 401) {
    try {
      token = await refreshAccessToken()
      response = await makeRequest(token)
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      throw error
    }
  }

  if (!response.ok) {
    throw new Error('No se pudo obtener usuario')
  }

  return response.json()
}

/* ===========
Contenidos generales: obtener listado de contenidos
Si existe token, se envía por si el backend necesita identificar al usuario
=========== */
export async function getContenidos() {
  const token = localStorage.getItem('access_token')

  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/contenidos/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Error al obtener contenidos')
  }

  return response.json()
}

/* ===========
Corderitos: obtener niveles disponibles
=========== */
export async function getNiveles() {
  const response = await fetch(`${API_URL}/corderitos/niveles/`)

  if (!response.ok) {
    throw new Error('Error al obtener niveles')
  }

  return response.json()
}

/* ===========
Corderitos: obtener temas de un nivel específico
=========== */
export async function getTemasPorNivel(nivelId: number) {
  const response = await fetch(`${API_URL}/corderitos/niveles/${nivelId}/temas/`)

  if (!response.ok) {
    throw new Error('Error al obtener temas')
  }

  return response.json()
}

/* ===========
Corderitos: obtener el contenido asociado a un tema específico
=========== */
export async function getContenidoPorTema(temaId: number) {
  const response = await fetch(`${API_URL}/corderitos/temas/${temaId}/contenido/`)

  if (!response.ok) {
    throw new Error('Error al obtener contenido')
  }

  return response.json()
}

/* ===========
Comentarios: obtener comentarios de un contenido
=========== */
export async function getComentarios(contenidoId: number) {
  const response = await fetch(
    `${API_URL}/contenidos/${contenidoId}/comentarios/`
  )

  if (!response.ok) {
    throw new Error('Error al obtener comentarios')
  }

  return response.json()
}

/* ===========
Comentarios: crear un nuevo comentario en un contenido
Requiere usuario autenticado
=========== */
export async function createComentario(contenidoId: number, mensaje: string) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/contenidos/${contenidoId}/comentarios/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mensaje }),
    }
  )

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || 'Error al crear comentario')
  }

  return response.json()
}

/* ===========
PDF protegido: descargar archivo solo si el usuario tiene permisos
Requiere usuario autenticado y permiso validado por backend
=========== */
export async function downloadProtectedPdf(contenidoId: number) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/contenidos/${contenidoId}/descargar-pdf/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'No se pudo descargar el PDF')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = ''
  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)
}

/* ===========
Comentarios: responder un comentario como administrador
Requiere usuario autenticado con rol admin
=========== */
export async function responderComentario(
  comentarioId: number,
  respuesta: string
) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/comentarios/${comentarioId}/responder/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ respuesta }),
    }
  )

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || data.error || 'No se pudo responder el comentario')
  }

  return response.json()
}

/* ===========
Calendario del mes: obtener el calendario activo para mostrar en inicio
=========== */
export async function getCalendarioActivo() {
  const response = await fetch(`${API_URL}/calendario-activo/`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Error al obtener el calendario activo')
  }

  return response.json()
}