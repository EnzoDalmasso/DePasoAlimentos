import type { Product } from '../types/product'
import { useCart } from '../context/useCart'
import { ImageWithFallback } from './ImageWithFallback'

type ProductCardProps = {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#d9ead7] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#9fd39e] hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="block bg-[#f4fbf3] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#15552a]"
      >
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-contain"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-[#0e351e]">{product.name}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#6d846f]">
              Producto
            </p>
          </div>

          <p className="shrink-0 text-lg font-black text-[#b83924]">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#416343]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex-1 rounded-md border border-[#cbe5c9] px-3 py-2 text-sm font-black text-[#15552a] transition hover:bg-[#eaf8ed] focus:outline-none focus:ring-2 focus:ring-[#15552a]"
          >
            Ver detalle
          </button>

          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                type: 'product',
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            className="h-10 w-10 shrink-0 rounded-md bg-[#15552a] text-lg font-black text-white transition hover:bg-[#0e351e] focus:outline-none focus:ring-2 focus:ring-[#15552a] focus:ring-offset-2"
            aria-label={`Agregar ${product.name} al pedido`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
