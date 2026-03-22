export interface DesignTokens {
  colors: Record<string, string>
  typography: Record<string, string>
  spacing: Record<string, string>
  radius: Record<string, string>
  shadows: Record<string, string>
  sidebar: Record<string, string>
}

export const tokens: DesignTokens = {
  colors: {
    // Brand
    brandOcean: '#0B6E8E',
    brandOceanLight: '#E8F4F8',
    brandOceanDark: '#084E66',
    brandSand: '#F5E6C8',
    brandCoral: '#E8643C',
    brandForest: '#2D6A4F',

    // Semantic
    background: '#FFFFFF',
    foreground: '#1A2332',
    card: '#FFFFFF',
    cardForeground: '#1A2332',
    popover: '#FFFFFF',
    popoverForeground: '#1A2332',
    primary: '#0B6E8E',
    primaryForeground: '#FFFFFF',
    secondary: '#F5E6C8',
    secondaryForeground: '#1A2332',
    muted: '#F8F9FA',
    mutedForeground: '#94A3B8',
    accent: '#E8643C',
    accentForeground: '#FFFFFF',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#0B6E8E',
    chart1: '#0B6E8E',
    chart2: '#E8643C',
    chart3: '#2D6A4F',
    chart4: '#F5E6C8',
    chart5: '#1E40AF',

    // Surface
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    borderSubtle: '#F1F5F9',

    // Text
    textPrimary: '#1A2332',
    textSecondary: '#4A5568',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // Status
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Tour Categories
    whale: '#1E40AF',
    boat: '#0891B2',
    buggy: '#B45309',
    experience: '#7C3AED',
  },

  sidebar: {
    background: '#084E66',
    foreground: '#E8F4F8',
    primary: '#FFFFFF',
    primaryForeground: '#084E66',
    accent: '#0B6E8E',
    accentForeground: '#FFFFFF',
    border: '#0B6E8E',
    ring: '#E8F4F8',
  },

  typography: {
    fontDisplay: '"Playfair Display", Georgia, serif',
    fontBody: '"Inter", system-ui, -apple-system, sans-serif',
    fontMono: '"JetBrains Mono", "Fira Code", monospace',

    sizeXs: '0.75rem',
    sizeSm: '0.875rem',
    sizeMd: '1rem',
    sizeLg: '1.125rem',
    sizeXl: '1.25rem',
    size2xl: '1.5rem',
    size3xl: '1.875rem',
    size4xl: '2.25rem',
    size5xl: '3rem',

    weightNormal: '400',
    weightMedium: '500',
    weightSemibold: '600',
    weightBold: '700',

    lineHeightTight: '1.25',
    lineHeightNormal: '1.5',
    lineHeightRelaxed: '1.75',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    card: '0 2px 8px 0 rgb(11 110 142 / 0.08)',
  },
}

// Category colors helper
export const CATEGORY_COLORS = {
  WHALE: { bg: 'bg-blue-900/10', text: 'text-blue-900', border: 'border-blue-900/20', hex: tokens.colors.whale },
  BOAT: { bg: 'bg-cyan-600/10', text: 'text-cyan-700', border: 'border-cyan-600/20', hex: tokens.colors.boat },
  BUGGY: { bg: 'bg-amber-700/10', text: 'text-amber-800', border: 'border-amber-700/20', hex: tokens.colors.buggy },
  EXPERIENCE: { bg: 'bg-violet-600/10', text: 'text-violet-700', border: 'border-violet-600/20', hex: tokens.colors.experience },
} as const
