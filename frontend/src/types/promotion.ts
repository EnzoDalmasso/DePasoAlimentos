export type Promotion = {
  id: number
  title: string
  description: string
  promoPrice: number
  imageUrl: string
  startsAt: string | null
  endsAt: string | null
  isActive: boolean
}