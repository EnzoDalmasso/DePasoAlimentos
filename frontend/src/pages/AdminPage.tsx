import { useEffect, useState, type FormEvent } from 'react'
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from '../services/productsApi'
import type { Product } from '../types/product'
import { PromotionsAdminSection } from './PromotionsAdminSection'
import { FoodSuggestionsAdminSection } from './FoodSuggestionsAdminSection'
import { ImageUploadField } from '../components/ImageUploadField'
import {
  changeAdminPassword,
  getAdminEmail,
  getAdminToken,
  loginAdmin,
  logoutAdmin,
} from '../services/authService'

type AdminSection = 'products' | 'promotions' | 'foodSuggestions' | 'account'

export function AdminPage() {
  const [adminToken, setAdminToken] = useState(getAdminToken())
  const [adminEmail, setAdminEmail] = useState(getAdminEmail() ?? '')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  )
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<
    string | null
  >(null)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null)

  const [activeAdminSection, setActiveAdminSection] =
    useState<AdminSection>('products')

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [changingStatusProductId, setChangingStatusProductId] = useState<
    number | null
  >(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  )

  const isEditing = editingProductId !== null

  useEffect(() => {
    if (!adminToken) {
      setIsLoading(false)
      return
    }

    async function loadProducts() {
      try {
        setIsLoading(true)
        const productsFromApi = await getAdminProducts()
        setProducts(productsFromApi)
      } catch {
        setErrorMessage('No pudimos cargar los productos.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [adminToken])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsLoggingIn(true)
      setLoginErrorMessage(null)

      const loginResponse = await loginAdmin(loginEmail, loginPassword)

      setAdminToken(loginResponse.token)
      setAdminEmail(loginResponse.email)
      setLoginPassword('')
    } catch {
      setLoginErrorMessage('Email o contrasena incorrectos.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  function handleLogout() {
    logoutAdmin()
    setAdminToken(null)
    setAdminEmail('')
    setProducts([])
    setErrorMessage(null)
    resetProductForm()
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (newPassword !== confirmNewPassword) {
      setPasswordSuccessMessage(null)
      setPasswordErrorMessage('La nueva contrasena no coincide.')
      return
    }

    try {
      setIsChangingPassword(true)
      setPasswordSuccessMessage(null)
      setPasswordErrorMessage(null)

      await changeAdminPassword(currentPassword, newPassword)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPasswordSuccessMessage('Contrasena actualizada correctamente.')
    } catch {
      setPasswordSuccessMessage(null)
      setPasswordErrorMessage('No pudimos cambiar la contrasena.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleSubmitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (isEditing) {
        const productBeingEdited = products.find(
          (product) => product.id === editingProductId,
        )

        if (!productBeingEdited) {
          setErrorMessage('No encontramos el producto que queres editar.')
          return
        }

        const updatedProduct: Product = {
          ...productBeingEdited,
          name,
          description,
          price: Number(price),
          imageUrl,
        }

        await updateProduct(editingProductId, updatedProduct)

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProductId ? updatedProduct : product,
          ),
        )

        resetProductForm()
        return
      }

      const createdProduct = await createProduct({
        name,
        description,
        price: Number(price),
        imageUrl,
      })

      setProducts((currentProducts) => [createdProduct, ...currentProducts])
      resetProductForm()
    } catch {
      setErrorMessage(
        isEditing
          ? 'No pudimos actualizar el producto.'
          : 'No pudimos crear el producto.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleStartEditingProduct(product: Product) {
    setEditingProductId(product.id)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price.toString())
    setImageUrl(product.imageUrl)
  }

  function resetProductForm() {
    setEditingProductId(null)
    setName('')
    setDescription('')
    setPrice('')
    setImageUrl('')
  }

  async function handleToggleProductStatus(product: Product) {
    try {
      setErrorMessage(null)
      setChangingStatusProductId(product.id)

      if (product.isActive) {
        await deactivateProduct(product.id)
      } else {
        await activateProduct(product.id)
      }

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? { ...currentProduct, isActive: !currentProduct.isActive }
            : currentProduct,
        ),
      )
    } catch {
      setErrorMessage('No pudimos actualizar el estado del producto.')
    } finally {
      setChangingStatusProductId(null)
    }
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Seguro que queres eliminar "${product.name}"? Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setErrorMessage(null)
      setDeletingProductId(product.id)

      await deleteProduct(product.id)

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      )

      if (editingProductId === product.id) {
        resetProductForm()
      }
    } catch {
      setErrorMessage('No pudimos eliminar el producto.')
    } finally {
      setDeletingProductId(null)
    }
  }

  function getAdminTabClassName(section: AdminSection) {
    const baseClassName = 'rounded-md px-4 py-2 text-sm font-semibold transition'

    if (activeAdminSection === section) {
      return `${baseClassName} bg-slate-950 text-white`
    }

    return `${baseClassName} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`
  }

  if (!adminToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase text-emerald-700">
            Panel administrador
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Iniciar sesion
          </h1>

          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                required
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Contrasena
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                required
              />
            </label>

            {loginErrorMessage && (
              <p className="text-sm text-red-600">{loginErrorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase text-emerald-700">
            Panel administrador
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Gestion de DePasoAlimentos
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Desde aca vamos a cargar productos, promociones y sugerencias para
            que se vean en la pagina publica.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600">
              Sesion iniciada como {adminEmail}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cerrar sesion
            </button>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveAdminSection('products')}
            className={getAdminTabClassName('products')}
          >
            Productos
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminSection('promotions')}
            className={getAdminTabClassName('promotions')}
          >
            Promociones
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminSection('foodSuggestions')}
            className={getAdminTabClassName('foodSuggestions')}
          >
            Sugerencias
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminSection('account')}
            className={getAdminTabClassName('account')}
          >
            Mi cuenta
          </button>
        </nav>

        {activeAdminSection === 'products' && (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Productos
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Listado interno para revisar productos cargados.
                </p>
              </div>

              <p className="text-sm font-medium text-slate-600">
                Total: {products.length}
              </p>
            </div>

            <form
              onSubmit={handleSubmitProduct}
              className="mt-5 grid gap-3 border-t border-slate-200 pt-5"
            >
              <div>
                <h3 className="font-semibold text-slate-950">
                  {isEditing ? 'Editar producto' : 'Crear producto'}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {isEditing
                    ? 'Modifica los campos y guarda los cambios.'
                    : 'Completa los campos para agregar un producto nuevo.'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Nombre
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="Ej: Sorrentinos"
                    required
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Precio
                  <input
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="Ej: 4500"
                    min="0"
                    step="0.01"
                    required
                  />
                </label>
              </div>

              <ImageUploadField
                folder="products"
                imageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
              />

              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Descripcion
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  placeholder="Descripcion del producto"
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
                      : 'Crear producto'}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancelar edicion
                  </button>
                )}
              </div>
            </form>

            {isLoading && (
              <p className="mt-4 text-sm text-slate-600">
                Cargando productos...
              </p>
            )}

            {errorMessage && (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            )}

            {!isLoading && !errorMessage && products.length === 0 && (
              <p className="mt-4 text-sm text-slate-600">
                No hay productos cargados.
              </p>
            )}

            {!isLoading && !errorMessage && products.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="py-3 pr-4 font-medium">Producto</th>
                      <th className="py-3 pr-4 font-medium">Precio</th>
                      <th className="py-3 pr-4 font-medium">Estado</th>
                      <th className="py-3 pr-4 font-medium">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 pr-4 align-top">
                          <p className="font-medium text-slate-950">
                            {product.name}
                          </p>
                          <p className="mt-1 text-slate-600">
                            {product.description}
                          </p>
                        </td>

                        <td className="py-3 pr-4 align-top font-medium text-slate-950">
                          ${product.price.toLocaleString('es-AR')}
                        </td>

                        <td className="py-3 pr-4 align-top">
                          {product.isActive ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                              Activo
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                              Inactivo
                            </span>
                          )}
                        </td>

                        <td className="py-3 pr-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditingProduct(product)}
                              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleProductStatus(product)}
                              disabled={
                                changingStatusProductId === product.id
                              }
                              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                            >
                              {changingStatusProductId === product.id
                                ? 'Actualizando...'
                                : product.isActive
                                  ? 'Desactivar'
                                  : 'Activar'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={deletingProductId === product.id}
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
                            >
                              {deletingProductId === product.id
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
            )}
          </section>
        )}

        {activeAdminSection === 'promotions' && (
          <PromotionsAdminSection />
        )}

        {activeAdminSection === 'foodSuggestions' && (
          <FoodSuggestionsAdminSection />
        )}

        {activeAdminSection === 'account' && (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Mi cuenta
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Cambia la contrasena de acceso al panel administrador.
              </p>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="mt-5 grid max-w-xl gap-4 border-t border-slate-200 pt-5"
            >
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Contrasena actual
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  required
                />
              </label>

              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Nueva contrasena
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  minLength={8}
                  required
                />
              </label>

              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Repetir nueva contrasena
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  minLength={8}
                  required
                />
              </label>

              {passwordSuccessMessage && (
                <p className="text-sm text-emerald-700">
                  {passwordSuccessMessage}
                </p>
              )}

              {passwordErrorMessage && (
                <p className="text-sm text-red-600">{passwordErrorMessage}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isChangingPassword
                    ? 'Actualizando...'
                    : 'Cambiar contrasena'}
                </button>
              </div>
            </form>
          </section>
        )}
      </section>
    </main>
  )
}
