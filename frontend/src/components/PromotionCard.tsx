import type { Promotion } from '../types/promotion'
import { useCart } from '../context/useCart'
import { ImageWithFallback } from './ImageWithFallback'

type PromotionCardProps = {
  promotion: Promotion
  onSelect: (promotion: Promotion) => void
}

export function PromotionCard({ promotion, onSelect }: PromotionCardProps) {
  const { addItem } = useCart()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#ead9a0] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d77a16] hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(promotion)}
        className="block bg-[#fff7e6] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d77a16]"
      >
        <ImageWithFallback
          src={promotion.imageUrl}
          alt={promotion.title}
          className="h-48 w-full object-contain"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-[#0e351e]">{promotion.title}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#8b5711]">
              Promo
            </p>
          </div>

          <p className="shrink-0 text-lg font-black text-[#d77a16]">
            ${promotion.promoPrice.toLocaleString('es-AR')}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#416343]">
          {promotion.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(promotion)}
            className="flex-1 rounded-md border border-[#ead9a0] px-3 py-2 text-sm font-black text-[#8b5711] transition hover:bg-[#fff7e6] focus:outline-none focus:ring-2 focus:ring-[#d77a16]"
          >
            Ver detalle
          </button>

          <button
            type="button"
            onClick={() =>
              addItem({
                id: promotion.id,
                type: 'promotion',
                name: promotion.title,
                price: promotion.promoPrice,
                imageUrl: promotion.imageUrl,
              })
            }
            className="h-10 w-10 shrink-0 rounded-md bg-[#15552a] text-lg font-black text-white transition hover:bg-[#0e351e] focus:outline-none focus:ring-2 focus:ring-[#15552a] focus:ring-offset-2"
            aria-label={`Agregar ${promotion.title} al pedido`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
