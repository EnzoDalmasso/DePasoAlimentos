import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  createFoodSuggestion,
  deleteFoodSuggestion,
  getAdminFoodSuggestions,
  publishFoodSuggestion,
  unpublishFoodSuggestion,
  updateFoodSuggestion,
} from '../services/foodSuggestionsApi'
import type { FoodSuggestion } from '../types/foodSuggestion'
import { ImageUploadField } from '../components/ImageUploadField'

export function FoodSuggestionsAdminSection() {
  const foodSuggestionFormRef = useRef<HTMLFormElement | null>(null)

  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [editingFoodSuggestionId, setEditingFoodSuggestionId] = useState<
    number | null
  >(null)
  const [changingStatusFoodSuggestionId, setChangingStatusFoodSuggestionId] =
    useState<number | null>(null)
  const [deletingFoodSuggestionId, setDeletingFoodSuggestionId] = useState<
    number | null
  >(null)

  const isEditing = editingFoodSuggestionId !== null

  useEffect(() => {
    async function loadFoodSuggestions() {
      try {
        const foodSuggestionsFromApi = await getAdminFoodSuggestions()
        setFoodSuggestions(foodSuggestionsFromApi)
      } catch {
        setErrorMessage('No pudimos cargar las sugerencias.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFoodSuggestions()
  }, [])

  async function handleSubmitFoodSuggestion(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (isEditing) {
        const foodSuggestionBeingEdited = foodSuggestions.find(
          (foodSuggestion) => foodSuggestion.id === editingFoodSuggestionId,
        )

        if (!foodSuggestionBeingEdited) {
          setErrorMessage('No encontramos la sugerencia que queres editar.')
          return
        }

        const updatedFoodSuggestion: FoodSuggestion = {
          ...foodSuggestionBeingEdited,
          title,
          description,
          imageUrl,
        }

        await updateFoodSuggestion(
          editingFoodSuggestionId,
          updatedFoodSuggestion,
        )

        setFoodSuggestions((currentFoodSuggestions) =>
          currentFoodSuggestions.map((foodSuggestion) =>
            foodSuggestion.id === editingFoodSuggestionId
              ? updatedFoodSuggestion
              : foodSuggestion,
          ),
        )

        resetFoodSuggestionForm()
        return
      }

      const createdFoodSuggestion = await createFoodSuggestion({
        title,
        description,
        imageUrl,
      })

      setFoodSuggestions((currentFoodSuggestions) => [
        createdFoodSuggestion,
        ...currentFoodSuggestions,
      ])
      resetFoodSuggestionForm()
    } catch {
      setErrorMessage(
        isEditing
          ? 'No pudimos actualizar la sugerencia.'
          : 'No pudimos crear la sugerencia.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleStartEditingFoodSuggestion(foodSuggestion: FoodSuggestion) {
    setEditingFoodSuggestionId(foodSuggestion.id)
    setTitle(foodSuggestion.title)
    setDescription(foodSuggestion.description)
    setImageUrl(foodSuggestion.imageUrl)

    requestAnimationFrame(() => {
      foodSuggestionFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  function resetFoodSuggestionForm() {
    setEditingFoodSuggestionId(null)
    setTitle('')
    setDescription('')
    setImageUrl('')
  }

  async function handleToggleFoodSuggestionStatus(
    foodSuggestion: FoodSuggestion,
  ) {
    try {
      setErrorMessage(null)
      setChangingStatusFoodSuggestionId(foodSuggestion.id)

      if (foodSuggestion.isPublished) {
        await unpublishFoodSuggestion(foodSuggestion.id)
      } else {
        await publishFoodSuggestion(foodSuggestion.id)
      }

      setFoodSuggestions((currentFoodSuggestions) =>
        currentFoodSuggestions.map((currentFoodSuggestion) =>
          currentFoodSuggestion.id === foodSuggestion.id
            ? {
                ...currentFoodSuggestion,
                isPublished: !currentFoodSuggestion.isPublished,
              }
            : currentFoodSuggestion,
        ),
      )
    } catch {
      setErrorMessage('No pudimos actualizar el estado de la sugerencia.')
    } finally {
      setChangingStatusFoodSuggestionId(null)
    }
  }

  async function handleDeleteFoodSuggestion(foodSuggestion: FoodSuggestion) {
    const confirmed = window.confirm(
      `Seguro que queres eliminar "${foodSuggestion.title}"? Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setErrorMessage(null)
      setDeletingFoodSuggestionId(foodSuggestion.id)

      await deleteFoodSuggestion(foodSuggestion.id)

      setFoodSuggestions((currentFoodSuggestions) =>
        currentFoodSuggestions.filter(
          (currentFoodSuggestion) =>
            currentFoodSuggestion.id !== foodSuggestion.id,
        ),
      )

      if (editingFoodSuggestionId === foodSuggestion.id) {
        resetFoodSuggestionForm()
      }
    } catch {
      setErrorMessage('No pudimos eliminar la sugerencia.')
    } finally {
      setDeletingFoodSuggestionId(null)
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Sugerencias
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Listado interno para revisar sugerencias cargadas.
          </p>
        </div>

        <p className="text-sm font-medium text-slate-600">
          Total: {foodSuggestions.length}
        </p>
      </div>

      <form
        ref={foodSuggestionFormRef}
        onSubmit={handleSubmitFoodSuggestion}
        className="mt-5 grid scroll-mt-24 gap-3 border-t border-slate-200 pt-5"
      >
        <div>
          <h3 className="font-semibold text-slate-950">
            {isEditing ? 'Editar sugerencia' : 'Crear sugerencia'}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {isEditing
              ? 'Modifica los campos y guarda los cambios.'
              : 'Completa los campos para agregar una sugerencia nueva.'}
          </p>
        </div>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Titulo
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="Ej: Sorrentinos con salsa de la casa"
            required
          />
        </label>

          <ImageUploadField
            folder="food-suggestions"
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
          />

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Descripcion
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="Descripcion de la sugerencia"
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
                : 'Crear sugerencia'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetFoodSuggestionForm}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar edicion
            </button>
          )}
        </div>
      </form>

      {isLoading && (
        <p className="mt-4 text-sm text-slate-600">
          Cargando sugerencias...
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && foodSuggestions.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">
          No hay sugerencias cargadas.
        </p>
      )}

      {!isLoading && !errorMessage && foodSuggestions.length > 0 && (
        <>
        <div className="mt-4 grid gap-3 md:hidden">
          {foodSuggestions.map((foodSuggestion) => (
            <article
              key={foodSuggestion.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Sugerencia
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-950">
                    {foodSuggestion.title}
                  </h3>
                </div>

                {foodSuggestion.isPublished ? (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    Publicada
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    No publicada
                  </span>
                )}
              </div>

              <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                {foodSuggestion.description}
              </p>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleStartEditingFoodSuggestion(foodSuggestion)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleToggleFoodSuggestionStatus(foodSuggestion)
                  }
                  disabled={
                    changingStatusFoodSuggestionId === foodSuggestion.id
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {changingStatusFoodSuggestionId === foodSuggestion.id
                    ? 'Actualizando...'
                    : foodSuggestion.isPublished
                      ? 'Despublicar'
                      : 'Publicar'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteFoodSuggestion(foodSuggestion)}
                  disabled={deletingFoodSuggestionId === foodSuggestion.id}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                >
                  {deletingFoodSuggestionId === foodSuggestion.id
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
                <th className="py-3 pr-4 font-medium">Sugerencia</th>
                <th className="py-3 pr-4 font-medium">Estado</th>
                <th className="py-3 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {foodSuggestions.map((foodSuggestion) => (
                <tr
                  key={foodSuggestion.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-slate-950">
                      {foodSuggestion.title}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {foodSuggestion.description}
                    </p>
                  </td>

                  <td className="py-3 pr-4 align-top">
                    {foodSuggestion.isPublished ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        Publicada
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        No publicada
                      </span>
                    )}
                  </td>

                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEditingFoodSuggestion(foodSuggestion)
                        }
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFoodSuggestionStatus(foodSuggestion)
                        }
                        disabled={
                          changingStatusFoodSuggestionId === foodSuggestion.id
                        }
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        {changingStatusFoodSuggestionId === foodSuggestion.id
                          ? 'Actualizando...'
                          : foodSuggestion.isPublished
                            ? 'Despublicar'
                            : 'Publicar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFoodSuggestion(foodSuggestion)}
                        disabled={deletingFoodSuggestionId === foodSuggestion.id}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                      >
                        {deletingFoodSuggestionId === foodSuggestion.id
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
