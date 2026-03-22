/**
 * Generates a 6-character alphanumeric voucher code
 * Uses uppercase letters and numbers for easy reading
 */
export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No I, O, 0, 1 to avoid confusion
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Validates voucher code format
 */
export function isValidVoucherCode(code: string): boolean {
  return /^[A-Z2-9]{6}$/.test(code.toUpperCase())
}
