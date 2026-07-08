import type { FoodSuggestion } from '../types/foodSuggestion'
import { ImageWithFallback } from './ImageWithFallback'

type FoodSuggestionCardProps = {
  foodSuggestion: FoodSuggestion
  onSelect: (foodSuggestion: FoodSuggestion) => void
}

export function FoodSuggestionCard({
  foodSuggestion,
  onSelect,
}: FoodSuggestionCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#d9c891] bg-[#fffdf7] text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b3321f] hover:shadow-md">
      <ImageWithFallback
        src={foodSuggestion.imageUrl}
        alt={foodSuggestion.title}
        className="h-48 w-full bg-[#fff8df] object-contain p-3"
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-[#123f1c]">{foodSuggestion.title}</h3>

        <p className="mt-2 text-sm leading-6 text-[#416343]">
          {foodSuggestion.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect(foodSuggestion)}
          className="mt-4 rounded-md border border-[#d9c891] px-3 py-2 text-sm font-bold text-[#174f24] transition hover:bg-[#fff8df] focus:outline-none focus:ring-2 focus:ring-[#d07b00]"
        >
          Ver sugerencia
        </button>
      </div>
    </article>
  )
}
