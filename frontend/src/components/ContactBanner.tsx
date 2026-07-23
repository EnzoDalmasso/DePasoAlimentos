import { WHATSAPP_URL } from '../config/contact'

export function ContactBanner() { 
  return (
    <section
      id="pedido"
      className="relative mt-12 overflow-hidden rounded-[2rem] border border-[#d8bf70]/35 bg-[#b8763e] p-6 text-white shadow-[0_24px_60px_rgba(61,37,18,0.16)] sm:p-8"
    >
      <div className="absolute -left-14 bottom-0 h-32 w-32 rounded-full bg-[#0e351e]/20 blur-2xl" />
      <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#d8bf70]/25 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
         <p className="text-xs font-black uppercase tracking-[0.28em] text-[#fff5df]">
            Pedido directo
         </p>

         <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            ¿Querés hacer un pedido?
         </h2>

         <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[#fffaf0]">
            Escribinos por WhatsApp y te contamos disponibilidad, formas de pago
            y coordinación de entrega.
         </p>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="depaso-button inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#15552a]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </section>
  )
}
