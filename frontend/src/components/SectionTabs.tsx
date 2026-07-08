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
    <nav className="mt-6 w-full overflow-x-auto">
      <div className="inline-flex rounded-lg border border-[#d6bd6f] bg-[#fffaf0] p-1 shadow-sm">
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
    'whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition'
  if (isActive) {
    return `${baseClassName} bg-[#174f24] text-[#fff8df] shadow-sm`
  }

  return `${baseClassName} text-[#416343] hover:bg-[#f2dfad] hover:text-[#123f1c]`
}
