import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { AuthProvider } from '@/context/AuthContext'

config.autoAddCss = false

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <AuthProvider>
          <Header />
          <div className="flex min-h-[calc(100vh-var(--header-h))]">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
