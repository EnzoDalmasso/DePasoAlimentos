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
    <article className="depaso-card-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#ead2ca] bg-white/80 text-left shadow-[0_14px_34px_rgba(61,37,18,0.08)] backdrop-blur">
      <button
        type="button"
        onClick={() => onSelect(foodSuggestion)}
        className="block bg-gradient-to-br from-[#fff0eb] to-[#f5ead8] p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b83924]"
      >
        <ImageWithFallback
          src={foodSuggestion.imageUrl}
          alt={foodSuggestion.title}
          className="h-52 w-full object-contain transition duration-300 hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b83924]">
          Sugerencia
        </p>

        <h3 className="mt-1 text-lg font-black text-[#0e351e]">
          {foodSuggestion.title}
        </h3>

        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-[#416343]">
          {foodSuggestion.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect(foodSuggestion)}
          className="depaso-button mt-4 rounded-full border border-[#ead2ca] bg-white/70 px-3 py-2.5 text-sm font-black text-[#b83924] focus:outline-none focus:ring-2 focus:ring-[#b83924]"
        >
          Ver sugerencia
        </button>
      </div>
    </article>
  )
}
