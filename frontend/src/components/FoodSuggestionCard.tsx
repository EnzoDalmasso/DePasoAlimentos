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
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#ead2ca] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b83924] hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(foodSuggestion)}
        className="block bg-[#fff0eb] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b83924]"
      >
        <ImageWithFallback
          src={foodSuggestion.imageUrl}
          alt={foodSuggestion.title}
          className="h-48 w-full object-contain"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#b83924]">
          Sugerencia
        </p>

        <h3 className="mt-1 font-black text-[#0e351e]">
          {foodSuggestion.title}
        </h3>

        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-[#416343]">
          {foodSuggestion.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect(foodSuggestion)}
          className="mt-4 rounded-md border border-[#ead2ca] px-3 py-2 text-sm font-black text-[#b83924] transition hover:bg-[#fff0eb] focus:outline-none focus:ring-2 focus:ring-[#b83924]"
        >
          Ver sugerencia
        </button>
      </div>
    </article>
  )
}
