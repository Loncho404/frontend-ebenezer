'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCommentDots,
  faShield,
  faPaperPlane,
  faReply,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'

type Comentario = {
  id: number
  usuario_nombre: string
  mensaje: string
  respuesta?: string | null
  fecha_creacion: string
}

type CommentsSectionProps = {
  comentarios: Comentario[]
  canComment: boolean
  isLoggedIn: boolean
  isAdmin: boolean
  onSubmitComment: (mensaje: string) => Promise<void>
  onReplyComment: (comentarioId: number, respuesta: string) => Promise<void>
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export default function CommentsSection({
  comentarios,
  canComment,
  isLoggedIn,
  isAdmin,
  onSubmitComment,
  onReplyComment,
}: CommentsSectionProps) {
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [replyOpenId, setReplyOpenId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState('')

  /* ===========
  Enviar un nuevo comentario
  =========== */
  const handleSubmit = async () => {
    if (!mensaje.trim()) {
      setError('Debes escribir un comentario.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onSubmitComment(mensaje)
      setMensaje('')
    } catch (err: any) {
      setError(err.message || 'No se pudo publicar el comentario.')
    } finally {
      setLoading(false)
    }
  }

  /* ===========
  Abrir o cerrar formulario de respuesta admin
  =========== */
  const toggleReplyBox = (comentarioId: number) => {
    if (replyOpenId === comentarioId) {
      setReplyOpenId(null)
      setReplyText('')
      setReplyError('')
      return
    }

    setReplyOpenId(comentarioId)
    setReplyText('')
    setReplyError('')
  }

  /* ===========
  Enviar respuesta de administrador
  =========== */
  const handleReplySubmit = async (comentarioId: number) => {
    if (!replyText.trim()) {
      setReplyError('Debes escribir una respuesta.')
      return
    }

    try {
      setReplyLoading(true)
      setReplyError('')
      await onReplyComment(comentarioId, replyText)
      setReplyOpenId(null)
      setReplyText('')
    } catch (err: any) {
      setReplyError(err.message || 'No se pudo responder el comentario.')
    } finally {
      setReplyLoading(false)
    }
  }

  return (
    <section className="mt-8 rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
          <FontAwesomeIcon icon={faCommentDots} />
        </span>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Interacción
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">
            Comentarios
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Deja una pregunta o comentario sobre esta clase.
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {comentarios.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-muted/50 px-6 py-8 text-center">
            <p className="text-sm text-ink-muted">
              Todavía no hay comentarios publicados.
            </p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <article
              key={comentario.id}
              className="rounded-[var(--radius-lg)] border border-line bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold uppercase text-brand-700 ring-2 ring-inset ring-surface-elevated">
                  {getInitials(comentario.usuario_nombre)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <p className="break-words text-sm font-semibold text-ink">
                      {comentario.usuario_nombre}
                    </p>

                    <p className="text-xs text-ink-subtle">
                      {new Date(comentario.fecha_creacion).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {comentario.mensaje}
                  </p>
                </div>
              </div>

              {comentario.respuesta && (
                <div className="mt-4 rounded-[var(--radius-md)] border-l-4 border-brand-400 bg-brand-50/60 p-4">
                  <Badge variant="brand" size="sm" className="mb-2">
                    <FontAwesomeIcon icon={faShield} className="text-[9px]" />
                    Respuesta del admin
                  </Badge>
                  <p className="mt-1 text-sm leading-6 text-ink">
                    {comentario.respuesta}
                  </p>
                </div>
              )}

              {isAdmin && !comentario.respuesta && (
                <div className="mt-4 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => toggleReplyBox(comentario.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    <FontAwesomeIcon
                      icon={replyOpenId === comentario.id ? faXmark : faReply}
                      className="text-xs"
                    />
                    {replyOpenId === comentario.id
                      ? 'Cancelar respuesta'
                      : 'Responder como admin'}
                  </button>

                  {replyOpenId === comentario.id && (
                    <div className="mt-4 space-y-3 rounded-[var(--radius-md)] border border-brand-100 bg-brand-50/40 p-4">
                      <Textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe la respuesta del administrador..."
                      />

                      {replyError && (
                        <Alert variant="error">{replyError}</Alert>
                      )}

                      <Button
                        variant="secondary"
                        size="md"
                        loading={replyLoading}
                        onClick={() => handleReplySubmit(comentario.id)}
                        leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                      >
                        Guardar respuesta
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {!isLoggedIn ? (
        <Alert variant="info">
          Debes iniciar sesión para publicar comentarios.
        </Alert>
      ) : canComment ? (
        <div className="space-y-4 border-t border-line pt-6">
          <Textarea
            label="Escribe tu comentario"
            rows={5}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Comparte tu pregunta o comentario..."
          />

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            variant="primary"
            size="md"
            loading={loading}
            onClick={handleSubmit}
            leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
          >
            Publicar comentario
          </Button>
        </div>
      ) : (
        <Alert variant="warning">
          Tu usuario no tiene permisos para comentar en este contenido.
        </Alert>
      )}
    </section>
  )
}
