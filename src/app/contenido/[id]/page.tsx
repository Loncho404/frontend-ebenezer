'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ContentCard from '@/components/ui/ContentCard'
import CommentsSection from '@/components/ui/CommentsSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Hero from '@/components/ui/Hero'
import Alert from '@/components/ui/Alert'
import Skeleton from '@/components/ui/Skeleton'
import { useAuth } from '@/context/AuthContext'
import {
  ApiError,
  getContenidoPorTema,
  getComentarios,
  createComentario,
  downloadProtectedPdf,
  responderComentario,
} from '@/lib/api'
import type { Comentario, Contenido } from '@/lib/types'

export default function ContenidoPage() {
  const params = useParams()
  const temaId = Number(params?.id)

  const { user, isLoggedIn, isAdmin, canComment, canDownloadPdf } = useAuth()

  const [contenido, setContenido] = useState<Contenido | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  const [downloading, setDownloading] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState('')
  const [downloadError, setDownloadError] = useState('')

  /* ===========
  Cargar contenido y comentarios del tema.
  El usuario viene del AuthProvider, no se vuelve a pedir /me aquí.
  =========== */
  useEffect(() => {
    if (!Number.isFinite(temaId)) return

    let cancelled = false

    const cargarTodo = async () => {
      try {
        setLoading(true)
        setError('')
        setNotFound(false)

        const contenidoData = await getContenidoPorTema(temaId)
        if (cancelled) return
        setContenido(contenidoData)

        const comentariosData = await getComentarios(contenidoData.id)
        if (cancelled) return
        setComentarios(comentariosData)
      } catch (err) {
        if (cancelled) return
        console.error(err)

        // 404: el tema no existe o no tiene contenido activo
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else {
          setError('No se pudo cargar el contenido.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargarTodo()

    return () => {
      cancelled = true
    }
  }, [temaId])

  /* ===========
  Limpiar mensajes de descarga si el usuario cambia (login/logout)
  =========== */
  useEffect(() => {
    setDownloadMessage('')
    setDownloadError('')
  }, [user?.id])

  const recargarComentarios = async () => {
    if (!contenido) return
    setComentarios(await getComentarios(contenido.id))
  }

  /* ===========
  Crear comentario
  =========== */
  const handleSubmitComment = async (mensaje: string) => {
    if (!contenido) return
    await createComentario(contenido.id, mensaje)
    await recargarComentarios()
  }

  /* ===========
  Descargar PDF con feedback visual
  =========== */
  const handleDownloadPdf = async (contenidoId: number) => {
    try {
      setDownloading(true)
      setDownloadMessage('')
      setDownloadError('')

      await downloadProtectedPdf(contenidoId, `${contenido?.titulo ?? 'documento'}.pdf`)

      setDownloadMessage('La descarga del PDF se inició correctamente.')
    } catch (err) {
      console.error(err)
      setDownloadError(
        err instanceof Error ? err.message : 'No se pudo descargar el PDF'
      )
    } finally {
      setDownloading(false)
    }
  }

  /* ===========
  Responder comentario como admin
  =========== */
  const handleReplyComment = async (comentarioId: number, respuesta: string) => {
    if (!contenido) return
    await responderComentario(comentarioId, respuesta)
    await recargarComentarios()
  }

  const tema = contenido?.tema

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          ...(tema
            ? [{ label: tema.nivel_nombre ?? 'Nivel', href: `/corderitos/${tema.nivel}` }]
            : []),
          { label: tema?.nombre ?? 'Contenido' },
        ]}
      />

      <Hero
        compact
        eyebrow={
          tema
            ? [tema.nivel_nombre, `Tema ${tema.orden}`].filter(Boolean).join(' · ')
            : 'Contenido del tema'
        }
        title={tema?.nombre ?? contenido?.titulo ?? 'Contenido del tema'}
        description={contenido?.categoria ? `Categoría: ${contenido.categoria.nombre}` : undefined}
      />

      {downloadMessage && (
        <div className="mb-6">
          <Alert variant="success">{downloadMessage}</Alert>
        </div>
      )}

      {downloadError && (
        <div className="mb-6">
          <Alert variant="error">{downloadError}</Alert>
        </div>
      )}

      {loading ? (
        <Skeleton.Content />
      ) : error ? (
        <Alert variant="error" title="No se pudo cargar el contenido">
          {error}
        </Alert>
      ) : notFound || !contenido ? (
        <Alert variant="warning" title="Contenido no disponible">
          Este tema aún no tiene contenido publicado o fue desactivado.
        </Alert>
      ) : (
        <>
          <ContentCard
            contenidoId={contenido.id}
            temaId={temaId}
            titulo={contenido.titulo}
            descripcion={contenido.descripcion}
            categoria={contenido.categoria ?? undefined}
            youtubeUrl={contenido.youtube_url}
            isLoggedIn={isLoggedIn}
            canDownloadPdf={canDownloadPdf}
            downloading={downloading}
            onDownloadPdf={handleDownloadPdf}
          />

          <CommentsSection
            comentarios={comentarios}
            loginHref={`/login?next=${encodeURIComponent(`/contenido/${temaId}`)}`}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            canComment={canComment}
            onSubmitComment={handleSubmitComment}
            onReplyComment={handleReplyComment}
          />
        </>
      )}
    </div>
  )
}
