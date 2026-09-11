import type { Metadata, Viewport } from 'next'
import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

config.autoAddCss = false

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_NAME = 'Bajo una sola voz'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} · Plataforma de contenidos`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Bajo una sola voz: clases de Corderitos, calendario mensual y material de apoyo de la iglesia Ebenezer San Bernardo.',
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.ico', apple: '/logo.png' },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'es_CL',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <AuthProvider>
          <a
            href="#contenido-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Saltar al contenido
          </a>

          <Header />

          <div className="flex min-h-[calc(100vh-var(--header-h))]">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <main id="contenido-principal" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
