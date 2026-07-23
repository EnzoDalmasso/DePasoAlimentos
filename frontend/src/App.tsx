import { useEffect, useState } from 'react'
import { getFoodSuggestions } from './services/foodSuggestionsApi'
import { getProducts } from './services/productsApi'
import { getPromotions } from './services/promotionsApi'
import { getStoreHours } from './services/storeHoursApi'
import type { FoodSuggestion } from './types/foodSuggestion'
import type { Product } from './types/product'
import type { Promotion } from './types/promotion'
import type { StoreHours } from './types/storeHours'
import { Header } from './components/Header'
import { SectionTabs, type Section } from './components/SectionTabs'
import { ProductsSection } from './sections/ProductsSection'
import { PromotionsSection } from './sections/PromotionsSection'
import { FoodSuggestionsSection } from './sections/FoodSuggestionsSection'
import { ContactBanner } from './components/ContactBanner'
import { SummaryStats } from './components/SummaryStats'
import { AdminPage } from './pages/AdminPage'
import { DetailModal } from './components/DetailModal'
import { CartDrawer } from './components/CartDrawer'
import { StoreHoursPanel } from './components/StoreHoursPanel'
import { Footer } from './components/Footer'
import { getProductCategoryLabel } from './constants/productCategories'

type SelectedDetail =
  | {
      kind: 'product'
      item: Product
    }
  | {
      kind: 'promotion'
      item: Promotion
    }
  | {
      kind: 'foodSuggestion'
      item: FoodSuggestion
    }

function App() {
  const isAdminPage = window.location.pathname === '/admin'

  const [activeSection, setActiveSection] = useState<Section>('products')

  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestion[]>([])
  const [storeHours, setStoreHours] = useState<StoreHours | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<SelectedDetail | null>(
    null,
  )

  useEffect(() => {
    if (isAdminPage) {
      return
    }

    async function loadData() {
      try {
        const [
          productsFromApi,
          promotionsFromApi,
          foodSuggestionsFromApi,
          storeHoursFromApi,
        ] = await Promise.all([
          getProducts(),
          getPromotions(),
          getFoodSuggestions(),
          getStoreHours(),
        ])

        setProducts(productsFromApi)
        setPromotions(promotionsFromApi)
        setFoodSuggestions(foodSuggestionsFromApi)
        setStoreHours(storeHoursFromApi)
      } catch {
        setErrorMessage('No pudimos cargar la informacion.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAdminPage])

  if (isAdminPage) {
    return <AdminPage />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5ead8] text-[#102318]">
      <section className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-48 h-24 w-24 rounded-full border border-[#d8bf70]/40" />
        <div className="pointer-events-none absolute right-2 top-[34rem] h-16 w-16 rounded-full bg-[#15552a]/10 blur-sm" />
        <Header />

        <SectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {!isLoading && !errorMessage && storeHours && (
          <StoreHoursPanel storeHours={storeHours} />
        )}

        {!isLoading && !errorMessage && (
          <SummaryStats
            productsCount={products.length}
            promotionsCount={promotions.length}
            foodSuggestionsCount={foodSuggestions.length}
          />
        )}

        {isLoading && (
          <section className="editorial-card mt-6 rounded-[1.5rem] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#b83924]">
              Cargando catálogo
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-[1.5rem] bg-white/70"
                />
              ))}
            </div>
          </section>
        )}

        {errorMessage && (
          <p className="mt-6 rounded-[1.25rem] border border-[#e6b0a6] bg-white/80 p-4 font-bold text-[#b83924]">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && activeSection === 'products' && (
          <ProductsSection
            products={products}
            onProductSelect={(product) =>
              setSelectedDetail({ kind: 'product', item: product })
            }
          />
        )}

        {!isLoading && !errorMessage && activeSection === 'promotions' && (
          <PromotionsSection
            promotions={promotions}
            onPromotionSelect={(promotion) =>
              setSelectedDetail({ kind: 'promotion', item: promotion })
            }
          />
        )}

        {!isLoading && !errorMessage && activeSection === 'foodSuggestions' && (
          <FoodSuggestionsSection
            foodSuggestions={foodSuggestions}
            onFoodSuggestionSelect={(foodSuggestion) =>
              setSelectedDetail({
                kind: 'foodSuggestion',
                item: foodSuggestion,
              })
            }
          />
        )}

        <ContactBanner />
      </section>

      <Footer />

      <CartDrawer />

      {selectedDetail?.kind === 'product' && (
        <DetailModal
          eyebrow={getProductCategoryLabel(selectedDetail.item.category)}
          title={selectedDetail.item.name}
          description={selectedDetail.item.description}
          imageUrl={selectedDetail.item.imageUrl}
          priceLabel={`$${selectedDetail.item.price.toLocaleString('es-AR')}`}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {selectedDetail?.kind === 'promotion' && (
        <DetailModal
          eyebrow="Promoción"
          title={selectedDetail.item.title}
          description={selectedDetail.item.description}
          imageUrl={selectedDetail.item.imageUrl}
          priceLabel={`$${selectedDetail.item.promoPrice.toLocaleString('es-AR')}`}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {selectedDetail?.kind === 'foodSuggestion' && (
        <DetailModal
          eyebrow="Sugerencia"
          title={selectedDetail.item.title}
          description={selectedDetail.item.description}
          imageUrl={selectedDetail.item.imageUrl}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </main>
  )
}

export default App
