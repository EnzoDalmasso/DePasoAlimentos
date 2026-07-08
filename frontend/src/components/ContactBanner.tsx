import { WHATSAPP_URL } from '../config/contact'

export function ContactBanner() { 
  return (
    <section className="mt-10 rounded-lg border border-[#d6bd6f] bg-[#174f24] p-5 text-[#fff8df] shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
         <h2 className="text-lg font-black">
            Queres hacer un pedido?
         </h2>

         <p className="mt-1 text-sm leading-6 text-[#f2dfad]">
            Escribinos por WhatsApp y te contamos disponibilidad, formas de pago
            y coordinacion de entrega.
         </p>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-[#d65424] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#b3321f]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </section>
  )
}
