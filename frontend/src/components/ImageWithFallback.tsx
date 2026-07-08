import { useEffect, useState } from 'react'

type ImageWithFallbackProps = {
  src?: string | null
  alt: string
  className?: string
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-sm text-slate-500 ${className}`}
      >
        Imagen no disponible
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}