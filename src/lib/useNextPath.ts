'use client'

import { useSearchParams } from 'next/navigation'

/* ===========
Lee ?next= y devuelve solo rutas internas (evita redirecciones abiertas)
=========== */
export function useNextPath(fallback = '/') {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next
  }

  return fallback
}
