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
    <article className="depaso-card-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#d8bf70]/35 bg-white/80 text-left shadow-[0_14px_34px_rgba(61,37,18,0.08)] backdrop-blur">
      <button
        type="button"
        onClick={() => onSelect(promotion)}
        className="block bg-gradient-to-br from-[#fff7e6] to-[#f5ead8] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d77a16]"
      >
        <ImageWithFallback
          src={promotion.imageUrl}
          alt={promotion.title}
          className="h-52 w-full object-contain transition duration-300 hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#0e351e]">
              {promotion.title}
            </h3>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[#8b5711]">
              Promo
            </p>
          </div>

          <p className="shrink-0 rounded-full bg-[#fff7e6] px-3 py-1 text-base font-black text-[#d77a16]">
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
            className="depaso-button flex-1 rounded-full border border-[#ead9a0] bg-white/70 px-3 py-2.5 text-sm font-black text-[#8b5711] focus:outline-none focus:ring-2 focus:ring-[#d77a16]"
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
            className="depaso-button h-11 w-11 shrink-0 rounded-full bg-[#15552a] text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-[#15552a] focus:ring-offset-2"
            aria-label={`Agregar ${promotion.title} al pedido`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
