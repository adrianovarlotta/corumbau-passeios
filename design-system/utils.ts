/**
 * Converts a camelCase token key to a CSS variable name
 * e.g., "cardForeground" → "--card-foreground"
 */
export function tokenKeyToCssVar(key: string): string {
  return '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * Converts a sidebar token key to a CSS variable name
 * e.g., "primary" → "--sidebar-primary"
 */
export function sidebarKeyToCssVar(key: string): string {
  return '--sidebar-' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * Converts hex color to HSL string for Tailwind CSS v4
 */
export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
