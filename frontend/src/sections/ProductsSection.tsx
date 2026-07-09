import { ProductCard } from '../components/ProductCard'
import type { Product } from '../types/product'

type ProductsSectionProps = {
  products: Product[]
  onProductSelect: (product: Product) => void
}

export function ProductsSection({
  products,
  onProductSelect,
}: ProductsSectionProps) {
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

      {products.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay productos disponibles.</p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
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
