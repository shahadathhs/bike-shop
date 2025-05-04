import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncate = (text: string, len = 100) =>
  text.length > len ? text.slice(0, len).trim() + '...' : text
