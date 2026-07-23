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
    <section id="catalogo" className="mt-10 animate-soft-rise">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b83924]">
            Catálogo
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0e351e] sm:text-4xl">
            Productos populares
          </h2>
        </div>

        <p className="max-w-xl text-sm font-medium leading-6 text-[#416343]">
          Pastas, pizzas, empanadas y opciones congeladas listas para cocinar.
        </p>
      </div>

      <div className="scrollbar-hidden mt-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          type="button"
          onClick={() => setSelectedCategory('Todos')}
          className={`depaso-button shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition ${
            selectedCategory === 'Todos'
              ? 'bg-[#15552a] text-white shadow-[0_12px_24px_rgba(21,85,42,0.2)]'
              : 'border border-[#d8bf70]/35 bg-white/75 text-[#15552a] hover:bg-[#fffaf0]'
          }`}
        >
          Todos
        </button>

        {PRODUCT_CATEGORIES.map((productCategory) => (
          <button
            key={productCategory}
            type="button"
            onClick={() => setSelectedCategory(productCategory)}
            className={`depaso-button shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition ${
              selectedCategory === productCategory
                ? 'bg-[#15552a] text-white shadow-[0_12px_24px_rgba(21,85,42,0.2)]'
                : 'border border-[#d8bf70]/35 bg-white/75 text-[#15552a] hover:bg-[#fffaf0]'
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
        <p className="mt-4 rounded-[1.25rem] border border-[#d9ead7] bg-white/75 p-4 font-bold text-[#416343]">
          No hay productos cargados en esta categoría.
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
