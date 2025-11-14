import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString()
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}