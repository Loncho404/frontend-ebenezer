import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Regístrate para comentar las clases de Corderitos.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
