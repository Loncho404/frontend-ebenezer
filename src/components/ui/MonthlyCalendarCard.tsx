import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import { BACKEND_URL } from '@/lib/api'

type MonthlyCalendarCardProps = {
  titulo: string
  imagen: string
  mesNombre: string
  anio: number
}

export default function MonthlyCalendarCard({
  titulo,
  imagen,
  mesNombre,
  anio,
}: MonthlyCalendarCardProps) {
  /* ===========
  `imagen` puede ser una URL absoluta, una ruta servida por el front
  (/calendarios/...) o una ruta de media del backend (/media/...)
  =========== */
  const imageUrl =
    imagen.startsWith('http') || imagen.startsWith('/calendarios')
      ? imagen
      : `${BACKEND_URL}${imagen.startsWith('/') ? '' : '/'}${imagen}`

  return (
    <section className="rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Calendario del mes
          </p>
          <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">
            {titulo}
          </h2>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink-muted">
          <FontAwesomeIcon icon={faCalendarDays} className="text-brand-600" />
          {mesNombre} {anio}
        </span>
      </div>

      <a
        href={imageUrl}
        target="_blank"
        rel="noreferrer"
        title="Abrir calendario en tamaño completo"
        className="group relative flex justify-center overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-muted p-3 transition-colors hover:border-brand-200 sm:p-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen servida por el backend, tamaño variable */}
        <img
          src={imageUrl}
          alt={`${titulo} · ${mesNombre} ${anio}`}
          className="mx-auto h-auto w-full max-w-4xl object-contain"
          loading="lazy"
        />
        <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className="text-[10px]" />
          Ver en tamaño completo
        </span>
      </a>
    </section>
  )
}
