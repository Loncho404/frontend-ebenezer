type MonthlyCalendarCardProps = {
  titulo: string
  imagen: string
  mesNombre: string
  anio: number
}

export default function MonthlyCalendarCard({
  titulo,
  imagen,
  mesNombre,
  anio,
}: MonthlyCalendarCardProps) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

  const imageUrl = imagen.startsWith('http')
    ? imagen
    : `${backendUrl}${imagen}`

  return (
    <section className="mx-auto max-w-4xl rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500">Calendario del mes</p>

        <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
          {titulo}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {mesNombre} {anio}
        </p>
      </div>

      <div className="flex justify-center overflow-hidden rounded-[18px] border border-gray-200 bg-gray-50 p-3 sm:rounded-[20px] sm:p-4">
        <img
          src={imageUrl}
          alt={titulo}
          className="mx-auto h-auto max-h-[260px] w-auto object-contain sm:max-h-[360px] lg:max-h-[500px]"
        />
      </div>
    </section>
  )
}