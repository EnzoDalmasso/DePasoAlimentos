import { API_BASE_URL } from '../config/api'

const ADMIN_TOKEN_KEY = 'depasoalimentos_admin_token'
const ADMIN_EMAIL_KEY = 'depasoalimentos_admin_email'

type LoginResponse = {
  token: string
  email: string
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('No se pudo iniciar sesion.')
  }

  const loginResponse: LoginResponse = await response.json()

  localStorage.setItem(ADMIN_TOKEN_KEY, loginResponse.token)
  localStorage.setItem(ADMIN_EMAIL_KEY, loginResponse.email)

  return loginResponse
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  if (!response.ok) {
    throw new Error('No se pudo cambiar la contraseña.')
  }
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function getAdminEmail() {
  return localStorage.getItem(ADMIN_EMAIL_KEY)
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_EMAIL_KEY)
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getAdminToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}
