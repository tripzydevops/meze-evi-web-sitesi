import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shouldShowPrice(price: string | null | undefined): boolean {
  if (!price) return false
  
  // Remove currency symbols, whitespace, and common separators
  const cleanPrice = price.trim().replace(/[₺\$\s,]/g, '')
  
  // If nothing left, it was just symbols/space
  if (cleanPrice === '') return false
  
  // Convert to number and check if it's greater than 0
  const numPrice = parseFloat(cleanPrice)
  return !isNaN(numPrice) && numPrice > 0
}
