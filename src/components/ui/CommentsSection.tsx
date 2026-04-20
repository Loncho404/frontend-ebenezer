'use client'

import { useState } from 'react'

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
    <section className="mt-8 rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-orange-600">Interacción</p>
        <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
          Comentarios
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Aquí los usuarios podrán dejar preguntas o comentarios sobre esta clase.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        {comentarios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:p-5">
            <p className="text-sm text-gray-500">
              Todavía no hay comentarios publicados para este contenido.
            </p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
            >
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-gray-900 break-words">
                  {comentario.usuario_nombre}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(comentario.fecha_creacion).toLocaleString()}
                </p>
              </div>

              <p className="text-sm leading-6 text-gray-700">
                {comentario.mensaje}
              </p>

              {comentario.respuesta && (
                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                    Respuesta del administrador
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {comentario.respuesta}
                  </p>
                </div>
              )}

              {isAdmin && !comentario.respuesta && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => toggleReplyBox(comentario.id)}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    {replyOpenId === comentario.id
                      ? 'Cancelar respuesta'
                      : 'Responder como administrador'}
                  </button>

                  {replyOpenId === comentario.id && (
                    <div className="mt-3 space-y-3 rounded-2xl border border-orange-200 bg-white p-4">
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe la respuesta del administrador..."
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-400"
                      />

                      {replyError && (
                        <p className="text-sm text-red-600">{replyError}</p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleReplySubmit(comentario.id)}
                        disabled={replyLoading}
                        className="w-full rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 sm:w-fit"
                      >
                        {replyLoading ? 'Respondiendo...' : 'Guardar respuesta'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!isLoggedIn ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Debes iniciar sesión para comentar.
          </p>
        </div>
      ) : canComment ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Escribe tu comentario
            </label>
            <textarea
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe aquí tu comentario o pregunta..."
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-400"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60 sm:w-fit"
          >
            {loading ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Tu usuario no tiene permisos para comentar en este contenido.
          </p>
        </div>
      )}
    </section>
  )
}