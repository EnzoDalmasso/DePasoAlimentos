import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import {
  PRODUCT_CATEGORIES,
  getProductCategoryLabel,
} from '../constants/productCategories'
import type { Product } from '../types/product'

type ProductsSectionProps = {
  products: Product[]
  onProductSelect: (product: Product) => void
}

export function ProductsSection({
  products,
  onProductSelect,
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products
    }

    return products.filter((product) => product.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <section className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#b83924]">
            Catalogo
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#0e351e]">
            Productos populares
          </h2>
        </div>

        <p className="max-w-xl text-sm font-medium leading-6 text-[#416343]">
          Pastas, pizzas, empanadas y opciones congeladas listas para cocinar.
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          type="button"
          onClick={() => setSelectedCategory('Todos')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
            selectedCategory === 'Todos'
              ? 'bg-[#15552a] text-white shadow-sm'
              : 'border border-[#cbe5c9] bg-white text-[#15552a] hover:bg-[#f4fbf3]'
          }`}
        >
          Todos
        </button>

        {PRODUCT_CATEGORIES.map((productCategory) => (
          <button
            key={productCategory}
            type="button"
            onClick={() => setSelectedCategory(productCategory)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
              selectedCategory === productCategory
                ? 'bg-[#15552a] text-white shadow-sm'
                : 'border border-[#cbe5c9] bg-white text-[#15552a] hover:bg-[#f4fbf3]'
            }`}
          >
            {getProductCategoryLabel(productCategory)}
          </button>
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay productos disponibles.</p>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <p className="mt-4 rounded-lg border border-[#d9ead7] bg-white p-4 font-bold text-[#416343]">
          No hay productos cargados en esta categoría.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
      </div>
    </section>
  )
}
