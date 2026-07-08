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
    <section className="mt-8">
      <div>
        <h2 className="text-xl font-black text-[#123f1c]">Promociones</h2>
        <p className="mt-1 text-sm font-medium text-[#416343]">
          Combos y precios especiales para aprovechar en tus compras.
        </p>
      </div>

      {promotions.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay promociones disponibles.</p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
