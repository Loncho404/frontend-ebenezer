'use client'

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
    <article className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm sm:rounded-[28px]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {titulo}
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {descripcion}
            </p>
          </div>

          {categoria && (
            <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
              {categoria.nombre}
            </span>
          )}
        </div>

        {embedUrl && (
          <div className="mb-6 overflow-hidden rounded-[20px] border border-gray-200 bg-black sm:rounded-[24px]">
            <iframe
              width="100%"
              height="220"
              src={embedUrl}
              title={titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="sm:h-[320px] lg:h-[420px]"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {canDownloadPdf ? (
            <button
              type="button"
              onClick={() => onDownloadPdf(contenidoId)}
              className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-fit"
            >
              Descargar PDF
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              No tienes permisos para descargar este PDF.
            </p>
          )}

          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-center text-sm font-semibold text-gray-700 hover:text-gray-900 sm:text-left"
            >
              Ver en YouTube
            </a>
          )}
        </div>
      </div>
    </article>
  )
}