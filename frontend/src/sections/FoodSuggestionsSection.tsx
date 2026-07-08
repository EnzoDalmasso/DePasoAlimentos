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
    <section className="mt-8">
      <div>
        <h2 className="text-xl font-black text-[#123f1c]">Sugerencias</h2>
        <p className="mt-1 text-sm font-medium text-[#416343]">
          Ideas simples para preparar tus productos y resolver comidas.
        </p>
      </div>

      {foodSuggestions.length === 0 && (
        <p className="mt-4 text-[#416343]">No hay sugerencias disponibles.</p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
