'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ContentCard from '@/components/ui/ContentCard'
import CommentsSection from '@/components/ui/CommentsSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Hero from '@/components/ui/Hero'
import Alert from '@/components/ui/Alert'
import Skeleton from '@/components/ui/Skeleton'
import {
  getContenidoPorTema,
  getMe,
  getComentarios,
  createComentario,
  downloadProtectedPdf,
  responderComentario,
} from '@/lib/api'

type Categoria = {
  id: number
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          { label: 'Contenido' },
        ]}
      />

      <Hero
        eyebrow="Contenido del tema"
        title={contenido?.titulo ?? 'Visualización de contenido'}
        description="Revisa el video, la descripción del tema y descarga el PDF si tienes acceso autorizado."
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
      ) : !contenido ? (
        <Alert variant="warning" title="Contenido no encontrado">
          No se encontró el contenido solicitado.
        </Alert>
      ) : (
        <>
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
