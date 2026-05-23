'use client'

import { useEffect, useState } from 'react'
import { faChildren } from '@fortawesome/free-solid-svg-icons'
import { getNiveles } from '@/lib/api'
import Hero from '@/components/ui/Hero'
import NavItemCard from '@/components/ui/NavItemCard'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Hero
        eyebrow="Sección de Corderitos"
        title="Niveles de Corderitos"
        description="Selecciona un nivel para acceder a sus temas y revisar el contenido disponible de forma ordenada."
      />

      {loading ? (
        <Skeleton.Grid count={6} />
      ) : error ? (
        <Alert variant="error" title="No se pudieron cargar los niveles">
          {error}
        </Alert>
      ) : niveles.length === 0 ? (
        <EmptyState
          icon={faChildren}
          title="No hay niveles disponibles"
          description="Cuando se agreguen niveles, aparecerán aquí."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {niveles.map((nivel) => (
            <NavItemCard
              key={nivel.id}
              orden={nivel.orden}
              eyebrow="Nivel"
              title={nivel.nombre}
              description="Ingresa para ver los temas y contenidos de este nivel."
              href={`/corderitos/${nivel.id}`}
              cta="Ver temas"
            />
          ))}
        </div>
      )}
    </div>
  )
}
