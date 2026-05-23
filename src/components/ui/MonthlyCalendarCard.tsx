import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

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
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

  let imageUrl = imagen

  if (imagen.startsWith('http')) {
    imageUrl = imagen
  } else if (imagen.startsWith('/calendarios')) {
    imageUrl = imagen
  } else {
    imageUrl = `${backendUrl}${imagen}`
  }

  return (
    <section className="mx-auto max-w-4xl rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-6 shadow-[var(--shadow-card)] sm:p-8">
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

      <div className="flex justify-center overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-muted p-4">
        <img
          src={imageUrl}
          alt={titulo}
          className="mx-auto h-auto max-h-[280px] w-auto object-contain sm:max-h-[400px] lg:max-h-[520px]"
        />
      </div>
    </section>
  )
}
