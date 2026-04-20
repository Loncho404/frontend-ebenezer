'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isInicio = pathname === '/'
  const isCorderitos =
    pathname.startsWith('/corderitos') || pathname.startsWith('/contenido')

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-[#f7f7f8] px-4 py-6 lg:block">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
        Navegación
      </p>

      <nav className="space-y-3">
        <Link
          href="/"
          className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
            isInicio
              ? 'bg-orange-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Inicio
        </Link>

        <Link
          href="/corderitos"
          className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
            isCorderitos
              ? 'bg-orange-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Corderitos
        </Link>
      </nav>

      <div className="mt-10 rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Sección activa
        </h3>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          {isInicio
            ? 'Resumen y acceso rápido a la plataforma.'
            : 'Aquí se organizan niveles, temas y contenidos de Corderitos.'}
        </p>
      </div>
    </aside>
  )
}