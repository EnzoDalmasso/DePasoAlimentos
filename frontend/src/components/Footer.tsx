const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-8 bg-[#0e351e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 pb-6">
          <p className="text-2xl font-black">DePasoAlimentos</p>

          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[#d8f0d8]">
            Alimentos congelados, promociones y sugerencias para resolver
            comidas practicas coordinando pedidos por WhatsApp.
          </p>
        </div>

        <div className="pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            &copy; {currentYear} DePasoAlimentos. Todos los derechos reservados.
          </p>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#d8bf70]">
            Desarrollado por
          </p>

          <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white">
            Enzo Dalmasso
          </p>
        </div>
      </div>
    </footer>
  )
}
