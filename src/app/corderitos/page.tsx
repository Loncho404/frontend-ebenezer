'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getNiveles } from '@/lib/api'

type Nivel = {
  id: number
  nombre: string
  orden: number
  activo?: boolean
}

export default function CorderitosPage() {
  const [niveles, setNiveles] = useState<Nivel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ===========
  Cargar niveles de Corderitos desde el backend
  =========== */
  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getNiveles()
        setNiveles(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los niveles.')
      } finally {
        setLoading(false)
      }
    }

    cargarNiveles()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* ===========
      Encabezado de la sección
      =========== */}
      <section className="mb-8 rounded-[28px] bg-gradient-to-r from-[#182235] via-[#24324a] to-[#50607a] px-6 py-8 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-orange-300">
            Sección de Corderitos
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Niveles de Corderitos
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
            Selecciona un nivel para acceder a sus temas y revisar el contenido
            disponible de forma ordenada.
          </p>
        </div>
      </section>

      {/* ===========
      Estados de carga, error o listado de niveles
      =========== */}
      {loading ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          Cargando niveles...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-red-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      ) : niveles.length === 0 ? (
        <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
          No hay niveles disponibles.
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {niveles.map((nivel) => (
            <Link
              key={nivel.id}
              href={`/corderitos/${nivel.id}`}
              className="group rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-sm font-bold text-orange-600 sm:h-12 sm:w-12 sm:text-base">
                {nivel.orden}
              </div>

              <p className="text-sm font-medium text-orange-600">Nivel</p>

              <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                {nivel.nombre}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Ingresa a este nivel para ver sus temas y contenidos.
              </p>

              <div className="mt-6 text-sm font-semibold text-gray-700 group-hover:text-orange-600">
                Ver temas →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}