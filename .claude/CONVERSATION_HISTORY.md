# Histórico Completo da Conversa - Corumbau Passeios

**Período:** Conversa contínua (última atualização: 22 de março de 2026)
**Objetivo:** Documentar todas as decisões, requisitos, testes e mudanças implementadas

---

## 📌 Fase 1: Setup Inicial & Infraestrutura

### Requisitos Iniciais
- Plataforma de vendas online + gestão para agência de passeios
- Stack: Next.js 15, Tailwind CSS 4, shadcn/ui, Prisma, PostgreSQL, Auth.js v5
- Três módulos: booking público, admin dashboard, check-in operador
- Pagamentos: Pix + Cartão de Crédito (inicialmente planejado Stripe, mudado para Mercado Pago)

### Ações Realizadas
✅ Configurar Next.js 15 com TypeScript strict
✅ Instalar shadcn/ui (base-nova style, sem `asChild`)
✅ Conectar PostgreSQL Neon (projeto `icy-shape-45399714`)
✅ Criar schema Prisma e migrations
✅ Seed database: users (admin, operador), 4 tours, tour_dates
✅ Configurar Auth.js v5 com Credentials provider
✅ Setup TanStack Query com QueryProvider
✅ Criar middleware de proteção de rotas
✅ Deploy em Vercel (https://workshop-ia-eight.vercel.app)
✅ Conectar GitHub (https://github.com/adrianovarlotta/corumbau-passeios)

### Erros Enfrentados & Soluções
| Erro | Causa | Solução |
|------|-------|---------|
| Build falha | Conflito de tipos TypeScript | Removidas imports não usadas |
| Conflito peer deps | npm incompatibilidade | Adicionado `.npmrc` com `legacy-peer-deps` |
| CVE-2025-66478 | Next.js 15.2.4 vulnerável | Upgraded para 15.5.14 |
| MODULE_NOT_FOUND | Turbopack cache corrompido | `rm -rf .next/` |
| Duplicate `:root` CSS | shadcn defaults + tokens | Reescrito `globals.css` |

---

## 📌 Fase 2: Design & Redesign

### Requisito Inicial
> "Use a nova skill de /frontend-design pra colocar melhores fontes e melhorar o design / Use as cores azul e amarelo que combinem, seja um UI Senior para escolher"

### Tipografia Escolhida
- **Display:** Cormorant Garamond (headings, elegante)
- **Body:** Nunito (legível, amigável)

### Palete Tropical Luxe
- **Azul Oceano (Primary):** `#0C4A6E` — headings, buttons primários
- **Ouro (Accent):** `#EAB308` — CTAs, highlights
- **Azul Céu (Secondary):** `#0EA5E9` — links
- **Navy Sidebar:** `#172554`

### Arquitetura CSS
- Single source of truth: `design-system/tokens.ts`
- Geração automática: `npm run tokens` → `app/globals.css`
- **ZERO hex hardcoded** — sempre usar classes Tailwind semânticas

### Mudanças Implementadas
✅ Adicionadas fontes Google Fonts (Cormorant Garamond + Nunito)
✅ Reescrito `globals.css` com tokens HSL
✅ Criadas utilities: `.font-display`, `.text-gradient-ocean`, `.bg-ocean-gradient`
✅ Admin sidebar: navy background + amarela accent + Waves icon
✅ Buttons padronizados (primário azul, secundário amarelo)

---

## 📌 Fase 3: Homepage Redesign Mobile-First

### Requisito
> "Não queremos a landing page. Vamos nos ater a ser somente o sistema [...] Vamos trabalhar com mobile first, então 80% 90% dos usuarios vão entrar pelo celular. Já aparecer os passeios disponíveis já na primeira tela."

### Alterações
✅ Removida landing page
✅ Homepage (`/`) mostra catálogo direto
✅ Filtros com pills horizontais (Todos, Baleias, Barcos, Buggy, Vivências)
✅ Cards mobile-first: 96px imagem + nome + descrição + preço + botão
✅ Desktop: grid 2-colunas
✅ Redirect automático: `/passeios` → `/`
✅ Simplificado layout: remover Footer, Navbar → App bar minimalista

### Componentes Criados
- **`TourCard.tsx`:** Card padrão do catálogo
- **`TourDateCard.tsx`:** Card de data específica (featured tours)
- **`CatalogSkeleton.tsx`:** Fallback loading

---

## 📌 Fase 4: Admin Dashboard Modernização

### Requisito
> "Deixe o dashboard mais moderno e clean como você fosse um designer UI/UX senior, e também coloque o gráfico. O gráfico não está aparecendo."

### Análise
- Gráfico original: CSS bars com flex layout → 0 height (bugado)
- Sidebar: cores não definidas, sem visual unificado

### Solução
✅ Reescrito admin dashboard (`src/app/(admin)/admin/page.tsx`):
  - Header com título + data (português)
  - Faturamento grande: "R$ 47.800,00" com background gradient
  - 4 KPI cards: Reservas Hoje, Faturamento Hoje, Taxa Ocupação, Passeios Amanhã
  - AreaChart Recharts com gradient fill (últimos 7 dias)
  - Tabela de 5 últimas reservas

✅ Fixado reports page:
  - Substituído CSS bars por BarChart Recharts
  - Bars com rounded corners e fill primary

✅ Fixado AdminSidebar:
  - Background: `bg-[#172554]` (navy)
  - Active items: `bg-white/15`
  - Logo: Waves icon + "Corumbau Admin"
  - Font: `.font-display` no brand name

---

## 📌 Fase 5: Fotos & Imagens

### Requisito
> "Adicione fotos, as fotos dos passeios estão quebradas"

### Ações
✅ Adicionadas 5 imagens Unsplash em `/public/images/`:
  - `baleia-jubarte.jpg` (baleias)
  - `barco-espelho.jpg` (pôr do sol)
  - `buggy-costa.jpg` (buggy desert)
  - `vivencia-pescadores.jpg` (diving)
  - `aldeia-porto-do-boi.jpg` (Pataxó dança real)

✅ Atualizado `TourCard.tsx` para usar `next/image` Image component
✅ Removidas `<img>` tags (HTML nativo)

---

## 📌 Fase 6: Mercado Pago Integration

### Requisito
> "Quando eu tento reservar por Pix ou Cartão de Crédito, ele não funciona também. Me dê como que a gente faz para conectar ao Sandbox do Mercado Pago."

### Pesquisa & Análise
- Testada API Tábua de Marés (funcionando)
- Pesquisada Mercado Pago API (docs em https://www.mercadopago.com.br/developers)
- Stripe anterior: não funcional, sem integração real

### Implementação
✅ Instalado SDK Mercado Pago: `npm install mercadopago`

✅ Criado `src/lib/mercadopago.ts`:
```typescript
export async function createPixPayment(
  amount: number,
  bookingId: string,
  customerEmail: string,
  customerName: string
): Promise<{ qrCode: string; transactionId: string }>

export async function createCheckoutPreference(
  amount: number,
  bookingId: string,
  tourName: string,
  customerEmail: string,
  customerName: string
): Promise<{ preferenceId: string; initPoint: string }>

export async function getPaymentStatus(paymentId: string)
export async function refundPayment(paymentId: string)
```

### Setup Sandbox (Próximo Passo)
1. Obter Access Token em https://www.mercadopago.com.br/developers
2. Adicionar a `.env.local`: `MERCADOPAGO_ACCESS_TOKEN=APP_xxx`
3. Adicionar em Vercel env vars
4. Testar Pix (QR code) + Cartão (redirect)
5. Criar páginas de callback (`/pagamento/sucesso`, `/pagamento/erro`, `/pagamento/pendente`)

---

## 📌 Fase 7: Maré & Indicadores (Em Desenvolvimento)

### Requisito
> "No header em cima na direita mostre a maré que está(alta/baixa) e se está baixando ou subindo."

### Pesquisa
✅ Encontrada API gratuita: https://tabuamare.devtu.qzz.io
✅ Testada para Corumbau (port mais próximo: Ilhéus ba04)
✅ Response format obtido com sucesso

### Status
- ⏳ API route criada (GET `/api/tides`)
- ⏳ Componente TideIndicator em desenvolvimento
- ⏳ Header integração pendente

### Dados de Teste (22 de março)
```
Porto: PORTO DE ILHÉUS MALHADO
Horários: 05:36 (1.98m), 11:46 (0.19m), 18:01 (1.96m)
Tendência: calculada pela diferença de níveis
```

---

## 📌 Fase 8: UX & UI Refinements

### Requisitos Recentes
> "1- Na home vamos colocar os próximos passeios com datas próximas em evidência [...]
> 2- Nas datas disponíveis deixar as datas e horário com maior destaque, temos que criar um card mais parecido com o que criamos na homepage [...]
> 3- Vamos padronizar todos botões na cor amarela."

### Análise de Problemas
- Homepage: carto muito pequeno para datas
- Detalhe passeio: desktop com imagem estourada
- Botões: inconsistentes em cores

### Soluções Implementadas
✅ Aumentado fontSize indicador maré
✅ Featured tours: cards com destaque maior
✅ Padronização botão amarelo (accent color)
✅ Plano para detalhe passeio: imagem direita, info esquerda no desktop

---

## 🔄 Ciclo de Desenvolvimento

### Workflow Padrão
1. **Requisito** → Documentado como issue
2. **Análise** → Explorar código, DB, APIs
3. **Design** → Wireframes, componentes
4. **Implementação** → Código, testes locais
5. **Verificação** → Build, preview, screenshots
6. **Deploy** → Commit, push, Vercel auto-deploy
7. **Documentação** → Atualizar PROJECT_CONTEXT.md

### Padrões de Código Estabelecidos

#### Componentes
```tsx
// ✅ PADRÃO: client component com hooks
'use client'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary'
}

export function MyComponent({ variant = 'default', className, ...props }: MyComponentProps) {
  return <div className={cn('bg-primary', className)} {...props} />
}
```

#### API Routes
```typescript
// ✅ PADRÃO: type-safe, erro handling
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()
    // ... lógica

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

#### TanStack Query Hooks
```typescript
// ✅ PADRÃO: hooks com retry, staleTime
export function useTours(category?: string) {
  return useQuery({
    queryKey: ['tours', category],
    queryFn: async () => {
      const res = await fetch(`/api/tours?category=${category}`)
      if (!res.ok) throw new Error('Failed to fetch tours')
      return res.json()
    },
    staleTime: 60000,
    retry: 2,
  })
}
```

---

## 📊 Status Atual do Projeto

### ✅ Completo
- Setup Next.js + TypeScript strict
- Design system (tokens, tipografia, cores)
- Database Neon + Prisma + Seed
- Auth.js v5 (login, JWT, roles)
- Homepage mobile-first com filtros
- Admin dashboard com gráficos Recharts
- TanStack Query setup
- Deploy Vercel + GitHub
- Fotos dos passeios

### ⏳ Em Progresso
- Mercado Pago Pix (QR code)
- Mercado Pago Cartão (checkout redirect)
- Maré indicador (API Tábua de Marés)
- Páginas de resultado de pagamento
- Featured tours (admin destaque)

### ❌ Não Iniciado
- Página de detalhe passeio (desktop fix)
- Check-in operador completo
- Sistema de voucher end-to-end
- Notificações WhatsApp
- Relatórios avançados

---

## 🎯 Próximas Ações (Prioridade)

### Curto Prazo (Hoje)
- [ ] Obter MERCADOPAGO_ACCESS_TOKEN
- [ ] Testar pagamento Pix
- [ ] Testar pagamento Cartão
- [ ] Criar páginas de callback

### Médio Prazo (Esta Semana)
- [ ] Integrar maré real
- [ ] Featured tours (admin panel)
- [ ] Página detalhe passeio (desktop layout)
- [ ] Aldeia Pará-Cura (seed + foto)

### Longo Prazo
- [ ] Check-in operador interface
- [ ] Sistema voucher completo
- [ ] Relatórios customizados
- [ ] Email transacional (Resend)
- [ ] WhatsApp API

---

## 💾 Commits & Histórico Git

```bash
# Últimos commits (mais recente primeiro)
2e8db2b chore: update Aldeia Porto do Boi photo with real Pataxó image
47c5f0b feat: Mercado Pago, tide indicator, featured tours, new design
d6c465d feat: redesign UI with Tropical Luxe aesthetic
d7792ba fix: upgrade Next.js to 15.5.14 (CVE-2025-66478 patch)
84e57f5 fix: add .npmrc with legacy-peer-deps for Vercel builds
```

---

## 📝 Notas Para Futuro (Dev Senior + AI)

### Decisões Arquiteturais
1. **Mobile-first:** 80-90% dos usuários no celular — sempre design desktop como enhancement, não como base
2. **Zero hardcoded hex:** Usar `design-system/tokens.ts` como single source of truth
3. **Auth.js v5 com Credentials:** Adequado para admin/operador (não é SaaS multi-tenant)
4. **Mercado Pago sobre Stripe:** Brasil → Pix é native, melhor UX
5. **TanStack Query em client:** Data fetching separado da SSR (permite refresh, updates)

### Padrões a Manter
- Tailwind semântico (bg-primary, text-foreground)
- Componentes em `src/components/`, stories em `stories/`
- API routes RESTful, sem GraphQL
- Prisma migrations versionadas
- TypeScript strict mode sempre
- `next/image` para fotos, nunca HTML `<img>`

### Armadilhas a Evitar
- ❌ Hardcoded hex colors (usar classes Tailwind)
- ❌ `asChild` prop em shadcn base-nova (usar `ButtonLink`)
- ❌ `children: number` em props (usar `childCount`)
- ❌ Componentes sem `'use client'` chamando hooks
- ❌ API routes sem role check para rotas admin
- ❌ Skip `npm run tokens:check` em CI

### Testes & QA
- Dev server: `npm run dev` (porta 3000)
- Build check: `npm run build`
- Storybook: `npm run storybook`
- Database: `npx prisma studio`
- Vercel logs: `vercel logs`

---

## 🤝 Como Usar Este Arquivo

**Este é o diário do projeto.** Ele conecta cada decisão ao seu contexto e resultado:

1. **Novo dev entra?** Leia este arquivo (+ PROJECT_CONTEXT.md)
2. **Precisa resolver bug?** Procure em "Bugs Resolvidos"
3. **Vai fazer feature nova?** Siga o workflow em "Ciclo de Desenvolvimento"
4. **Dúvida em padrão?** Veja "Padrões de Código Estabelecidos"

**Mantenha este arquivo atualizado.** Cada sprint, cada bug, cada decisão → documentado aqui.

---

**Última atualização:** 22 de março de 2026 às ~14:00
**Próxima review:** Quando Mercado Pago estiver 100% funcional
