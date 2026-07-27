export const PRODUCT_CATEGORIES = [
  'Pastas',
  'Panificacion',
  'Lacteos',
  'Postres',
  'Almacen',
  'Carnes',
  'Congelados',
  'Salsas',
  'Comidas preparadas',
  'Guarniciones',
] as const

export const DEFAULT_PRODUCT_CATEGORY = PRODUCT_CATEGORIES[0]

const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  Panificacion: 'Panificación',
  Lacteos: 'Lácteos',
  Almacen: 'Almacén',
}

export function getProductCategoryLabel(category: string) {
  return PRODUCT_CATEGORY_LABELS[category] ?? category
}
