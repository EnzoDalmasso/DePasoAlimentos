export const WHATSAPP_PHONE = '5493471682982'

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_URL = buildWhatsAppUrl(
  'Hola! Quiero hacer un pedido en DePasoAlimentos.',
)
