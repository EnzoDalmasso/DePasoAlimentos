export type Section = 'products' | 'promotions' | 'foodSuggestions'

type SectionTabsProps = {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const tabs: Array<{ label: string; value: Section }> = [
  { label: 'Productos', value: 'products' },
  { label: 'Promociones', value: 'promotions' },
  { label: 'Sugerencias', value: 'foodSuggestions' },
]

export function SectionTabs({
  activeSection,
  onSectionChange,
}: SectionTabsProps) {
  return (
    <nav className="sticky top-0 z-30 -mx-4 mt-5 overflow-x-auto border-y border-[#d8bf70]/25 bg-[#f5ead8]/88 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border sm:shadow-[0_14px_34px_rgba(61,37,18,0.08)]">
      <div className="inline-flex min-w-full gap-2 sm:min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onSectionChange(tab.value)}
            className={getTabClassName(activeSection === tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function getTabClassName(isActive: boolean) {
  const baseClassName =
    'depaso-button whitespace-nowrap rounded-full px-5 py-3 text-sm font-black transition sm:px-6'
  if (isActive) {
    return `${baseClassName} bg-[#15552a] text-white shadow-[0_14px_28px_rgba(21,85,42,0.22)]`
  }

  return `${baseClassName} border border-[#d8bf70]/35 bg-white/70 text-[#416343] hover:border-[#15552a] hover:text-[#0e351e]`
}
