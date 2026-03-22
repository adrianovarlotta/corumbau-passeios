import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import { tokens } from '../design-system/tokens'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: tokens.colors.background },
        { name: 'surface', value: tokens.colors.surface },
        { name: 'sand', value: tokens.colors.brandSand },
        { name: 'dark', value: tokens.colors.textPrimary },
      ],
    },
  },
}

export default preview
