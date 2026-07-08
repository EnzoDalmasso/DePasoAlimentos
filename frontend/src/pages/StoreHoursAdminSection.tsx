import { useEffect, useState, type FormEvent } from 'react'
import {
  createSpecialBusinessDay,
  deleteSpecialBusinessDay,
  getStoreHours,
  updateBusinessHour,
  updateSpecialBusinessDay,
} from '../services/storeHoursApi'
import type {
  BusinessHour,
  SpecialBusinessDay,
  StoreHours,
} from '../types/storeHours'

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

export function StoreHoursAdminSection() {
  const [storeHours, setStoreHours] = useState<StoreHours | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [savingBusinessHourId, setSavingBusinessHourId] = useState<
    number | null
  >(null)

  const [editingSpecialDayId, setEditingSpecialDayId] = useState<number | null>(
    null,
  )
  const [specialDate, setSpecialDate] = useState('')
  const [specialIsOpen, setSpecialIsOpen] = useState(false)
  const [specialOpenTime, setSpecialOpenTime] = useState('')
  const [specialCloseTime, setSpecialCloseTime] = useState('')
  const [specialSecondOpenTime, setSpecialSecondOpenTime] = useState('')
  const [specialSecondCloseTime, setSpecialSecondCloseTime] = useState('')
  const [specialReason, setSpecialReason] = useState('')
  const [isSavingSpecialDay, setIsSavingSpecialDay] = useState(false)
  const [deletingSpecialDayId, setDeletingSpecialDayId] = useState<
    number | null
  >(null)

  const isEditingSpecialDay = editingSpecialDayId !== null

  useEffect(() => {
    loadStoreHours()
  }, [])

  async function loadStoreHours() {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const storeHoursFromApi = await getStoreHours()
      setStoreHours(storeHoursFromApi)
    } catch {
      setErrorMessage('No pudimos cargar los horarios.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleBusinessHourChange(
    id: number,
    changes: Partial<BusinessHour>,
  ) {
    setStoreHours((currentStoreHours) => {
      if (!currentStoreHours) {
        return currentStoreHours
      }

      return {
        ...currentStoreHours,
        weeklyHours: currentStoreHours.weeklyHours.map((businessHour) =>
          businessHour.id === id
            ? { ...businessHour, ...changes }
            : businessHour,
        ),
      }
    })
  }

  async function handleSaveBusinessHour(businessHour: BusinessHour) {
    try {
      setSavingBusinessHourId(businessHour.id)
      setErrorMessage(null)
      setSuccessMessage(null)

      await updateBusinessHour(businessHour.id, {
        isOpen: businessHour.isOpen,
        openTime: businessHour.isOpen ? businessHour.openTime : null,
        closeTime: businessHour.isOpen ? businessHour.closeTime : null,
        secondOpenTime: businessHour.isOpen
          ? businessHour.secondOpenTime
          : null,
        secondCloseTime: businessHour.isOpen
          ? businessHour.secondCloseTime
          : null,
        notes: businessHour.notes,
      })

      setSuccessMessage(`Horario de ${businessHour.dayName} actualizado.`)
    } catch {
      setErrorMessage(
        'No pudimos guardar el horario. Revisa que los horarios sean validos.',
      )
    } finally {
      setSavingBusinessHourId(null)
    }
  }

  async function handleSubmitSpecialDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSavingSpecialDay(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const payload = {
        date: specialDate,
        isOpen: specialIsOpen,
        openTime: specialIsOpen ? specialOpenTime : null,
        closeTime: specialIsOpen ? specialCloseTime : null,
        secondOpenTime: specialIsOpen ? specialSecondOpenTime || null : null,
        secondCloseTime: specialIsOpen ? specialSecondCloseTime || null : null,
        reason: specialReason,
      }

      if (isEditingSpecialDay) {
        await updateSpecialBusinessDay(editingSpecialDayId, payload)
        setSuccessMessage('Dia especial actualizado.')
      } else {
        await createSpecialBusinessDay(payload)
        setSuccessMessage('Dia especial creado.')
      }

      resetSpecialDayForm()
      await loadStoreHours()
    } catch {
      setErrorMessage(
        'No pudimos guardar el dia especial. Revisa fecha y horarios.',
      )
    } finally {
      setIsSavingSpecialDay(false)
    }
  }

  function handleStartEditingSpecialDay(specialDay: SpecialBusinessDay) {
    setEditingSpecialDayId(specialDay.id)
    setSpecialDate(specialDay.date)
    setSpecialIsOpen(specialDay.isOpen)
    setSpecialOpenTime(specialDay.openTime ?? '')
    setSpecialCloseTime(specialDay.closeTime ?? '')
    setSpecialSecondOpenTime(specialDay.secondOpenTime ?? '')
    setSpecialSecondCloseTime(specialDay.secondCloseTime ?? '')
    setSpecialReason(specialDay.reason)
  }

  function resetSpecialDayForm() {
    setEditingSpecialDayId(null)
    setSpecialDate('')
    setSpecialIsOpen(false)
    setSpecialOpenTime('')
    setSpecialCloseTime('')
    setSpecialSecondOpenTime('')
    setSpecialSecondCloseTime('')
    setSpecialReason('')
  }

  async function handleDeleteSpecialDay(specialDay: SpecialBusinessDay) {
    const confirmed = window.confirm(
      `Seguro que queres eliminar el dia especial ${specialDay.date}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingSpecialDayId(specialDay.id)
      setErrorMessage(null)
      setSuccessMessage(null)

      await deleteSpecialBusinessDay(specialDay.id)

      if (editingSpecialDayId === specialDay.id) {
        resetSpecialDayForm()
      }

      setStoreHours((currentStoreHours) => {
        if (!currentStoreHours) {
          return currentStoreHours
        }

        return {
          ...currentStoreHours,
          specialDays: currentStoreHours.specialDays.filter(
            (currentSpecialDay) => currentSpecialDay.id !== specialDay.id,
          ),
        }
      })

      setSuccessMessage('Dia especial eliminado.')
    } catch {
      setErrorMessage('No pudimos eliminar el dia especial.')
    } finally {
      setDeletingSpecialDayId(null)
    }
  }

  if (isLoading) {
    return (
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Cargando horarios...</p>
      </section>
    )
  }

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Horarios</h2>

        <p className="mt-1 text-sm text-slate-600">
          Edita el horario semanal y carga feriados o cambios especiales.
        </p>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-emerald-700">{successMessage}</p>
      )}

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5">
        <h3 className="font-semibold text-slate-950">Horario semanal</h3>

        <div className="grid gap-3">
          {storeHours?.weeklyHours.map((businessHour) => (
            <article
              key={businessHour.id}
              className="grid gap-3 rounded-lg border border-slate-200 p-4 xl:grid-cols-[9rem_1fr_auto]"
            >
              <div>
                <p className="font-semibold text-slate-950">
                  {businessHour.dayName}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {formatTimeRange(businessHour)}
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-[auto_repeat(4,minmax(0,1fr))_minmax(0,1.3fr)]">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={businessHour.isOpen}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        isOpen: event.target.checked,
                      })
                    }
                  />
                  Abierto
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Apertura manana
                  <input
                    type="time"
                    value={businessHour.openTime ?? ''}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        openTime: event.target.value,
                      })
                    }
                    disabled={!businessHour.isOpen}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Cierre manana
                  <input
                    type="time"
                    value={businessHour.closeTime ?? ''}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        closeTime: event.target.value,
                      })
                    }
                    disabled={!businessHour.isOpen}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Apertura tarde
                  <input
                    type="time"
                    value={businessHour.secondOpenTime ?? ''}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        secondOpenTime: event.target.value,
                      })
                    }
                    disabled={!businessHour.isOpen}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Cierre tarde
                  <input
                    type="time"
                    value={businessHour.secondCloseTime ?? ''}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        secondCloseTime: event.target.value,
                      })
                    }
                    disabled={!businessHour.isOpen}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Nota
                  <input
                    value={businessHour.notes}
                    onChange={(event) =>
                      handleBusinessHourChange(businessHour.id, {
                        notes: event.target.value,
                      })
                    }
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="Ej: Cerrado"
                  />
                </label>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleSaveBusinessHour(businessHour)}
                  disabled={savingBusinessHourId === businessHour.id}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {savingBusinessHourId === businessHour.id
                    ? 'Guardando...'
                    : 'Guardar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t border-slate-200 pt-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form onSubmit={handleSubmitSpecialDay} className="grid gap-3">
          <div>
            <h3 className="font-semibold text-slate-950">
              {isEditingSpecialDay ? 'Editar dia especial' : 'Crear dia especial'}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Usalo para feriados, cierres imprevistos o cambios de horario.
            </p>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Fecha
            <input
              type="date"
              value={specialDate}
              onChange={(event) => setSpecialDate(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={specialIsOpen}
              onChange={(event) => setSpecialIsOpen(event.target.checked)}
            />
            Abre ese dia
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Apertura manana
              <input
                type="time"
                value={specialOpenTime}
                onChange={(event) => setSpecialOpenTime(event.target.value)}
                disabled={!specialIsOpen}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Cierre manana
              <input
                type="time"
                value={specialCloseTime}
                onChange={(event) => setSpecialCloseTime(event.target.value)}
                disabled={!specialIsOpen}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Apertura tarde
              <input
                type="time"
                value={specialSecondOpenTime}
                onChange={(event) => setSpecialSecondOpenTime(event.target.value)}
                disabled={!specialIsOpen}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Cierre tarde
              <input
                type="time"
                value={specialSecondCloseTime}
                onChange={(event) => setSpecialSecondCloseTime(event.target.value)}
                disabled={!specialIsOpen}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Motivo o mensaje
            <input
              value={specialReason}
              onChange={(event) => setSpecialReason(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Ej: Feriado nacional"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSavingSpecialDay}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSavingSpecialDay
                ? 'Guardando...'
                : isEditingSpecialDay
                  ? 'Guardar cambios'
                  : 'Crear dia especial'}
            </button>

            {isEditingSpecialDay && (
              <button
                type="button"
                onClick={resetSpecialDayForm}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar edicion
              </button>
            )}
          </div>
        </form>

        <div>
          <h3 className="font-semibold text-slate-950">Dias especiales</h3>

          {storeHours?.specialDays.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">
              Todavia no hay dias especiales cargados.
            </p>
          )}

          <div className="mt-3 grid gap-3">
            {storeHours?.specialDays.map((specialDay) => (
              <article
                key={specialDay.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {specialDay.date}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {formatTimeRange(specialDay)}
                    </p>

                    {specialDay.reason && (
                      <p className="mt-1 text-sm text-slate-600">
                        {specialDay.reason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditingSpecialDay(specialDay)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSpecialDay(specialDay)}
                      disabled={deletingSpecialDayId === specialDay.id}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                    >
                      {deletingSpecialDayId === specialDay.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
