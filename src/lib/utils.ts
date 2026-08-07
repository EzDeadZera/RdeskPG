import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 * Usado por todos os componentes em components/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
