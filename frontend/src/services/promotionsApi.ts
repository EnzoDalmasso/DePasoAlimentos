import { API_BASE_URL } from '../config/api'
import type { Promotion } from '../types/promotion'
import { getAdminAuthHeaders } from './authService'

export async function getPromotions(): Promise<Promotion[]> {
  const response = await fetch(`${API_BASE_URL}/promotions`)

  if (!response.ok) {
    throw new Error('No se pudieron obtener las promociones')
  }

  return response.json()
}

type CreatePromotionRequest = {
  title: string
  description: string
  promoPrice: number
  imageUrl: string
}

type UpdatePromotionRequest = {
  title: string
  description: string
  promoPrice: number
  imageUrl: string
  isActive: boolean
}

export async function getAdminPromotions(): Promise<Promotion[]> {
  const response = await fetch(`${API_BASE_URL}/promotions/admin`, {
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudieron obtener las promociones del administrador.')
  }

  return response.json()
}

export async function createPromotion(
  promotion: CreatePromotionRequest,
): Promise<Promotion> {
  const response = await fetch(`${API_BASE_URL}/promotions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(promotion),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear la promocion.')
  }

  return response.json()
}

export async function updatePromotion(
  id: number,
  promotion: UpdatePromotionRequest,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(promotion),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar la promocion.')
  }
}

export async function activatePromotion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/promotions/${id}/activate`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo activar la promocion.')
  }
}

export async function deactivatePromotion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/promotions/${id}/deactivate`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo desactivar la promocion.')
  }
}

export async function deletePromotion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar la promocion.')
  }
}
