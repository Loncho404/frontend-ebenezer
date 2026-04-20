'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getTemasPorNivel } from '@/lib/api'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

type Tema = {
  id: number
  nombre: string
  orden: number
  activo?: boolean
}

export default function NivelPage() {
  const params = useParams()
  const nivelId = params?.nivelId as string

  const [temas, setTemas] = useState<Tema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ===========
  Cargar temas del nivel seleccionado
  =========== */
  useEffect(() => {
    const cargarTemas = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getTemasPorNivel(Number(nivelId))
        setTemas(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los temas.')
      } finally {
        setLoading(false)
      }
    }

    if (nivelId) {
      cargarTemas()
    }
  }, [nivelId])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          { label: `Nivel ${nivelId}` },
        ]}
      />
      {/* ===========
      Encabezado de la vista de temas
      =========== */}
      <section className="mb-8 rounded-[28px] bg-gradient-to-r from-[#182235] via-[#24324a] to-[#50607a] px-6 py-8 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-orange-300">
            Nivel seleccionado
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Temas del nivel {nivelId}
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
            Selecciona un tema para ver su contenido completo, incluyendo video,
            descripción y descarga de PDF.
          </p>
        </div>
      </section>

      {/* ===========
      Estados de carga, error o listado de temas
      =========== */}
      {loading ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          Cargando temas...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-red-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      ) : temas.length === 0 ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          No hay temas disponibles para este nivel.
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {temas.map((tema) => (
            <Link
              key={tema.id}
              href={`/contenido/${tema.id}`}
              className="group rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-sm font-bold text-orange-600 sm:h-12 sm:w-12 sm:text-base">
                {tema.orden}
              </div>

              <p className="text-sm font-medium text-orange-600">Tema</p>

              <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                {tema.nombre}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Haz clic para revisar el contenido asociado a este tema.
              </p>

              <div className="mt-6 text-sm font-semibold text-gray-700 group-hover:text-orange-600">
                Ver contenido →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}