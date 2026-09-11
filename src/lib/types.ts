/* ===========
Tipos compartidos que reflejan las respuestas del backend (DRF)
=========== */

export type UserMe = {
  id: number
  username: string
  email: string
  rol: 'admin' | 'usuario'
  puede_descargar_pdfs: boolean
  puede_comentar: boolean
  activo_en_plataforma: boolean
}

export type Categoria = {
  id: number
  nombre: string
}

export type Nivel = {
  id: number
  nombre: string
  orden: number
  activo?: boolean
}

export type Tema = {
  id: number
  nombre: string
  orden: number
  activo?: boolean
  nivel: number
  nivel_nombre?: string
}

export type Contenido = {
  id: number
  titulo: string
  descripcion: string
  youtube_url: string
  pdf: string
  categoria?: Categoria | null
  tema?: Tema | null
  fecha_creacion: string
  activo: boolean
}

export type Comentario = {
  id: number
  contenido: number
  usuario: number
  usuario_nombre: string
  mensaje: string
  respuesta?: string | null
  fecha_creacion: string
}

export type CalendarioActivo = {
  id: number
  titulo: string
  imagen: string
  mes: number
  mes_nombre: string
  anio: number
  activo: boolean
  fecha_creacion: string
}
