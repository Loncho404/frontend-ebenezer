'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCalendarDays,
  faChildren,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons'
import Hero from '@/components/ui/Hero'
import Button from '@/components/ui/Button'
import MonthlyCalendarCard from '@/components/ui/MonthlyCalendarCard'
import { useAuth } from '@/context/AuthContext'
import { getCalendarioActivo, getNiveles } from '@/lib/api'
import type { CalendarioActivo, Nivel } from '@/lib/types'

export default function HomePage() {
  const { user, loading: loadingUser } = useAuth()

  const [calendario, setCalendario] = useState<CalendarioActivo | null>(null)
  const [niveles, setNiveles] = useState<Nivel[]>([])
  const [loadingNiveles, setLoadingNiveles] = useState(true)

  /* ===========
  Cargar calendario activo y niveles en paralelo.
  Ninguno bloquea al otro: si falla uno, el resto de la página se muestra igual.
  =========== */
  useEffect(() => {
    getCalendarioActivo()
      .then(setCalendario)
      .catch((error) => console.error('No se pudo cargar el calendario activo', error))

    getNiveles()
      .then(setNiveles)
      .catch((error) => console.error('No se pudieron cargar los niveles', error))
      .finally(() => setLoadingNiveles(false))
  }, [])

  const saludo = user ? `Hola, ${user.username}` : 'Bienvenidos a Bajo una sola voz'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Hero
        eyebrow={saludo}
        title="Plataforma de contenidos"
        description="Aquí encontrarás nuestras clases de Corderitos, organizadas por niveles y temas, junto con el calendario de actividades del mes."
        actions={
          <>
            <Button
              as="link"
              href="/corderitos"
              variant="primary"
              size="md"
              rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
            >
              Ir a Corderitos
            </Button>
            {!loadingUser && !user && (
              <Button
                as="link"
                href="/login"
                variant="outline"
                size="md"
                className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
              >
                Iniciar sesión
              </Button>
            )}
          </>
        }
      />

      <section className="mb-10" aria-labelledby="explora">
        <p
          id="explora"
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle"
        >
          Explora la plataforma
        </p>

        <div className="grid gap-5 lg:grid-cols-5">
          <Link
            href="/corderitos"
            className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-7 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)] lg:col-span-2"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-100">
              <FontAwesomeIcon icon={faChildren} className="text-lg" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
              Sección principal
            </p>

            <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Corderitos</h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
              Clases con video, descripción y material en PDF, organizadas por
              niveles y temas para el crecimiento espiritual de los niños.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors group-hover:text-brand-600">
              Explorar niveles
              <FontAwesomeIcon
                icon={faArrowRight}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>

          <div className="rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-7 shadow-[var(--shadow-card)] lg:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                  Acceso rápido
                </p>
                <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Niveles disponibles</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-ink-muted ring-1 ring-inset ring-line">
                <FontAwesomeIcon icon={faLayerGroup} className="text-lg" />
              </span>
            </div>

            {loadingNiveles ? (
              <ul className="mt-5 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="h-12 animate-pulse rounded-[var(--radius-md)] bg-line/60" />
                ))}
              </ul>
            ) : niveles.length === 0 ? (
              <p className="mt-5 rounded-[var(--radius-md)] border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-muted">
                Aún no hay niveles publicados.
              </p>
            ) : (
              <ul className="mt-5 space-y-2">
                {niveles.map((nivel) => (
                  <li key={nivel.id}>
                    <Link
                      href={`/corderitos/${nivel.id}`}
                      className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-50 text-sm font-bold text-brand-600 ring-1 ring-inset ring-brand-100">
                        {nivel.orden}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                        {nivel.nombre}
                      </span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="calendario">
        <p
          id="calendario"
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle"
        >
          Este mes
        </p>

        {calendario ? (
          <MonthlyCalendarCard
            titulo={calendario.titulo}
            imagen={calendario.imagen}
            mesNombre={calendario.mes_nombre}
            anio={calendario.anio}
          />
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong bg-surface-elevated px-6 py-10 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-ink-subtle">
              <FontAwesomeIcon icon={faCalendarDays} className="text-lg" />
            </div>
            <h3 className="text-base font-semibold text-ink">Sin calendario publicado</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
              Cuando se publique el calendario del mes, aparecerá aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
