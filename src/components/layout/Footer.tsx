import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface-elevated">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {year} Bajo una sola voz · Ebenezer San Bernardo
        </p>

        <nav className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-ink">
            Inicio
          </Link>
          <Link href="/corderitos" className="transition-colors hover:text-ink">
            Corderitos
          </Link>
        </nav>
      </div>
    </footer>
  )
}
