import { PromotionCard } from '../components/PromotionCard'
import type { Promotion } from '../types/promotion'

type PromotionsSectionProps = {
  promotions: Promotion[]
  onPromotionSelect: (promotion: Promotion) => void
}

export function PromotionsSection({
  promotions,
  onPromotionSelect,
}: PromotionsSectionProps) {
  return (
    <section className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#d77a16]">
            Ahorro
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#0e351e]">
            Promociones
          </h2>
        </div>

        <p className="max-w-xl text-sm font-medium leading-6 text-[#416343]">
          Combos y precios especiales para aprovechar en tus compras.
        </p>
      </div>

      {promotions.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay promociones disponibles.</p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            onSelect={onPromotionSelect}
          />
        ))}
      </div>
    </section>
  )
}
