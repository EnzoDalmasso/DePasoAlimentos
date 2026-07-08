export type CartItemType = 'product' | 'promotion'

export type CartItemInput = {
  id: number
  type: CartItemType
  name: string
  price: number
  imageUrl: string
}

export type CartItem = CartItemInput & {
  quantity: number
}

export type CartContextValue = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItemInput) => void
  removeItem: (type: CartItemType, id: number) => void
  increaseQuantity: (type: CartItemType, id: number) => void
  decreaseQuantity: (type: CartItemType, id: number) => void
  clearCart: () => void
}
