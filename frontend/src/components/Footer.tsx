const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-12 bg-[#0e351e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 pb-6">
          <p className="text-2xl font-black">DePasoAlimentos</p>

          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[#d8f0d8]">
            Alimentos congelados, promociones y sugerencias para resolver
            comidas prácticas coordinando pedidos por WhatsApp.
          </p>
        </div>

        <div className="pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            &copy; {currentYear} DePasoAlimentos. Todos los derechos reservados.
          </p>

          <a
            href="https://porfolio-enzo-dalmasso.vercel.app/#projects"
            target="_blank"
            rel="noreferrer"
            className="group mt-5 inline-block"
          >
            <span className="block text-xs font-black uppercase tracking-[0.22em] text-white/55 transition group-hover:text-[#d8bf70]">
              Desarrollado por
            </span>

            <span className="mt-2 block text-sm font-black uppercase tracking-[0.18em] text-white transition group-hover:text-[#d8bf70]">
              Enzo Dalmasso
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
