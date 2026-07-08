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
      <div className="rounded-lg border border-[#d9c891] bg-[#fffaf0] p-4 shadow-sm">
        <p className="text-sm font-semibold text-[#416343]">Productos</p>
        <p className="mt-1 text-2xl font-black text-[#174f24]">
          {productsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#d9c891] bg-[#fffaf0] p-4 shadow-sm">
        <p className="text-sm font-semibold text-[#8b6515]">Promociones</p>
        <p className="mt-1 text-2xl font-black text-[#d07b00]">
          {promotionsCount}
        </p>
      </div>

      <div className="rounded-lg border border-[#d9c891] bg-[#fffaf0] p-4 shadow-sm">
        <p className="text-sm font-semibold text-[#7d3528]">Sugerencias</p>
        <p className="mt-1 text-2xl font-black text-[#b3321f]">
          {foodSuggestionsCount}
        </p>
      </div>
    </section>
  )
}
