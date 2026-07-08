import { useState } from 'react'
import { uploadImage } from '../services/imageUploadService'

type ImageUploadFolder = 'products' | 'promotions' | 'food-suggestions'

type ImageUploadFieldProps = {
  folder: ImageUploadFolder
  imageUrl: string
  onImageUrlChange: (imageUrl: string) => void
}

export function ImageUploadField({
  folder,
  imageUrl,
  onImageUrlChange,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setIsUploading(true)
      setErrorMessage(null)

      const uploadedImageUrl = await uploadImage(file, folder)
      onImageUrlChange(uploadedImageUrl)
    } catch {
      setErrorMessage('No pudimos subir la imagen.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-slate-700">Imagen</label>

      <label className="flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 transition hover:border-emerald-500 hover:bg-emerald-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Vista previa"
            className="h-40 w-full object-contain p-2"
          />
        ) : (
          <span className="px-4">
            {isUploading ? 'Subiendo imagen...' : 'Seleccionar imagen'}
          </span>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}