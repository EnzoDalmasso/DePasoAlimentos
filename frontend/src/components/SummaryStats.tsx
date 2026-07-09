type SummaryStatsProps = {
  productsCount: number
  promotionsCount: number
  foodSuggestionsCount: number
}

export function SummaryStats({
  productsCount,
  promotionsCount,
  foodSuggestionsCount,
}: SummaryStatsProps) {
  return (
    <section className="mt-3 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
      <div className="rounded-lg border border-[#cbe5c9] bg-white p-2.5 shadow-sm sm:p-4">
        <p className="text-[0.7rem] font-bold text-[#416343] sm:text-sm">
          Productos<span className="hidden sm:inline"> activos</span>
        </p>
        <p className="mt-0.5 text-xl font-black text-[#15552a] sm:mt-1 sm:text-3xl">
          {productsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#ead9a0] bg-white p-2.5 shadow-sm sm:p-4">
        <p className="text-[0.7rem] font-bold text-[#8b5711] sm:text-sm">
          Promos
        </p>
        <p className="mt-0.5 text-xl font-black text-[#d77a16] sm:mt-1 sm:text-3xl">
          {promotionsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#ead2ca] bg-white p-2.5 shadow-sm sm:p-4">
        <p className="text-[0.7rem] font-bold text-[#7d3528] sm:text-sm">
          Ideas<span className="hidden sm:inline"> publicadas</span>
        </p>
        <p className="mt-0.5 text-xl font-black text-[#b83924] sm:mt-1 sm:text-3xl">
          {foodSuggestionsCount}
        </p>
      </div>
    </section>
  )
}
