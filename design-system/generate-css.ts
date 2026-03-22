import * as fs from 'fs'
import * as path from 'path'
import { tokens } from './tokens'
import { tokenKeyToCssVar, sidebarKeyToCssVar, hexToHsl } from './utils'

const START_MARKER = '/* === GENERATED TOKENS START === */'
const END_MARKER = '/* === GENERATED TOKENS END === */'

function generateRootBlock(): string {
  const lines: string[] = []
  lines.push('  :root {')

  // Colors as HSL
  const semanticColors = ['background', 'foreground', 'card', 'cardForeground', 'popover', 'popoverForeground',
    'primary', 'primaryForeground', 'secondary', 'secondaryForeground', 'muted', 'mutedForeground',
    'accent', 'accentForeground', 'destructive', 'destructiveForeground', 'border', 'input', 'ring',
    'chart1', 'chart2', 'chart3', 'chart4', 'chart5']

  for (const key of semanticColors) {
    const value = tokens.colors[key]
    if (value) {
      lines.push(`    ${tokenKeyToCssVar(key)}: ${hexToHsl(value)};`)
    }
  }

  lines.push('')
  lines.push('    /* Sidebar */')
  for (const [key, value] of Object.entries(tokens.sidebar)) {
    lines.push(`    ${sidebarKeyToCssVar(key)}: ${hexToHsl(value)};`)
  }

  lines.push('')
  lines.push('    /* Radius */')
  lines.push(`    --radius: ${tokens.radius.lg};`)

  lines.push('  }')
  return lines.join('\n')
}

function main() {
  const cssPath = path.resolve(__dirname, '../src/app/globals.css')
  let css = fs.readFileSync(cssPath, 'utf-8')

  const startIdx = css.indexOf(START_MARKER)
  const endIdx = css.indexOf(END_MARKER)

  const generated = `${START_MARKER}\n${generateRootBlock()}\n${END_MARKER}`

  if (startIdx !== -1 && endIdx !== -1) {
    css = css.slice(0, startIdx) + generated + css.slice(endIdx + END_MARKER.length)
  } else {
    // Insert after @import statements
    const lastImportIdx = css.lastIndexOf('@import')
    if (lastImportIdx !== -1) {
      const lineEnd = css.indexOf('\n', lastImportIdx)
      css = css.slice(0, lineEnd + 1) + '\n' + generated + '\n' + css.slice(lineEnd + 1)
    } else {
      css = generated + '\n' + css
    }
  }

  if (process.argv.includes('--check')) {
    const currentCss = fs.readFileSync(cssPath, 'utf-8')
    if (currentCss !== css) {
      console.error('globals.css is out of sync with tokens.ts. Run `npm run tokens` to fix.')
      process.exit(1)
    }
    console.log('✅ globals.css is in sync with tokens.ts')
    process.exit(0)
  }

  fs.writeFileSync(cssPath, css)
  console.log('✅ Generated CSS tokens in globals.css')
}

main()
