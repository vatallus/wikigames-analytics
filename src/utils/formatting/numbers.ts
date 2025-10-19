/**
 * Number Formatting Utilities
 */

/**
 * Format number with commas (e.g., 1234567 -> 1,234,567)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

/**
 * Format number in compact form (e.g., 1234567 -> 1.2M)
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString()
  }
  
  if (num < 1_000_000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  
  if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  
  return `${(num / 1_000_000_000).toFixed(1)}B`
}

/**
 * Format percentage (e.g., 0.1234 -> 12.3%)
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format file size (e.g., 1234567 -> 1.2 MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate random number between min and max
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
