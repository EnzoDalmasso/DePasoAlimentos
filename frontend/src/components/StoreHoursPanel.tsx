import { useEffect, useState } from 'react'
import type {
  BusinessHour,
  SpecialBusinessDay,
  StoreHours,
} from '../types/storeHours'

type StoreHoursPanelProps = {
  storeHours: StoreHours
}

type TimeRange = {
  label?: string
  value: string
}

function getTodayDateValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatTimeRange(item: BusinessHour | SpecialBusinessDay) {
  if (!item.isOpen) {
    return 'Cerrado'
  }

  if (!item.openTime || !item.closeTime) {
    return 'Horario a confirmar'
  }

  const firstRange = `${item.openTime} a ${item.closeTime}`

  if (item.secondOpenTime && item.secondCloseTime) {
    return `${firstRange} / ${item.secondOpenTime} a ${item.secondCloseTime}`
  }

  return firstRange
}

function getTimeRanges(item?: BusinessHour | SpecialBusinessDay): TimeRange[] {
  if (!item) {
    return [{ value: 'A confirmar' }]
  }

  if (!item.isOpen) {
    return [{ value: 'Cerrado' }]
  }

  if (!item.openTime || !item.closeTime) {
    return [{ value: 'Horario a confirmar' }]
  }

  const ranges: TimeRange[] = [
    {
      label: item.secondOpenTime && item.secondCloseTime ? 'Manana' : undefined,
      value: `${item.openTime} a ${item.closeTime}`,
    },
  ]

  if (item.secondOpenTime && item.secondCloseTime) {
    ranges.push({
      label: 'Tarde',
      value: `${item.secondOpenTime} a ${item.secondCloseTime}`,
    })
  }

  return ranges
}

function TodayTimeRanges({
  ranges,
  size = 'compact',
}: {
  ranges: TimeRange[]
  size?: 'compact' | 'large'
}) {
  const valueClassName =
    size === 'large'
      ? 'text-xl font-black text-[#0e351e] sm:text-2xl'
      : 'text-base font-black text-[#0e351e] sm:text-lg'

  return (
    <div className="mt-2 grid gap-1.5">
      {ranges.map((range) => (
        <div
          key={`${range.label ?? 'horario'}-${range.value}`}
          className="flex items-baseline justify-between gap-3 rounded-md bg-[#f8fff5] px-3 py-2"
        >
          {range.label && (
            <span className="text-xs font-black uppercase tracking-wide text-[#416343]">
              {range.label}
            </span>
          )}

          <span className={valueClassName}>{range.value}</span>
        </div>
      ))}
    </div>
  )
}

function formatSpecialDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function StoreHoursPanel({ storeHours }: StoreHoursPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const todayDate = getTodayDateValue()
  const todayDayOfWeek = new Date().getDay()
  const todaySpecialDay = storeHours.specialDays.find(
    (specialDay) => specialDay.date === todayDate,
  )
  const todayBusinessHour = storeHours.weeklyHours.find(
    (businessHour) => businessHour.dayOfWeek === todayDayOfWeek,
  )
  const todaySchedule = todaySpecialDay ?? todayBusinessHour
  const todayTimeRanges = getTimeRanges(todaySchedule)
  const upcomingSpecialDays = storeHours.specialDays
    .filter((specialDay) => specialDay.date >= todayDate)
    .slice(0, 3)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!todaySchedule && storeHours.weeklyHours.length === 0) {
    return null
  }

  return (
    <>
      <section className="mt-4 rounded-lg border border-[#cbe5c9] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#b83924]">
              Horarios de atencion
            </p>

            <TodayTimeRanges ranges={todayTimeRanges} />

            {todaySpecialDay?.reason && (
              <p className="mt-1 text-sm font-bold leading-6 text-[#416343]">
                {todaySpecialDay.reason}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-[#15552a] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0e351e] focus:outline-none focus:ring-2 focus:ring-[#15552a] focus:ring-offset-2"
          >
            Ver horarios
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e351e]/65 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <section
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#cbe5c9] bg-[#f8fff5] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#d9ead7] bg-white p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#b83924]">
                  Horarios
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#0e351e]">
                  Atencion y retiro
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-[#416343]">
                  Los horarios pueden cambiar por feriados o imprevistos. Las
                  compras se coordinan por WhatsApp antes del retiro.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-[#cbe5c9] px-3 py-1.5 text-sm font-bold text-[#416343] transition hover:bg-[#eaf8ed]"
              >
                Cerrar
              </button>
            </header>

            <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-black uppercase tracking-wide text-[#15552a]">
                  Hoy
                </p>

                <TodayTimeRanges ranges={todayTimeRanges} size="large" />

                {todaySpecialDay?.reason && (
                  <p className="mt-2 text-sm font-bold leading-6 text-[#416343]">
                    {todaySpecialDay.reason}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#15552a]">
                    Semana
                  </h3>

                  <ul className="mt-3 grid gap-2 text-sm">
                    {storeHours.weeklyHours.map((businessHour) => (
                      <li
                        key={businessHour.id}
                        className="flex items-center justify-between gap-3 border-b border-[#d9ead7] pb-2 last:border-0"
                      >
                        <span className="font-bold text-[#0e351e]">
                          {businessHour.dayName}
                        </span>

                        <span className="text-right font-semibold text-[#416343]">
                          {formatTimeRange(businessHour)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#15552a]">
                    Dias especiales
                  </h3>

                  {upcomingSpecialDays.length === 0 ? (
                    <p className="mt-3 text-sm leading-6 text-[#416343]">
                      No hay feriados o cambios cargados.
                    </p>
                  ) : (
                    <ul className="mt-3 grid gap-2 text-sm">
                      {upcomingSpecialDays.map((specialDay) => (
                        <li
                          key={specialDay.id}
                          className="rounded-md border border-[#d9ead7] bg-[#f8fff5] p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold text-[#0e351e]">
                              {formatSpecialDate(specialDay.date)}
                            </span>

                            <span className="font-semibold text-[#b83924]">
                              {formatTimeRange(specialDay)}
                            </span>
                          </div>

                          {specialDay.reason && (
                            <p className="mt-1 text-[#416343]">
                              {specialDay.reason}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
