'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { getNiveles, getTemasPorNivel } from '@/lib/api'
import type { Nivel, Tema } from '@/lib/types'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Hero from '@/components/ui/Hero'
import NavItemCard from '@/components/ui/NavItemCard'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

export default function NivelPage() {
  const params = useParams()
  const nivelId = Number(params?.nivelId)

  const [nivel, setNivel] = useState<Nivel | null>(null)
  const [temas, setTemas] = useState<Tema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ===========
  Cargar temas del nivel seleccionado y el nombre del nivel.
  Los temas traen `nivel_nombre`; si el nivel no tiene temas, se busca en el listado.
  =========== */
  useEffect(() => {
    if (!Number.isFinite(nivelId)) return

    let cancelled = false

    const cargar = async () => {
      try {
        setLoading(true)
        setError('')

        const temasData = await getTemasPorNivel(nivelId)
        if (cancelled) return
        setTemas(temasData)

        const nombreDesdeTemas = temasData[0]?.nivel_nombre
        if (nombreDesdeTemas) {
          setNivel({ id: nivelId, nombre: nombreDesdeTemas, orden: 0 })
          return
        }

        const nivelesData = await getNiveles().catch(() => [] as Nivel[])
        if (cancelled) return
        setNivel(nivelesData.find((n) => n.id === nivelId) ?? null)
      } catch (err) {
        if (cancelled) return
        console.error(err)
        setError('No se pudieron cargar los temas.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [nivelId])

  const nombreNivel = nivel?.nombre ?? `Nivel ${nivelId}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Corderitos', href: '/corderitos' },
          { label: nombreNivel },
        ]}
      />

      <Hero
        compact
        eyebrow="Nivel seleccionado"
        title={nombreNivel}
        description={
          temas.length > 0
            ? `${temas.length} ${temas.length === 1 ? 'tema disponible' : 'temas disponibles'} · video, descripción y PDF.`
            : 'Selecciona un tema para ver su clase completa.'
        }
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
