/**
 * Email Validation Utilities
 */

// RFC 5322 compliant email regex (simplified)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// More strict email validation
const STRICT_EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmed = email.trim().toLowerCase()
  
  // Length check
  if (trimmed.length < 3 || trimmed.length > 254) {
    return false
  }
  
  return EMAIL_PATTERN.test(trimmed)
}

/**
 * Strict email validation (more restrictive)
 */
export const validateEmailStrict = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmed = email.trim().toLowerCase()
  
  if (trimmed.length < 3 || trimmed.length > 254) {
    return false
  }
  
  return STRICT_EMAIL_PATTERN.test(trimmed)
}

/**
 * Get email validation error message
 */
export const getEmailValidationError = (email: string): string | null => {
  if (!email) {
    return 'Email address is required'
  }
  
  const trimmed = email.trim()
  
  if (trimmed.length < 3) {
    return 'Email address is too short'
  }
  
  if (trimmed.length > 254) {
    return 'Email address is too long'
  }
  
  if (!trimmed.includes('@')) {
    return 'Email address must contain @'
  }
  
  if (!trimmed.includes('.')) {
    return 'Email address must contain a domain'
  }
  
  if (!validateEmail(trimmed)) {
    return `Email address '${trimmed}' is invalid`
  }
  
  return null
}

/**
 * Normalize email address (lowercase, trim)
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

/**
 * Extract domain from email
 */
export const getEmailDomain = (email: string): string | null => {
  if (!validateEmail(email)) {
    return null
  }
  
  const parts = email.trim().toLowerCase().split('@')
  return parts.length === 2 ? parts[1] : null
}

/**
 * Check if email is from a disposable email provider
 */
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'trashmail.com'
  ]
  
  const domain = getEmailDomain(email)
  if (!domain) {
    return false
  }
  
  return disposableDomains.some(d => domain.includes(d))
}
