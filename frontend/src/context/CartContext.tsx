import { useEffect, useState, type ReactNode } from 'react'
import { CartContext } from './cartContextValue'
import type { CartItem, CartItemInput, CartItemType } from './cartTypes'

const CART_STORAGE_KEY = 'depasoalimentos-cart'

function getCartItemKey(item: { type: CartItemType; id: number }) {
  return `${item.type}-${item.id}`
}

function getInitialItems(): CartItem[] {
  const storedItems = localStorage.getItem(CART_STORAGE_KEY)

  if (!storedItems) {
    return []
  }

  const parsedItems = JSON.parse(storedItems)

  return Array.isArray(parsedItems) ? parsedItems : []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialItems)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  function addItem(itemToAdd: CartItemInput) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => getCartItemKey(item) === getCartItemKey(itemToAdd),
      )

      if (existingItem) {
        return currentItems.map((item) =>
          getCartItemKey(item) === getCartItemKey(itemToAdd)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentItems, { ...itemToAdd, quantity: 1 }]
    })
  }

  function removeItem(type: CartItemType, id: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.type !== type || item.id !== id),
    )
  }

  function increaseQuantity(type: CartItemType, id: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.type === type && item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  function decreaseQuantity(type: CartItemType, id: number) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.type === type && item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
