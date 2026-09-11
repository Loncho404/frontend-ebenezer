import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corderitos',
  description: 'Niveles, temas y clases de Corderitos con video y material de apoyo.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
