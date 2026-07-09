import { WHATSAPP_URL } from '../config/contact'

export function ContactBanner() { 
  return (
    <section className="mt-8 rounded-lg border border-[#0e351e] bg-[#15552a] p-5 text-white shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
         <p className="text-xs font-black uppercase tracking-wide text-[#d8bf70]">
            Pedido directo
         </p>

         <h2 className="mt-1 text-xl font-black">
            Queres hacer un pedido?
         </h2>

         <p className="mt-2 max-w-2xl text-sm leading-6 text-[#eaf8ed]">
            Escribinos por WhatsApp y te contamos disponibilidad, formas de pago
            y coordinacion de entrega.
         </p>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-black text-[#15552a] transition hover:bg-[#fff5df]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </section>
  )
}
