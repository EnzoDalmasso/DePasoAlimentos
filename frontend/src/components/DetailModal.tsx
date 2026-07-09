import { useEffect } from 'react'
import { ImageWithFallback } from './ImageWithFallback'

type DetailModalProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  priceLabel?: string
  onClose: () => void
}

export function DetailModal({
  eyebrow,
  title,
  description,
  imageUrl,
  priceLabel,
  onClose,
}: DetailModalProps) {
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e351e]/65 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-[#cbe5c9] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-[22rem] w-full bg-[#f4fbf3] object-contain p-5 sm:h-[30rem] lg:h-full"
          />

          <div className="flex min-h-[30rem] flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-wide text-[#b83924]">
                {eyebrow}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#cbe5c9] px-3 py-1.5 text-sm font-bold text-[#416343] transition hover:bg-[#eaf8ed]"
              >
                Cerrar
              </button>
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight text-[#0e351e]">
              {title}
            </h2>

            <p className="mt-5 whitespace-pre-line text-lg leading-8 text-[#416343]">
              {description}
            </p>

            {priceLabel && (
              <p className="mt-8 text-4xl font-black text-[#b83924]">
                {priceLabel}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
