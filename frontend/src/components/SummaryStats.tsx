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
    <section className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-[#cbe5c9] bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#416343]">Productos activos</p>
        <p className="mt-1 text-3xl font-black text-[#15552a]">
          {productsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#ead9a0] bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#8b5711]">Promociones</p>
        <p className="mt-1 text-3xl font-black text-[#d77a16]">
          {promotionsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#ead2ca] bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#7d3528]">Ideas publicadas</p>
        <p className="mt-1 text-3xl font-black text-[#b83924]">
          {foodSuggestionsCount}
        </p>
      </div>
    </section>
  )
}
