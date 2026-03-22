# Design System Reference

## Design Philosophy

- **Mobile-first**: 80-90% of users access from mobile phones
- **App, not website**: No landing pages, no hero banners — straight to the product
- **Tropical Luxury**: Deep ocean blue + golden sand — premium but warm
- **Clarity over decoration**: Every element serves a purpose

## Typography

### Font Stack

| Role | Font | Usage |
|---|---|---|
| Display | Cormorant Garamond (serif) | Headings, prices, brand name |
| Body | Nunito (sans-serif) | Text, labels, buttons, forms |
| Mono | JetBrains Mono | Voucher codes, IDs |

### Usage in Code

```tsx
// Display font (headings, prices)
<h1 className="font-display text-2xl font-bold text-primary">

// Body text (default, no class needed)
<p className="text-sm text-muted-foreground">

// Mono (codes)
<span className="font-mono text-sm">AB3K7M</span>
```

### Size Scale

| Class | Size | Use |
|---|---|---|
| `text-xs` | 0.75rem | Labels, captions |
| `text-sm` | 0.875rem | Body text, descriptions |
| `text-base` | 1rem | Card titles |
| `text-lg` | 1.125rem | Prices, section titles |
| `text-xl` | 1.25rem | Page subtitles |
| `text-2xl` | 1.5rem | Page titles |
| `text-3xl` | 1.875rem | Hero titles (desktop) |

## Color Palette

### Primary Colors

| Token | Hex | HSL | Usage |
|---|---|---|---|
| `primary` | #0C4A6E | 204 80% 24% | Headings, buttons, brand |
| `accent` | #EAB308 | 43 96% 56% | CTAs, highlights, gold accents |
| `sky` | #0EA5E9 | 199 89% 48% | Links, info states |

### Neutral Colors

| Token | Usage |
|---|---|
| `background` | Page background (light cream) |
| `foreground` | Primary text |
| `muted` | Secondary backgrounds |
| `muted-foreground` | Secondary text, descriptions |
| `card` | Card backgrounds |
| `border` | Borders, dividers |

### Status Colors

| State | Color | Usage |
|---|---|---|
| Success | Emerald | Payment confirmed, check-in done |
| Warning | Amber | Pending, low availability |
| Error | Red | Payment failed, validation errors |
| Info | Sky blue | Informational messages |

### Tour Category Colors

| Category | Color | Class Example |
|---|---|---|
| WHALE | Blue #1E40AF | `bg-blue-900/10 text-blue-900` |
| BOAT | Cyan #0891B2 | `bg-cyan-600/10 text-cyan-700` |
| BUGGY | Amber #B45309 | `bg-amber-700/10 text-amber-800` |
| EXPERIENCE | Violet #7C3AED | `bg-violet-600/10 text-violet-700` |

## Component Library

### Cards

```tsx
// Tour card (mobile — horizontal layout)
<div className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
    <Image src={image} alt={name} fill className="object-cover" sizes="96px" />
  </div>
  <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
    <h2 className="font-display text-base font-bold text-primary leading-tight truncate">{name}</h2>
    <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
    <div className="flex items-center justify-between mt-2">
      <span className="font-display text-lg font-bold text-primary">R$ {price}</span>
      <ButtonLink href={`/passeios/${slug}`} size="sm" className="bg-accent text-accent-foreground">
        Reservar
      </ButtonLink>
    </div>
  </div>
</div>
```

### Filter Pills (Horizontal Scroll)

```tsx
<div className="-mx-4 px-4">
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
    {categories.map(cat => (
      <button
        key={cat.value}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
          isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        {cat.label}
      </button>
    ))}
  </div>
</div>
```

### KPI Card

```tsx
<div className="bg-white rounded-2xl p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">{label}</p>
    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
  </div>
  <p className="font-display text-2xl font-bold text-primary mt-2">{value}</p>
  <p className="text-xs text-emerald-600 mt-1">+{change} vs ontem</p>
</div>
```

### Status Badges

```tsx
// Payment status
<Badge variant={status === 'PAID' ? 'default' : 'secondary'}>
  {status === 'PAID' ? 'Confirmado' : 'Pendente'}
</Badge>

// Tour category
<span className={cn(
  'px-2 py-0.5 rounded-full text-xs font-medium',
  CATEGORY_COLORS[category].bg,
  CATEGORY_COLORS[category].text,
)}>
  {category}
</span>
```

## Layout Patterns

### Public Layout (Mobile App Bar)

```
┌──────────────────────────┐
│ 🌊 Corumbau Passeios    │  ← Sticky app bar, backdrop-blur
├──────────────────────────┤
│                          │
│  [Content area]          │  ← bg-muted/30
│                          │
│                          │
└──────────────────────────┘
```

### Admin Layout (Sidebar + Content)

```
┌───────┬──────────────────┐
│       │                  │
│ Side  │  Content         │  ← lg: sidebar visible
│ bar   │                  │     sm: hamburger menu
│       │                  │
│ Dark  │  bg-background   │
│ Navy  │                  │
│       │                  │
└───────┴──────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| Default | 0-767px | Mobile (single column, vertical cards) |
| `md` | 768px+ | Tablet (2-column grid) |
| `lg` | 1024px+ | Desktop (sidebar visible, 3-column grid) |

## Spacing System

| Token | Value | Usage |
|---|---|---|
| `p-3` | 0.75rem | Card padding (compact) |
| `p-4` | 1rem | Page padding, section gaps |
| `p-6` | 1.5rem | Card padding (spacious) |
| `gap-2` | 0.5rem | Between filter pills |
| `gap-4` | 1rem | Between cards (mobile) |
| `gap-5` | 1.25rem | Between cards (desktop) |
| `mb-5` / `mb-6` | Section spacing |

## Border Radius

| Class | Radius | Usage |
|---|---|---|
| `rounded-lg` | 0.5rem | Buttons, inputs |
| `rounded-xl` | 0.75rem | Images, small cards |
| `rounded-2xl` | 1rem | Cards, containers |
| `rounded-full` | 9999px | Pills, avatars, badges |

## Shadows

| Class | Usage |
|---|---|
| `shadow-sm` | Cards at rest |
| `shadow-md` | Cards on hover, elevated elements |
| `shadow-lg` | Modals, floating elements |

## Animation

| Pattern | Implementation |
|---|---|
| Card hover | `hover:shadow-md transition-shadow` |
| Button hover | `hover:bg-amber-500` (accent buttons) |
| Loading | `animate-pulse` on skeleton elements |
| Spinner | `animate-spin` on Loader2 icon |
| Transition | `transition-all` / `transition-colors` |

## Icons (Lucide React)

Primary icons used throughout the project:

| Icon | Context |
|---|---|
| `Waves` | Brand logo |
| `Ship` | Tours/Passeios |
| `QrCode` | Pix payment |
| `CreditCard` | Card payment |
| `Check` / `CheckCircle2` | Success states |
| `Clock` | Pending states |
| `AlertCircle` | Error states |
| `Copy` | Copy to clipboard |
| `ArrowLeft` | Back navigation |
| `Loader2` | Loading spinner |
| `DollarSign` | Revenue |
| `Users` | Passengers |
| `TrendingUp` | Growth metrics |
| `LayoutDashboard` | Dashboard nav |
| `Wallet` | Commissions |
| `BarChart3` | Reports |
| `LogOut` | Sign out |
