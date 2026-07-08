import logo from '../assets/depasoalimentos-logo.png'

export function Header() {
  return (
    <header className="border-b border-[#d9c891] pb-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#b3321f]">
            Congelados caseros listos para cocinar
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#123f1c] sm:text-5xl">
            DePasoAlimentos
          </h1>

          <p className="mt-3 text-base leading-7 text-[#416343] sm:text-lg">
            Pastas, pizzas, empanadas, salsas y promos para resolver comidas
            ricas sin perder tiempo.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src={logo}
            alt="DePasoAlimentos"
            className="w-full max-w-72 object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </header>
  )
}
