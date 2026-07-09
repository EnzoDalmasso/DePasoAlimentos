import logo from '../assets/depasoalimentos-logo.png'

export function Header() {
  return (
    <header className="overflow-hidden rounded-lg border border-[#cbe5c9] bg-[#f8fff5] shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-[#d9ead7] px-4 py-3 sm:px-5">
        <p className="truncate text-lg font-black text-[#0e351e]">
          DePasoAlimentos
        </p>
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:px-8 lg:py-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-[#d77a16]">
            Listos para cocinar
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-[#0e351e] sm:text-5xl lg:text-6xl">
            Comidas ricas, practicas y caseras para tu semana.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#416343] sm:text-lg">
            Pastas, pizzas, empanadas, salsas y promociones para resolver la
            comida sin perder tiempo. Elegis, armas tu pedido y coordinamos el
            retiro por WhatsApp.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-md bg-[#eaf8ed] px-3 py-2 text-sm font-bold text-[#15552a]">
              Retiro coordinado
            </span>
            <span className="rounded-md bg-[#fff5df] px-3 py-2 text-sm font-bold text-[#8b5711]">
              Pago en local
            </span>
            <span className="rounded-md bg-[#fff0eb] px-3 py-2 text-sm font-bold text-[#b83924]">
              Stock confirmado
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-lg border border-[#cbe5c9] bg-white p-5 shadow-sm">
            <img
              src={logo}
              alt="DePasoAlimentos"
              className="mx-auto h-56 w-full object-contain sm:h-64"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
