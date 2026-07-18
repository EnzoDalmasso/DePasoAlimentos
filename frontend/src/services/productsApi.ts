import { API_BASE_URL } from '../config/api'
import type { Product } from '../types/product'
import { getAdminAuthHeaders } from './authService'

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`)

  if (!response.ok) {
    throw new Error('No se pudieron obtener los productos')
  }

  return response.json()
}

export async function getAdminProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/admin`, {
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudieron obtener los productos del administrador.')
  }

  return response.json()
}

type CreateProductRequest = {
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
}

type UpdateProductRequest = {
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  isActive: boolean
}

export async function createProduct(
  product: CreateProductRequest,
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear el producto.')
  }

  return response.json()
}

export async function activateProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}/activate`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo activar el producto.')
  }
}

export async function deactivateProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}/deactivate`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo desactivar el producto.')
  }
}

export async function updateProduct(
  id: number,
  product: UpdateProductRequest,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar el producto.')
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar el producto.')
  }
}
