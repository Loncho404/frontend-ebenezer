import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faHouse, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <span className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-brand-50 text-2xl text-brand-600 ring-1 ring-inset ring-brand-100">
        <FontAwesomeIcon icon={faCompass} />
      </span>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
        Error 404
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Puede que el enlace esté mal escrito o que el contenido haya sido movido.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button as="link" href="/" variant="primary" size="md" leftIcon={<FontAwesomeIcon icon={faHouse} />}>
          Volver al inicio
        </Button>
        <Button as="link" href="/corderitos" variant="outline" size="md" leftIcon={<FontAwesomeIcon icon={faBookOpen} />}>
          Ver Corderitos
        </Button>
      </div>
    </div>
  )
}
