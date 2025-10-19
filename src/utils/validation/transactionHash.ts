/**
 * Transaction Hash Validation
 * Validates cryptocurrency transaction hashes for different networks
 */

export type CryptoNetwork = 'usdt_trc20' | 'btc' | 'eth' | 'bnb'

interface HashPattern {
  name: string
  network: string
  hashLength: number
  pattern: RegExp
  example: string
}

const HASH_PATTERNS: Record<CryptoNetwork, HashPattern> = {
  usdt_trc20: {
    name: 'USDT (TRC20)',
    network: 'TRC20',
    hashLength: 64,
    pattern: /^[a-fA-F0-9]{64}$/,
    example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
  },
  btc: {
    name: 'Bitcoin',
    network: 'Bitcoin',
    hashLength: 64,
    pattern: /^[a-fA-F0-9]{64}$/,
    example: '1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b'
  },
  eth: {
    name: 'Ethereum',
    network: 'ERC20',
    hashLength: 66,
    pattern: /^0x[a-fA-F0-9]{64}$/,
    example: '0x1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b'
  },
  bnb: {
    name: 'BNB',
    network: 'BEP20',
    hashLength: 66,
    pattern: /^0x[a-fA-F0-9]{64}$/,
    example: '0x1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b'
  }
}

/**
 * Validate transaction hash for a specific network
 */
export const validateTransactionHash = (hash: string, network: CryptoNetwork): boolean => {
  const cleanHash = hash.trim()
  
  if (!cleanHash) {
    return false
  }
  
  const pattern = HASH_PATTERNS[network]
  if (!pattern) {
    console.error(`Unknown network: ${network}`)
    return false
  }
  
  return pattern.pattern.test(cleanHash)
}

/**
 * Get hash pattern info for a network
 */
export const getHashPattern = (network: CryptoNetwork): HashPattern => {
  return HASH_PATTERNS[network]
}

/**
 * Get validation error message
 */
export const getHashValidationError = (network: CryptoNetwork): string => {
  const pattern = HASH_PATTERNS[network]
  return `Invalid ${pattern.name} transaction hash. Must be ${pattern.hashLength} hexadecimal characters${network === 'eth' || network === 'bnb' ? ' starting with 0x' : ''}.`
}

/**
 * Format transaction hash for display (shortened)
 */
export const formatTransactionHash = (hash: string): string => {
  if (hash.length <= 16) {
    return hash
  }
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}
