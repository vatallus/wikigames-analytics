/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize user input by removing dangerous characters
 */
export const sanitizeInput = (input: string, maxLength = 500): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, maxLength)
}

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.\-+]/g, '') // Only allow valid email characters
    .slice(0, 254) // Max email length
}

/**
 * Sanitize transaction hash (only alphanumeric and 0x prefix)
 */
export const sanitizeTransactionHash = (hash: string): string => {
  return hash
    .trim()
    .toLowerCase()
    .replace(/[^a-f0-9x]/g, '') // Only allow hex characters and 'x'
    .slice(0, 66) // Max hash length (0x + 64 chars)
}

/**
 * Sanitize username (alphanumeric, underscore, hyphen)
 */
export const sanitizeUsername = (username: string): string => {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^\w\-]/g, '') // Only allow letters, numbers, underscore, hyphen
    .slice(0, 50)
}

/**
 * Escape HTML entities
 */
export const escapeHTML = (str: string): string => {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char])
}

/**
 * Sanitize URL - only allow http/https protocols
 */
export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}
