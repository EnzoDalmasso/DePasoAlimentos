import { useEffect, useState } from 'react'
import { getFoodSuggestions } from './services/foodSuggestionsApi'
import { getProducts } from './services/productsApi'
import { getPromotions } from './services/promotionsApi'
import type { FoodSuggestion } from './types/foodSuggestion'
import type { Product } from './types/product'
import type { Promotion } from './types/promotion'
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
        const [productsFromApi, promotionsFromApi, foodSuggestionsFromApi] =
          await Promise.all([
            getProducts(),
            getPromotions(),
            getFoodSuggestions(),
          ])

        setProducts(productsFromApi)
        setPromotions(promotionsFromApi)
        setFoodSuggestions(foodSuggestionsFromApi)
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
    <main className="min-h-screen bg-[#f7f1e3] text-[#173f21]">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Header />

        <SectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {!isLoading && !errorMessage && (
          <SummaryStats
            productsCount={products.length}
            promotionsCount={promotions.length}
            foodSuggestionsCount={foodSuggestions.length}
          />
        )}

        {isLoading && (
          <p className="mt-8 font-medium text-[#416343]">
            Cargando informacion...
          </p>
        )}

        {errorMessage && <p className="mt-8 text-[#b3321f]">{errorMessage}</p>}

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

      <CartDrawer />

      {selectedDetail?.kind === 'product' && (
        <DetailModal
          eyebrow="Producto"
          title={selectedDetail.item.name}
          description={selectedDetail.item.description}
          imageUrl={selectedDetail.item.imageUrl}
          priceLabel={`$${selectedDetail.item.price.toLocaleString('es-AR')}`}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {selectedDetail?.kind === 'promotion' && (
        <DetailModal
          eyebrow="Promocion"
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
