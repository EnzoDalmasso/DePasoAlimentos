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
    <section className="mt-8">
      <div>
        <h2 className="text-xl font-black text-[#123f1c]">Productos</h2>
        <p className="mt-1 text-sm font-medium text-[#416343]">
          Pastas, pizzas, empanadas y opciones congeladas listas para cocinar.
        </p>
      </div>

      {products.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay productos disponibles.</p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
