import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Migas de pan"
      className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-ink-subtle transition-colors hover:text-brand-600"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'font-medium text-ink' : 'text-ink-subtle'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-[10px] text-ink-subtle/60"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
