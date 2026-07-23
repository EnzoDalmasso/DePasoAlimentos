import logo from '../assets/depasoalimentos-logo.png'

export function Header() {
  return (
    <header className="logo-sage-panel relative overflow-hidden rounded-[2rem] border border-[#d8bf70]/35 shadow-[0_30px_80px_rgba(61,37,18,0.16)]">
      <div className="absolute -left-14 top-16 h-40 w-40 rounded-full bg-[#d8bf70]/20 blur-3xl" />
      <div className="absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-[#0e351e]/15 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="brand-display truncate text-2xl font-bold tracking-tight text-[#0e351e]">
          DePasoAlimentos
        </p>
      </div>

      <div className="relative z-10 grid gap-8 px-5 pb-8 pt-4 sm:px-8 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-10">
        <div className="max-w-3xl animate-soft-rise">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#b83924]">
            Listos para cocinar
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-[#0e351e] sm:text-6xl lg:text-7xl">
            Comida casera para resolver tu semana.
          </h1>

          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#26462d] sm:text-lg">
            Pastas, pizzas, empanadas, salsas y promociones para resolver la
            comida sin perder tiempo. Elegís, armás tu pedido y coordinamos el
            retiro por WhatsApp.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="depaso-button inline-flex items-center justify-center rounded-full bg-[#15552a] px-5 py-3 text-sm font-black text-white"
            >
              Ver catálogo
            </a>
            <a
              href="#pedido"
              className="depaso-button inline-flex items-center justify-center rounded-full border border-[#d8bf70]/60 bg-[#f5ead8]/60 px-5 py-3 text-sm font-black text-[#0e351e]"
            >
              Hacer pedido
            </a>
          </div>

          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
            <span className="rounded-2xl border border-[#0e351e]/10 bg-[#f5ead8]/50 px-4 py-3 text-sm font-bold text-[#15552a] shadow-sm">
              Retiro coordinado
            </span>
            <span className="rounded-2xl border border-[#d8bf70]/40 bg-[#f5ead8]/50 px-4 py-3 text-sm font-bold text-[#8b5711] shadow-sm">
              Pago en local
            </span>
            <span className="rounded-2xl border border-[#b83924]/20 bg-[#f5ead8]/50 px-4 py-3 text-sm font-bold text-[#b83924] shadow-sm">
              Stock confirmado
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-soft-rise">
          <div className="absolute -left-3 top-6 z-20 rounded-2xl border border-[#d8bf70]/45 bg-[#f5ead8]/78 px-4 py-3 text-sm font-black text-[#8b5711] shadow-lg backdrop-blur">
            Casero
          </div>

          <div className="absolute -right-2 bottom-8 z-20 rounded-2xl border border-[#cbe5c9] bg-[#15552a] px-4 py-3 text-sm font-black text-white shadow-lg">
            Listo para freezar
          </div>

          <div className="animate-soft-float">
            <img
              src={logo}
              alt="DePasoAlimentos"
              className="mx-auto h-72 w-full object-contain drop-shadow-[0_28px_44px_rgba(14,53,30,0.24)] sm:h-88"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
