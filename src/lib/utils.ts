import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that combines clsx and tailwind-merge to
 * conditionally join and merge Tailwind CSS classes efficiently.
 * * @param inputs - An array of class names, conditional objects, or null/undefined values.
 * @returns A single, merged string of CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
