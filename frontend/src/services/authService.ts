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
    throw new Error('No se pudo iniciar sesión.')
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
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)

  if (token && isTokenExpired(token)) {
    logoutAdmin()
    return null
  }

  return token
}

function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload: { exp?: number } = JSON.parse(atob(payloadBase64))

    return !payload.exp || payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
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
