import type {
  BusinessHour,
  SpecialBusinessDay,
  StoreHours,
} from '../types/storeHours'

type StoreHoursPanelProps = {
  storeHours: StoreHours
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

function formatSpecialDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function StoreHoursPanel({ storeHours }: StoreHoursPanelProps) {
  const todayDate = getTodayDateValue()
  const todayDayOfWeek = new Date().getDay()
  const todaySpecialDay = storeHours.specialDays.find(
    (specialDay) => specialDay.date === todayDate,
  )
  const todayBusinessHour = storeHours.weeklyHours.find(
    (businessHour) => businessHour.dayOfWeek === todayDayOfWeek,
  )
  const todaySchedule = todaySpecialDay ?? todayBusinessHour
  const upcomingSpecialDays = storeHours.specialDays
    .filter((specialDay) => specialDay.date >= todayDate)
    .slice(0, 3)

  if (!todaySchedule && storeHours.weeklyHours.length === 0) {
    return null
  }

  return (
    <section className="mt-6 rounded-lg border border-[#d9c891] bg-[#fffaf0] p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#b3321f]">
            Horarios
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#123f1c]">
            Hoy: {todaySchedule ? formatTimeRange(todaySchedule) : 'A confirmar'}
          </h2>

          {todaySpecialDay?.reason && (
            <p className="mt-2 text-sm font-bold leading-6 text-[#416343]">
              {todaySpecialDay.reason}
            </p>
          )}

          <p className="mt-3 text-sm leading-6 text-[#416343]">
            Los horarios pueden cambiar por feriados o imprevistos. Las compras
            se coordinan por WhatsApp antes del retiro.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#416343]">
              Semana
            </h3>

            <ul className="mt-3 grid gap-2 text-sm">
              {storeHours.weeklyHours.map((businessHour) => (
                <li
                  key={businessHour.id}
                  className="flex items-center justify-between gap-3 border-b border-[#ead9a0] pb-2 last:border-0"
                >
                  <span className="font-bold text-[#123f1c]">
                    {businessHour.dayName}
                  </span>

                  <span className="text-right font-semibold text-[#416343]">
                    {formatTimeRange(businessHour)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#416343]">
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
                    className="rounded-md border border-[#ead9a0] bg-white/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-[#123f1c]">
                        {formatSpecialDate(specialDay.date)}
                      </span>

                      <span className="font-semibold text-[#b3321f]">
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
  )
}
