import { API_BASE_URL } from '../config/api'
import type {
  SaveSpecialBusinessDayPayload,
  StoreHours,
  UpdateBusinessHourPayload,
} from '../types/storeHours'
import { getAdminAuthHeaders } from './authService'

export async function getStoreHours(): Promise<StoreHours> {
  const response = await fetch(`${API_BASE_URL}/store-hours`)

  if (!response.ok) {
    throw new Error('No se pudieron obtener los horarios.')
  }

  return response.json()
}

export async function updateBusinessHour(
  id: number,
  businessHour: UpdateBusinessHourPayload,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/store-hours/weekly/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(businessHour),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar el horario.')
  }
}

export async function createSpecialBusinessDay(
  specialDay: SaveSpecialBusinessDayPayload,
) {
  const response = await fetch(`${API_BASE_URL}/store-hours/special-days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(specialDay),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear el dia especial.')
  }

  return response.json()
}

export async function updateSpecialBusinessDay(
  id: number,
  specialDay: SaveSpecialBusinessDayPayload,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/store-hours/special-days/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(specialDay),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar el dia especial.')
  }
}

export async function deleteSpecialBusinessDay(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/store-hours/special-days/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar el dia especial.')
  }
}
