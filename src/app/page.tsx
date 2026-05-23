'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faArrowRight,
  faCalendarDays,
  faChildren,
} from '@fortawesome/free-solid-svg-icons'
import Hero from '@/components/ui/Hero'
import MonthlyCalendarCard from '@/components/ui/MonthlyCalendarCard'
import { getCalendarioActivo } from '@/lib/api'

type CalendarioActivo = {
  id: number
  titulo: string
  imagen: string
  mes: number
  mes_nombre: string
  anio: number
  activo: boolean
  fecha_creacion: string
}

export default function HomePage() {
  const [calendario, setCalendario] = useState<CalendarioActivo | null>(null)

  /* ===========
  Cargar el calendario activo para mostrarlo en la página de inicio
  =========== */
  useEffect(() => {
    const cargarCalendario = async () => {
      try {
        const data = await getCalendarioActivo()
        setCalendario(data)
      } catch (error) {
        console.error('No se pudo cargar el calendario activo', error)
      }
    }

    cargarCalendario()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Hero
        eyebrow="Bienvenidos a Ebenezer San Bernardo"
        title="Plataforma de contenidos"
        description="Aquí encontrarás nuestras clases de Corderitos, organizadas de forma clara y accesible para todos."
      />

      <section className="mb-10">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
          Explora la plataforma
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/corderitos"
            className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-7 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-100">
              <FontAwesomeIcon icon={faChildren} className="text-lg" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
              Sección principal
            </p>

            <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">
              Corderitos
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
              Accede a los niveles, temas y contenidos formativos organizados
              para el crecimiento espiritual de los niños.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors group-hover:text-brand-600">
              Explorar niveles
              <FontAwesomeIcon
                icon={faArrowRight}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>

          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-7 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-ink-muted ring-1 ring-inset ring-line">
              <FontAwesomeIcon icon={faCalendarDays} className="text-lg" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
              Este mes
            </p>

            <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">
              Calendario activo
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
              {calendario
                ? `${calendario.titulo} · ${calendario.mes_nombre} ${calendario.anio}.`
                : 'Revisa el calendario del mes con los próximos eventos.'}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-subtle">
              <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
              {calendario ? 'Disponible más abajo' : 'Sin calendario activo'}
            </div>
          </div>
        </div>
      </section>

      {calendario && (
        <section className="mt-12">
          <MonthlyCalendarCard
            titulo={calendario.titulo}
            imagen={calendario.imagen}
            mesNombre={calendario.mes_nombre}
            anio={calendario.anio}
          />
        </section>
      )}
    </div>
  )
}
