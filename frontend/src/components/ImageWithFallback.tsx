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
        className={`flex items-center justify-center bg-[#f4fbf3] text-sm font-bold text-[#6d846f] ${className}`}
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
