'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { getTemasPorNivel } from '@/lib/api'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Hero from '@/components/ui/Hero'
import NavItemCard from '@/components/ui/NavItemCard'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          { label: `Nivel ${nivelId}` },
        ]}
      />

      <Hero
        eyebrow="Nivel seleccionado"
        title={`Temas del nivel ${nivelId}`}
        description="Selecciona un tema para ver su contenido completo: video, descripción y descarga de PDF."
      />

      {loading ? (
        <Skeleton.Grid count={6} />
      ) : error ? (
        <Alert variant="error" title="No se pudieron cargar los temas">
          {error}
        </Alert>
      ) : temas.length === 0 ? (
        <EmptyState
          icon={faBookOpen}
          title="No hay temas disponibles"
          description="Este nivel aún no tiene temas publicados."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {temas.map((tema) => (
            <NavItemCard
              key={tema.id}
              orden={tema.orden}
              eyebrow="Tema"
              title={tema.nombre}
              description="Haz clic para revisar el contenido asociado a este tema."
              href={`/contenido/${tema.id}`}
              cta="Ver contenido"
            />
          ))}
        </div>
      )}
    </div>
  )
}
