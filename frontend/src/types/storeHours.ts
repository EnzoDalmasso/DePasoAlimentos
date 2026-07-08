export type BusinessHour = {
  id: number
  dayOfWeek: number
  dayName: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  secondOpenTime: string | null
  secondCloseTime: string | null
  notes: string
}

export type SpecialBusinessDay = {
  id: number
  date: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  secondOpenTime: string | null
  secondCloseTime: string | null
  reason: string
}

export type StoreHours = {
  weeklyHours: BusinessHour[]
  specialDays: SpecialBusinessDay[]
}

export type UpdateBusinessHourPayload = {
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  secondOpenTime: string | null
  secondCloseTime: string | null
  notes: string
}

export type SaveSpecialBusinessDayPayload = {
  date: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  secondOpenTime: string | null
  secondCloseTime: string | null
  reason: string
}
