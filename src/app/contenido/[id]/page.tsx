'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ContentCard from '@/components/ui/ContentCard'
import CommentsSection from '@/components/ui/CommentsSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import {
  getContenidoPorTema,
  getMe,
  getComentarios,
  createComentario,
  downloadProtectedPdf,
  responderComentario,
} from '@/lib/api'

type Categoria = {
  id?: number
  nombre: string
}

type Contenido = {
  id: number
  titulo: string
  descripcion: string
  youtube_url: string
  pdf: string
  categoria?: Categoria
}

type UserMe = {
  id: number
  username: string
  email: string
  rol: string
  puede_descargar_pdfs: boolean
  puede_comentar: boolean
  activo_en_plataforma: boolean
}

type Comentario = {
  id: number
  usuario_nombre: string
  mensaje: string
  respuesta?: string | null
  fecha_creacion: string
}

export default function ContenidoPage() {
  const params = useParams()
  const id = params?.id as string

  const [contenido, setContenido] = useState<Contenido | null>(null)
  const [user, setUser] = useState<UserMe | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [downloadMessage, setDownloadMessage] = useState('')
  const [downloadError, setDownloadError] = useState('')

  /* ===========
  Cargar contenido, comentarios y usuario
  =========== */
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true)
        setError('')

        const contenidoData = await getContenidoPorTema(Number(id))
        setContenido(contenidoData)

        const comentariosData = await getComentarios(contenidoData.id)
        setComentarios(comentariosData)

        const token = localStorage.getItem('access_token')

        if (token) {
          try {
            const me = await getMe()
            setUser(me)
          } catch (error) {
            console.error('No se pudo obtener /me', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el contenido.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      cargarTodo()
    }
  }, [id])

  /* ===========
  Crear comentario
  =========== */
  const handleSubmitComment = async (mensaje: string) => {
    if (!contenido) return

    await createComentario(contenido.id, mensaje)

    const comentariosActualizados = await getComentarios(contenido.id)
    setComentarios(comentariosActualizados)
  }

  /* ===========
  Descargar PDF con feedback visual
  =========== */
  const handleDownloadPdf = async (contenidoId: number) => {
    try {
      setDownloadMessage('')
      setDownloadError('')

      await downloadProtectedPdf(contenidoId)

      setDownloadMessage('La descarga del PDF se inició correctamente.')
    } catch (error: any) {
      console.error(error)
      setDownloadError(error.message || 'No se pudo descargar el PDF')
    }
  }

  /* ===========
  Responder comentario como admin
  =========== */
  const handleReplyComment = async (
    comentarioId: number,
    respuesta: string
  ) => {
    if (!contenido) return

    await responderComentario(comentarioId, respuesta)

    const comentariosActualizados = await getComentarios(contenido.id)
    setComentarios(comentariosActualizados)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* ===========
      Breadcrumbs
      =========== */}
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          { label: 'Contenido' },
        ]}
      />

      {/* ===========
      Hero
      =========== */}
      <section className="mb-6 rounded-[28px] bg-gradient-to-r from-[#182235] via-[#24324a] to-[#50607a] px-6 py-8 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-orange-300">
            Contenido del tema
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Visualización de contenido
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
            Aquí podrás revisar el video, la descripción del tema y descargar
            el PDF si tienes acceso autorizado.
          </p>
        </div>
      </section>

      {/* ===========
      Mensajes de descarga
      =========== */}
      {downloadMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {downloadMessage}
        </div>
      )}

      {downloadError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {downloadError}
        </div>
      )}

      {/* ===========
      Estados
      =========== */}
      {loading ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          Cargando contenido...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-red-200 bg-white p-5 shadow-sm">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      ) : !contenido ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
          No se encontró el contenido.
        </div>
      ) : (
        <>
          {/* ===========
          Contenido principal
          =========== */}
          <ContentCard
            contenidoId={contenido.id}
            titulo={contenido.titulo}
            descripcion={contenido.descripcion}
            categoria={contenido.categoria}
            youtubeUrl={contenido.youtube_url}
            canDownloadPdf={
              user?.rol === 'admin' || !!user?.puede_descargar_pdfs
            }
            onDownloadPdf={handleDownloadPdf}
          />

          {/* ===========
          Comentarios
          =========== */}
          <CommentsSection
            comentarios={comentarios}
            isLoggedIn={!!user}
            isAdmin={user?.rol === 'admin'}
            canComment={user?.rol === 'admin' || !!user?.puede_comentar}
            onSubmitComment={handleSubmitComment}
            onReplyComment={handleReplyComment}
          />
        </>
      )}
    </div>
  )
}