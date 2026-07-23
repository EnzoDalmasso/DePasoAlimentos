import type { Product } from '../types/product'
import { useCart } from '../context/useCart'
import { ImageWithFallback } from './ImageWithFallback'
import { getProductCategoryLabel } from '../constants/productCategories'

type ProductCardProps = {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <article className="depaso-card-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#d8bf70]/25 bg-white/80 text-left shadow-[0_14px_34px_rgba(61,37,18,0.08)] backdrop-blur">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="block bg-gradient-to-br from-[#f8fff5] to-[#f5ead8] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#15552a]"
      >
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="h-52 w-full object-contain transition duration-300 hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#0e351e]">
              {product.name}
            </h3>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[#6d846f]">
              {getProductCategoryLabel(product.category)}
            </p>
          </div>

          <p className="shrink-0 rounded-full bg-[#fff0eb] px-3 py-1 text-base font-black text-[#b83924]">
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
            className="depaso-button flex-1 rounded-full border border-[#cbe5c9] bg-white/70 px-3 py-2.5 text-sm font-black text-[#15552a] focus:outline-none focus:ring-2 focus:ring-[#15552a]"
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
            className="depaso-button h-11 w-11 shrink-0 rounded-full bg-[#15552a] text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-[#15552a] focus:ring-offset-2"
            aria-label={`Agregar ${product.name} al pedido`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
