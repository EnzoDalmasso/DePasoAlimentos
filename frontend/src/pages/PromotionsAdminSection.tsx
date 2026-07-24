import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  activatePromotion,
  createPromotion,
  deactivatePromotion,
  deletePromotion,
  getAdminPromotions,
  updatePromotion,
} from '../services/promotionsApi'
import type { Promotion } from '../types/promotion'
import { ImageUploadField } from '../components/ImageUploadField'


export function PromotionsAdminSection() {
  const promotionFormRef = useRef<HTMLFormElement | null>(null)

  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [promoPrice, setPromoPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [editingPromotionId, setEditingPromotionId] = useState<number | null>(
    null,
  )
  const [changingStatusPromotionId, setChangingStatusPromotionId] = useState<
    number | null
  >(null)
  const [deletingPromotionId, setDeletingPromotionId] = useState<number | null>(
    null,
  )

  const isEditing = editingPromotionId !== null

  useEffect(() => {
    async function loadPromotions() {
      try {
        const promotionsFromApi = await getAdminPromotions()
        setPromotions(promotionsFromApi)
      } catch {
        setErrorMessage('No pudimos cargar las promociones.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPromotions()
  }, [])

  async function handleSubmitPromotion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (isEditing) {
        const promotionBeingEdited = promotions.find(
          (promotion) => promotion.id === editingPromotionId,
        )

        if (!promotionBeingEdited) {
          setErrorMessage('No encontramos la promocion que queres editar.')
          return
        }

        const updatedPromotion: Promotion = {
          ...promotionBeingEdited,
          title,
          description,
          promoPrice: Number(promoPrice),
          imageUrl,
        }

        await updatePromotion(editingPromotionId, updatedPromotion)

        setPromotions((currentPromotions) =>
          currentPromotions.map((promotion) =>
            promotion.id === editingPromotionId ? updatedPromotion : promotion,
          ),
        )

        resetPromotionForm()
        return
      }

      const createdPromotion = await createPromotion({
        title,
        description,
        promoPrice: Number(promoPrice),
        imageUrl,
      })

      setPromotions((currentPromotions) => [
        createdPromotion,
        ...currentPromotions,
      ])
      resetPromotionForm()
    } catch {
      setErrorMessage(
        isEditing
          ? 'No pudimos actualizar la promocion.'
          : 'No pudimos crear la promocion.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleStartEditingPromotion(promotion: Promotion) {
    setEditingPromotionId(promotion.id)
    setTitle(promotion.title)
    setDescription(promotion.description)
    setPromoPrice(promotion.promoPrice.toString())
    setImageUrl(promotion.imageUrl)

    requestAnimationFrame(() => {
      promotionFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  function resetPromotionForm() {
    setEditingPromotionId(null)
    setTitle('')
    setDescription('')
    setPromoPrice('')
    setImageUrl('')
  }

  async function handleTogglePromotionStatus(promotion: Promotion) {
    try {
      setErrorMessage(null)
      setChangingStatusPromotionId(promotion.id)

      if (promotion.isActive) {
        await deactivatePromotion(promotion.id)
      } else {
        await activatePromotion(promotion.id)
      }

      setPromotions((currentPromotions) =>
        currentPromotions.map((currentPromotion) =>
          currentPromotion.id === promotion.id
            ? { ...currentPromotion, isActive: !currentPromotion.isActive }
            : currentPromotion,
        ),
      )
    } catch {
      setErrorMessage('No pudimos actualizar el estado de la promocion.')
    } finally {
      setChangingStatusPromotionId(null)
    }
  }

  async function handleDeletePromotion(promotion: Promotion) {
    const confirmed = window.confirm(
      `Seguro que queres eliminar "${promotion.title}"? Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setErrorMessage(null)
      setDeletingPromotionId(promotion.id)

      await deletePromotion(promotion.id)

      setPromotions((currentPromotions) =>
        currentPromotions.filter(
          (currentPromotion) => currentPromotion.id !== promotion.id,
        ),
      )

      if (editingPromotionId === promotion.id) {
        resetPromotionForm()
      }
    } catch {
      setErrorMessage('No pudimos eliminar la promocion.')
    } finally {
      setDeletingPromotionId(null)
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Promociones
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Listado interno para revisar promociones cargadas.
          </p>
        </div>

        <p className="text-sm font-medium text-slate-600">
          Total: {promotions.length}
        </p>
      </div>

      <form
        ref={promotionFormRef}
        onSubmit={handleSubmitPromotion}
        className="mt-5 grid scroll-mt-24 gap-3 border-t border-slate-200 pt-5"
      >
        <div>
          <h3 className="font-semibold text-slate-950">
            {isEditing ? 'Editar promocion' : 'Crear promocion'}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {isEditing
              ? 'Modifica los campos y guarda los cambios.'
              : 'Completa los campos para agregar una promocion nueva.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Titulo
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Ej: Combo pastas"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Precio promocional
            <input
              type="number"
              value={promoPrice}
              onChange={(event) => setPromoPrice(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Ej: 8500"
              min="0"
              step="0.01"
              required
            />
          </label>
        </div>

          <ImageUploadField
            folder="promotions"
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
          />

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Descripcion
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="Descripcion de la promocion"
            required
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving
              ? 'Guardando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear promocion'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetPromotionForm}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar edicion
            </button>
          )}
        </div>
      </form>

      {isLoading && (
        <p className="mt-4 text-sm text-slate-600">
          Cargando promociones...
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && promotions.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">
          No hay promociones cargadas.
        </p>
      )}

      {!isLoading && !errorMessage && promotions.length > 0 && (
        <>
        <div className="mt-4 grid gap-3 md:hidden">
          {promotions.map((promotion) => (
            <article
              key={promotion.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Promoción
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-950">
                    {promotion.title}
                  </h3>
                </div>

                {promotion.isActive ? (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    Activa
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    Inactiva
                  </span>
                )}
              </div>

              <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                {promotion.description}
              </p>

              <p className="mt-4 text-lg font-black text-slate-950">
                ${promotion.promoPrice.toLocaleString('es-AR')}
              </p>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEditingPromotion(promotion)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleTogglePromotionStatus(promotion)}
                  disabled={changingStatusPromotionId === promotion.id}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {changingStatusPromotionId === promotion.id
                    ? 'Actualizando...'
                    : promotion.isActive
                      ? 'Desactivar'
                      : 'Activar'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePromotion(promotion)}
                  disabled={deletingPromotionId === promotion.id}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                >
                  {deletingPromotionId === promotion.id
                    ? 'Eliminando...'
                    : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-medium">Promoción</th>
                <th className="py-3 pr-4 font-medium">Precio</th>
                <th className="py-3 pr-4 font-medium">Estado</th>
                <th className="py-3 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {promotions.map((promotion) => (
                <tr
                  key={promotion.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-slate-950">
                      {promotion.title}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {promotion.description}
                    </p>
                  </td>

                  <td className="py-3 pr-4 align-top font-medium text-slate-950">
                    ${promotion.promoPrice.toLocaleString('es-AR')}
                  </td>

                  <td className="py-3 pr-4 align-top">
                    {promotion.isActive ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        Activa
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        Inactiva
                      </span>
                    )}
                  </td>

                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditingPromotion(promotion)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePromotionStatus(promotion)}
                        disabled={changingStatusPromotionId === promotion.id}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        {changingStatusPromotionId === promotion.id
                          ? 'Actualizando...'
                          : promotion.isActive
                            ? 'Desactivar'
                            : 'Activar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePromotion(promotion)}
                        disabled={deletingPromotionId === promotion.id}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                      >
                        {deletingPromotionId === promotion.id
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </section>
  )
}
