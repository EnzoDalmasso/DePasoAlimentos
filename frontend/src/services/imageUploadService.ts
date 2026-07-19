import { API_BASE_URL } from '../config/api'
import { getAdminAuthHeaders } from './authService'

type ImageFolder = 'products' | 'promotions' | 'food-suggestions'

type UploadImageResponse = {
  imageUrl: string
}

export async function uploadImage(
  file: File,
  folder: ImageFolder,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const errorResponse = await response
      .json()
      .catch(() => ({ message: 'No pudimos subir la imagen.' }))

    throw new Error(errorResponse.message ?? 'No pudimos subir la imagen.')
  }

  const uploadImageResponse: UploadImageResponse = await response.json()

  return uploadImageResponse.imageUrl
}
