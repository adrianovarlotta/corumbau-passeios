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
    // Brand — Deep Ocean + Golden Sand
    brandOcean: '#0C4A6E',
    brandOceanLight: '#E0F2FE',
    brandOceanDark: '#172554',
    brandSky: '#0EA5E9',
    brandGold: '#EAB308',
    brandGoldLight: '#FEF9C3',
    brandGoldDark: '#CA8A04',
    brandSand: '#FDE68A',

    // Semantic
    background: '#F8FAFC',
    foreground: '#172554',
    card: '#FFFFFF',
    cardForeground: '#172554',
    popover: '#FFFFFF',
    popoverForeground: '#172554',
    primary: '#0C4A6E',
    primaryForeground: '#FFFBEB',
    secondary: '#FDE68A',
    secondaryForeground: '#172554',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#EAB308',
    accentForeground: '#172554',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#DBEAFE',
    input: '#DBEAFE',
    ring: '#0C4A6E',
    chart1: '#0C4A6E',
    chart2: '#EAB308',
    chart3: '#2D6A4F',
    chart4: '#FDE68A',
    chart5: '#0EA5E9',

    // Surface
    surface: '#F1F5F9',
    surfaceElevated: '#FFFFFF',
    borderSubtle: '#F1F5F9',

    // Text
    textPrimary: '#172554',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',

    // Status
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#0EA5E9',
    infoLight: '#E0F2FE',

    // Tour Categories
    whale: '#1E40AF',
    boat: '#0891B2',
    buggy: '#B45309',
    experience: '#7C3AED',
  },

  sidebar: {
    background: '#172554',
    foreground: '#E2E8F0',
    primary: '#EAB308',
    primaryForeground: '#172554',
    accent: '#1E3A5F',
    accentForeground: '#FFFBEB',
    border: '#1E3A5F',
    ring: '#EAB308',
  },

  typography: {
    fontDisplay: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
    fontBody: '"Nunito", system-ui, -apple-system, sans-serif',
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
    md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
    card: '0 2px 12px 0 rgb(12 74 110 / 0.06)',
    gold: '0 4px 14px 0 rgb(234 179 8 / 0.25)',
  },
}

// Category colors helper
export const CATEGORY_COLORS = {
  WHALE: { bg: 'bg-blue-900/10', text: 'text-blue-900', border: 'border-blue-900/20', hex: tokens.colors.whale },
  BOAT: { bg: 'bg-cyan-600/10', text: 'text-cyan-700', border: 'border-cyan-600/20', hex: tokens.colors.boat },
  BUGGY: { bg: 'bg-amber-700/10', text: 'text-amber-800', border: 'border-amber-700/20', hex: tokens.colors.buggy },
  EXPERIENCE: { bg: 'bg-violet-600/10', text: 'text-violet-700', border: 'border-violet-600/20', hex: tokens.colors.experience },
} as const
