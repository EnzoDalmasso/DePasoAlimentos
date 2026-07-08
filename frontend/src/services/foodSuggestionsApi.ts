import { API_BASE_URL } from '../config/api'
import type { FoodSuggestion } from '../types/foodSuggestion'
import { getAdminAuthHeaders } from './authService'

export async function getFoodSuggestions(): Promise<FoodSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions`)

  if (!response.ok) {
    throw new Error('No se pudieron obtener las sugerencias')
  }

  return response.json()
}

type CreateFoodSuggestionRequest = {
  title: string
  description: string
  imageUrl: string
}

type UpdateFoodSuggestionRequest = {
  title: string
  description: string
  imageUrl: string
  isPublished: boolean
}

export async function getAdminFoodSuggestions(): Promise<FoodSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions/admin`, {
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudieron obtener las sugerencias del administrador.')
  }

  return response.json()
}

export async function createFoodSuggestion(
  foodSuggestion: CreateFoodSuggestionRequest,
): Promise<FoodSuggestion> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(foodSuggestion),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear la sugerencia.')
  }

  return response.json()
}

export async function updateFoodSuggestion(
  id: number,
  foodSuggestion: UpdateFoodSuggestionRequest,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(foodSuggestion),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar la sugerencia.')
  }
}

export async function publishFoodSuggestion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions/${id}/publish`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo publicar la sugerencia.')
  }
}

export async function unpublishFoodSuggestion(id: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/foodsuggestions/${id}/unpublish`,
    {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('No se pudo despublicar la sugerencia.')
  }
}

export async function deleteFoodSuggestion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/foodsuggestions/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar la sugerencia.')
  }
}
