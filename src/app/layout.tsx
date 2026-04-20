import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

config.autoAddCss = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f5f5f7] text-gray-900">
        <Header />
        <div className="flex min-h-[calc(100vh-80px)]">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}