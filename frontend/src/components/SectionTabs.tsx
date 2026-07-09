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
    <nav className="sticky top-0 z-30 -mx-4 mt-4 overflow-x-auto border-y border-[#d9ead7] bg-[#eaf8ed]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
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
    'whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-black transition sm:px-5'
  if (isActive) {
    return `${baseClassName} bg-[#15552a] text-white shadow-sm`
  }

  return `${baseClassName} border border-[#cbe5c9] bg-white text-[#416343] hover:border-[#15552a] hover:text-[#0e351e]`
}
