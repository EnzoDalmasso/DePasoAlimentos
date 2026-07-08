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
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#d9c891] bg-[#fffdf7] text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d07b00] hover:shadow-md">
      <ImageWithFallback
        src={promotion.imageUrl}
        alt={promotion.title}
        className="h-48 w-full bg-[#fff8df] object-contain p-3"
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-[#123f1c]">{promotion.title}</h3>

        <p className="mt-2 flex-1 text-sm leading-6 text-[#416343]">
          {promotion.description}
        </p>

        <p className="mt-4 text-lg font-black text-[#d07b00]">
          ${promotion.promoPrice.toLocaleString('es-AR')}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect(promotion)}
            className="rounded-md border border-[#d9c891] px-3 py-2 text-sm font-bold text-[#174f24] transition hover:bg-[#fff8df] focus:outline-none focus:ring-2 focus:ring-[#d07b00]"
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
            className="rounded-md bg-[#d65424] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#b3321f] focus:outline-none focus:ring-2 focus:ring-[#d07b00]"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
