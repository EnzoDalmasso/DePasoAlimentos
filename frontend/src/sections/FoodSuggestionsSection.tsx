import { FoodSuggestionCard } from '../components/FoodSuggestionCard'
import type { FoodSuggestion } from '../types/foodSuggestion'

type FoodSuggestionsSectionProps = {
  foodSuggestions: FoodSuggestion[]
  onFoodSuggestionSelect: (foodSuggestion: FoodSuggestion) => void
}

export function FoodSuggestionsSection({
  foodSuggestions,
  onFoodSuggestionSelect,
}: FoodSuggestionsSectionProps) {
  return (
    <section className="mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#b83924]">
            Ideas
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#0e351e]">
            Sugerencias de comidas
          </h2>
        </div>

        <p className="max-w-xl text-sm font-medium leading-6 text-[#416343]">
          Ideas simples para preparar tus productos y resolver comidas.
        </p>
      </div>

      {foodSuggestions.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay sugerencias disponibles.</p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {foodSuggestions.map((foodSuggestion) => (
          <FoodSuggestionCard
            key={foodSuggestion.id}
            foodSuggestion={foodSuggestion}
            onSelect={onFoodSuggestionSelect}
          />
        ))}
      </div>
    </section>
  )
}
