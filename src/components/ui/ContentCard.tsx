'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilePdf,
  faArrowUpRightFromSquare,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

type Categoria = {
  id: number
  nombre: string
}

type ContentCardProps = {
  contenidoId: number
  titulo: string
  descripcion: string
  categoria?: Categoria
  youtubeUrl?: string
  canDownloadPdf: boolean
  onDownloadPdf: (contenidoId: number) => Promise<void>
}

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.replace('/', '')
      return `https://www.youtube.com/embed/${videoId}`
    }

    const videoId = parsedUrl.searchParams.get('v')
    if (!videoId) return ''

    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return ''
  }
}

export default function ContentCard({
  contenidoId,
  titulo,
  descripcion,
  categoria,
  youtubeUrl,
  canDownloadPdf,
  onDownloadPdf,
}: ContentCardProps) {
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl)

  return (
    <article className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-elevated shadow-[var(--shadow-card)]">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {categoria && (
              <Badge variant="brand" size="md" className="mb-3">
                {categoria.nombre}
              </Badge>
            )}

            <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {titulo}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">
              {descripcion}
            </p>
          </div>
        </div>

        {embedUrl && (
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-black">
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-line bg-surface-muted/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {canDownloadPdf ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => onDownloadPdf(contenidoId)}
            leftIcon={<FontAwesomeIcon icon={faFilePdf} />}
          >
            Descargar PDF
          </Button>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-ink-subtle">
            <FontAwesomeIcon icon={faLock} className="text-xs" />
            No tienes permisos para descargar el PDF.
          </p>
        )}

        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600"
          >
            Ver en YouTube
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
          </a>
        )}
      </div>
    </article>
  )
}
