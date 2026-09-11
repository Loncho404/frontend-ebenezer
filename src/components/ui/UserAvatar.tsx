type UserAvatarProps = {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
}

/* ===========
Avatar con iniciales (no hay fotos de perfil en la plataforma)
=========== */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold uppercase text-brand-700 ring-2 ring-inset ring-surface-elevated ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name) || '?'}
    </span>
  )
}
