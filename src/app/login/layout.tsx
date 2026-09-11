import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a Bajo una sola voz, la plataforma de contenidos de Ebenezer San Bernardo.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
