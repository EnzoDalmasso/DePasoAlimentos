import { useEffect, useState } from 'react'
import { buildWhatsAppUrl } from '../config/contact'
import type { CartItem } from '../context/cartTypes'
import { useCart } from '../context/useCart'

type PaymentMethod = 'cash' | 'transfer' | 'confirm'

type OrderDetails = {
  customerName: string
  paymentMethod: PaymentMethod
  pickupDetail: string
  notes: string
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  confirm: 'A confirmar',
}

function formatPrice(price: number) {
  return `$${price.toLocaleString('es-AR')}`
}

function getItemLabel(item: CartItem) {
  return item.type === 'promotion' ? 'Promo' : 'Producto'
}

function buildOrderMessage(
  items: CartItem[],
  totalPrice: number,
  orderDetails: OrderDetails,
) {
  const itemLines = items.map(
    (item) =>
      `- ${item.quantity} x ${item.name} (${getItemLabel(item)}) - ${formatPrice(
        item.price * item.quantity,
      )}`,
  )

  const detailLines = [
    `Nombre: ${orderDetails.customerName.trim() || 'A confirmar'}`,
    `Forma de pago: ${paymentMethodLabels[orderDetails.paymentMethod]}`,
  ]

  if (orderDetails.pickupDetail.trim()) {
    detailLines.push(`Retiro: ${orderDetails.pickupDetail.trim()}`)
  }

  if (orderDetails.notes.trim()) {
    detailLines.push(`Aclaraciones: ${orderDetails.notes.trim()}`)
  }

  return [
    'Hola! Quiero hacer un pedido en DePasoAlimentos:',
    '',
    ...itemLines,
    '',
    `Total aproximado: ${formatPrice(totalPrice)}`,
    '',
    ...detailLines,
    '',
    'Me confirman disponibilidad para pasarlo a retirar?',
  ].join('\n')
}

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart()

  const [isOpen, setIsOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('confirm')
  const [pickupDetail, setPickupDetail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalBodyOverflow
    }
  }, [isOpen])

  const whatsappUrl = buildWhatsAppUrl(
    buildOrderMessage(items, totalPrice, {
      customerName,
      paymentMethod,
      pickupDetail,
      notes,
    }),
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#d65424] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#b3321f] focus:outline-none focus:ring-2 focus:ring-[#fff8df] focus:ring-offset-2"
      >
        Pedido ({totalItems})
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className="ml-auto flex h-full w-full max-w-lg flex-col bg-[#fffdf7] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="border-b border-[#d9c891] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-[#b3321f]">
                    Tu pedido
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#123f1c]">
                    Productos seleccionados
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-[#d9c891] px-3 py-1.5 text-sm font-bold text-[#416343] transition hover:bg-[#fff8df]"
                >
                  Cerrar
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-[#d9c891] bg-[#fff8df] p-4 text-sm font-medium leading-6 text-[#416343]">
                  Todavia no agregaste productos o promociones al pedido.
                </p>
              )}

              <div className="grid gap-3">
                {items.map((item) => (
                  <article
                    key={`${item.type}-${item.id}`}
                    className="rounded-lg border border-[#d9c891] bg-white p-4"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-[#b3321f]">
                          {getItemLabel(item)}
                        </p>
                        <h3 className="mt-1 font-black text-[#123f1c]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-[#416343]">
                          {formatPrice(item.price)} c/u
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.type, item.id)}
                        className="h-8 rounded-md border border-[#d9c891] px-2 text-xs font-bold text-[#b3321f] transition hover:bg-[#fff8df]"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-md border border-[#d9c891]">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.type, item.id)}
                          className="px-3 py-1.5 text-lg font-black text-[#174f24] transition hover:bg-[#fff8df]"
                        >
                          -
                        </button>
                        <span className="min-w-10 px-3 text-center text-sm font-black text-[#123f1c]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.type, item.id)}
                          className="px-3 py-1.5 text-lg font-black text-[#174f24] transition hover:bg-[#fff8df]"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-black text-[#b3321f]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {items.length > 0 && (
                <section className="mt-5 rounded-lg border border-[#d9c891] bg-[#fff8df] p-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#b3321f]">
                      Datos para WhatsApp
                    </p>
                    <h3 className="mt-1 text-lg font-black text-[#123f1c]">
                      Completar pedido
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <label className="grid gap-1 text-sm font-bold text-[#416343]">
                      Nombre
                      <input
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        className="rounded-md border border-[#d9c891] bg-white px-3 py-2 text-sm text-[#123f1c] outline-none transition focus:border-[#d07b00] focus:ring-2 focus:ring-[#f2dfad]"
                        placeholder="Ej: Mauge Blanco"
                      />
                    </label>

                    <label className="grid gap-1 text-sm font-bold text-[#416343]">
                      Forma de pago
                      <select
                        value={paymentMethod}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value as PaymentMethod)
                        }
                        className="rounded-md border border-[#d9c891] bg-white px-3 py-2 text-sm text-[#123f1c] outline-none transition focus:border-[#d07b00] focus:ring-2 focus:ring-[#f2dfad]"
                      >
                        <option value="confirm">A confirmar</option>
                        <option value="cash">Efectivo</option>
                        <option value="transfer">Transferencia</option>
                      </select>
                    </label>

                    <label className="grid gap-1 text-sm font-bold text-[#416343]">
                      Horario o detalle de retiro
                      <input
                        value={pickupDetail}
                        onChange={(event) => setPickupDetail(event.target.value)}
                        className="rounded-md border border-[#d9c891] bg-white px-3 py-2 text-sm text-[#123f1c] outline-none transition focus:border-[#d07b00] focus:ring-2 focus:ring-[#f2dfad]"
                        placeholder="Ej: Retiro despues de las 19"
                      />
                    </label>

                    <label className="grid gap-1 text-sm font-bold text-[#416343]">
                      Aclaraciones
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="min-h-20 rounded-md border border-[#d9c891] bg-white px-3 py-2 text-sm text-[#123f1c] outline-none transition focus:border-[#d07b00] focus:ring-2 focus:ring-[#f2dfad]"
                        placeholder="Ej: si no hay sorrentinos, reemplazar por noquis"
                      />
                    </label>
                  </div>
                </section>
              )}

              {items.length > 0 && (
                <section className="mt-5 rounded-lg border border-[#d9c891] bg-[#fff8df] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-black uppercase tracking-wide text-[#416343]">
                      Total aproximado
                    </span>
                    <strong className="text-2xl font-black text-[#b3321f]">
                      {formatPrice(totalPrice)}
                    </strong>
                  </div>

                  <p className="mt-2 text-xs font-medium leading-5 text-[#416343]">
                    El total es orientativo. La disponibilidad se confirma por
                    WhatsApp antes del retiro.
                  </p>

                  <div className="mt-4 grid gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-[#174f24] px-4 py-3 text-sm font-black text-white transition hover:bg-[#123f1c]"
                    >
                      Enviar pedido por WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-md border border-[#d9c891] px-4 py-2 text-sm font-bold text-[#416343] transition hover:bg-white"
                    >
                      Vaciar pedido
                    </button>
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
