'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section
        className="mb-8 rounded-[28px] px-6 py-8 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        style={{
          background: 'linear-gradient(90deg, #182235 0%, #24324a 55%, #50607a 100%)',
        }}
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-orange-300">
            Bienvenidos a Ebenezer San Bernardo
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Plataforma de contenidos
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
            En esta plataforma podrás encontrar nuestras clases de Corderitos,
            organizadas de forma clara y accesible para todos.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <Link
          href="/corderitos"
          className="block rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[32px] sm:p-8"
        >
          <p className="text-sm font-medium text-orange-600">
            Sección principal
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Corderitos
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Accede a los niveles, temas y contenidos formativos organizados
            para el crecimiento espiritual de los niños.
          </p>
        </Link>
      </section>

      {calendario && (
        <section className="mt-10">
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