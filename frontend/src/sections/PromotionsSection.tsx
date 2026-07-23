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
    <section className="mt-10 animate-soft-rise">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d77a16]">
            Ahorro
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0e351e] sm:text-4xl">
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

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
