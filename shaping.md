---
shaping: true
---

# Corumbau Passeios — Shaping Doc

**Produto:** Plataforma de vendas online + gestão operacional para agência de passeios
**Contexto:** Corumbau/BA, ecoturismo, público de alta renda, sazonalidade forte (temporada Baleia Jubarte jul–nov)
**Hoje:** Vendas 100% via WhatsApp, gestão em planilhas manuais

---

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Turista compra passeio online sem intervenção humana, 24h/dia | Core goal |
| R1 | Gestor centraliza vendas online e offline no mesmo inventário | Core goal |
| R2 | Operador valida embarque via QR Code no pier | Core goal |
| R3.1 | Suporte a Pix (obrigatório no mercado BR) | Must-have |
| R3.2 | Suporte a cartão de crédito | Must-have |
| R4 | Guest checkout — turista compra sem criar conta | Must-have |
| R5 | Voucher entregue por email automaticamente após pagamento confirmado | Must-have |
| R6 | Interface mobile-first, carrega em conexão 3G (< 2s LCP) | Must-have |
| R7 | Validação QR Code funciona offline ou tem fallback manual | Must-have |
| R8 | Gestor pode cancelar um passeio inteiro por data (ex: mau tempo) | Must-have |
| R9 | Comissões calculadas automaticamente por reserva | Must-have |
| R10 | Relatórios de faturamento por período, categoria e forma de pagamento | Nice-to-have |
| R11 | TourDate tem campo de horário (saída manhã/tarde possível) | Must-have |
| R12 | Política de reembolso/crédito configurável por cancelamento | Must-have |
| R13 | Variantes de preço por perfil (adulto / criança) | Must-have |
| R14 | Multi-idioma PT-BR / EN | Out — V2 |

---

## 🔴 Gaps Críticos e Perguntas Sem Resposta

### Q1 — Gateway de Pagamento (Bloqueia F03)

**Problema:** O PRD menciona "Cartão/Pix" mas o Stripe — gateway padrão do boilerplate — **não suporta Pix** no Brasil. Esta é a decisão técnica mais urgente.

**Solução proposta:** **Mercado Pago**
- Pix QR Code nativo + cartão de crédito (até 12x)
- SDK JS/React bem documentado
- Maior reconhecimento de marca entre turistas brasileiros
- Webhook robusto para confirmação de pagamento

**Alternativas:**
| Gateway | Pix | Cartão | UX | Burocracia |
|---------|-----|--------|-----|------------|
| **Mercado Pago** ✅ | ✅ | ✅ | Alta | Baixa |
| Asaas | ✅ | ✅ | Média | Média |
| PagSeguro | ✅ | ✅ | Baixa | Alta |
| Stripe | ❌ | ✅ | Alta | Baixa |

> **Decisão necessária antes de codar F03.** Afeta schema do banco (paymentId), webhook URL e UI do checkout.

---

### Q2 — Entrega do Voucher (F04)

**Problema:** PRD diz "geração automática de QR Code" mas não define como o turista recebe o voucher. Turistas em férias precisam do voucher no celular de forma imediata.

**Solução proposta:**
1. **Email automático** via Resend (já no boilerplate) com voucher em HTML + link de download
2. **Tela de confirmação** no browser com QR Code visível, botão "Baixar PDF" e botão "Compartilhar no WhatsApp" (link `wa.me` — sem API paga)

**Alternativa rejeitada:** WhatsApp Business API — latência de aprovação de 2-7 dias, custo por mensagem, complexidade desnecessária para MVP.

> **Decisão:** Email + tela são suficientes para MVP? Ou o gestor precisa de envio ativo via WhatsApp?

---

### Q3 — Guest Checkout vs. Conta Obrigatória (F03)

**Problema:** Turistas em férias não criam contas. Conta obrigatória é o principal killer de conversão em e-commerce de turismo.

**Análise:**
- Booking.com, Airbnb, GetYourGuide: todos permitem guest checkout
- Corumbau atrai turistas que chegam pelo Instagram ou WhatsApp — não têm paciência para cadastro

**Solução proposta:** **Guest checkout com nome + email + telefone**
- Admin pode ver histórico de reservas filtrando por email
- Sem userId obrigatório no modelo `Booking`
- Sem tela de login no fluxo do turista

> **Impacto no schema:** `Booking.customerId` é nullable. Afeta F06 (lançamento offline também não requer conta).

---

### Q4 — Offline no Check-in (F10)

**Problema:** Pier de embarque em Corumbau tem sinal 3G fraco ou nenhum. Um validador que depende 100% de internet vai travar o embarque no dia mais importante (baleias).

**Solução proposta:** PWA com cache local
- Service Worker cacheia o manifest do dia atual + próximas 48h no IndexedDB do dispositivo do operador
- Validação offline: `voucherCode` é verificado contra a lista local cacheada
- Chekin offline entra em fila e sincroniza quando reconectar
- Banner "Modo offline" visível para o operador

**Alternativa simples (se PWA for complexo demais):** Código alfanumérico curto (6 chars) no voucher. Operador confere visualmente na lista impressa. Scanner continua funcionando online quando possível.

> **Decisão:** Qual o nível mínimo aceitável de offline? PWA completo ou fallback de papel?

---

### Q5 — Cancelamento por Clima (F05/F09)

**Problema:** Passeios marítimos (Baleia Jubarte, Barcos) e Buggy dependem fortemente do clima. Não há mecanismo de cancelamento em massa no PRD. Isso vai acontecer toda semana durante a temporada.

**Solução proposta:** Botão "Cancelar data" na tela de datas do admin:
1. Gestor seleciona data + motivo ("Mau tempo", "Embarcação indisponível", "Outra")
2. Sistema cancela todos os `Booking` da `TourDate`
3. Envia email automático para cada cliente reservado com opções: **Reembolso integral** ou **Crédito para nova data**
4. Status da `TourDate` muda para `CANCELLED`
5. Sistema inicia estorno no gateway (Mercado Pago suporta estorno via API)

> **Decisão crítica:** O sistema processa o estorno automático ou o gestor faz manualmente no painel do gateway? Estorno automático é muito melhor para a experiência, mas requer implementação do endpoint de estorno.

---

### Q6 — Modelo de Comissão (F07)

**Problema:** PRD menciona "comissões para vendedores e barqueiros" mas não define:
- Quem são os "vendedores"? Parceiros externos? Receptivos? Guias?
- Barqueiros são MEI/autônomos que recebem via PIX?
- O sistema emite NF ou só controla o cálculo?

**Solução proposta para MVP:**
- **Operador/Barqueiro:** % fixa configurada por `TourDate` ou por `Tour`. Calculada na criação do Booking. Gestor marca como "pago" manualmente após transferir via Pix.
- **Vendedor externo:** identificado por código de parceiro opcional no checkout. % configurável.
- Sistema **não emite NF** — só controla valores para gestão interna.

> **Decisão:** Há vendedores externos para o MVP ou só barqueiros? Isso define se precisamos de um campo "código de parceiro" no checkout.

---

### Q7 — Variantes de Preço (Adulto/Criança)

**Problema:** Passeios de turismo normalmente têm preço diferente para adultos e crianças. O PRD tem `price` como valor único.

**Análise de impacto:**
- Tour schema: `priceAdult` + `priceChild` (opcional)
- Checkout: seletor separado de adultos e crianças
- Total: `(adults × priceAdult) + (children × priceChild)`
- Crianças < 2 anos podem ser gratuitas

**Solução proposta:** Incluir no MVP. Impacto baixo no schema, alto valor percebido pelo turista.

> **Decisão:** Os passeios atuais têm preço diferenciado por faixa etária?

---

### Q8 — Horário dos Passeios

**Problema:** Um mesmo passeio pode ter saída às 6h (preferida para baleias, luz melhor) e às 13h no mesmo dia. `TourDate` precisa ter campo `time`.

**Solução:** Adicionar `time` ao modelo `TourDate`. Sem impacto no manifest ou no voucher — horário aparece em ambos.

> **Decisão:** Já existe essa necessidade hoje (dois horários por dia)?

---

### Q9 — Número de Pessoas por Reserva

**Problema:** Um grupo de 20 pessoas poderia reservar um barco inteiro de uma vez. Isso é positivo (grande venda) mas o sistema precisa validar disponibilidade em tempo real.

**Solução:** `validateAvailability(tourDateId, quantity)` antes de criar o Booking. Se `quantity > availableSlots`, retorna erro claro: "Apenas X vagas disponíveis para esta data".

> Sem limite arbitrário por reserva — limite é a capacidade real do passeio.

---

## Shapes Propostos

### A: Monolito Next.js Simples (sem offline)
Uma única app Next.js. Check-in depende de internet — fallback é código alfanumérico impresso.

| Part | Mechanism |
|------|-----------|
| A1 | /shop — área pública do turista |
| A2 | /admin — dashboard protegido por Auth.js role=ADMIN |
| A3 | /check — check-in protegido por Auth.js role=OPERATOR |
| A4 | Mercado Pago: Pix + Cartão |
| A5 | Guest checkout (sem conta) |
| A6 | Voucher via email (Resend) + tela de confirmação |
| A7 | Cancelamento de data com notificação em massa |

---

### B: App Split (Loja separada + Admin/Check como PWA)
Loja como app performática isolada. Admin + Check-in como PWA com suporte offline completo.

| Part | Mechanism |
|------|-----------|
| B1 | App loja: Next.js otimizada para conversão |
| B2 | App admin: Next.js com autenticação |
| B3 | PWA check-in: Standalone com IndexedDB + Service Worker |
| B4 | Compartilha API layer e banco (monorepo) |
| B5 | Mercado Pago + Resend |

---

### C: Monolito Next.js + Service Worker no módulo /check ✅ SELECIONADA
Uma única app Next.js com módulo /check tendo comportamento PWA (offline-capable).

| Part | Mechanism |
|------|-----------|
| C1 | /shop — catálogo, detalhe, checkout, pagamento, voucher (guest, sem auth) |
| C2 | /admin — dashboard, tours, datas, offline, comissões, relatórios (role=ADMIN) |
| C3 | /check — manifest, scanner QR (role=OPERATOR) |
| C4 | Check-in online: scanner QR via internet + fallback código alfanumérico impresso + lista visual (sem PWA offline) |
| C5 | Stripe Payment Intents: Pix QR polling + Cartão Elements |
| C6 | Guest checkout: Booking sem userId, identificado por email |
| C7 | Voucher: gerado no backend após webhook de pagamento confirmado, entregue via Resend email + tela |
| C8 | TourDate com campo `time` para múltiplos horários por dia |
| C9 | Cancelamento de data: cancela todos Bookings + email em massa + estorno automático via Stripe Refunds API |
| C10 | Comissões: calculadas na criação do Booking, marcadas como pagas manualmente no admin |
| C11 | Voucher delivery via Resend email + WhatsApp Business Cloud API |
| C12 | Vendedor externo: código de parceiro no checkout, % comissão configurável |

---

## Fit Check

| Req | Requirement | Status | A | B | C |
|-----|-------------|--------|---|---|---|
| R0 | Turista compra passeio online sem intervenção humana, 24h/dia | Core goal | ✅ | ✅ | ✅ |
| R1 | Gestor centraliza vendas online e offline no mesmo inventário | Core goal | ✅ | ✅ | ✅ |
| R2 | Operador valida embarque via QR Code no pier | Core goal | ✅ | ✅ | ✅ |
| R3.1 | Suporte a Pix (obrigatório BR) | Must-have | ✅ | ✅ | ✅ |
| R3.2 | Suporte a cartão de crédito | Must-have | ✅ | ✅ | ✅ |
| R4 | Guest checkout sem criação de conta | Must-have | ✅ | ✅ | ✅ |
| R5 | Voucher entregue por email após pagamento | Must-have | ✅ | ✅ | ✅ |
| R6 | Mobile-first, carrega em 3G | Must-have | ✅ | ✅ | ✅ |
| R7 | Validação QR Code funciona offline ou com fallback | Must-have | ❌ | ✅ | ✅ |
| R8 | Cancelamento em massa por data com notificação | Must-have | ✅ | ✅ | ✅ |
| R9 | Comissões calculadas automaticamente por reserva | Must-have | ✅ | ✅ | ✅ |
| R11 | TourDate com horário | Must-have | ✅ | ✅ | ✅ |

**Notes:**
- A fails R7: check-in depende de internet; pier em Corumbau tem sinal fraco
- B passes all but adds deployment complexity (2 apps, monorepo config, CORS)
- C passes all with single deployment — melhor trade-off para time pequeno
- Shape C with D6=B (no offline PWA) simplifies V9 significantly

**Shape selecionada: C**

---

## Decisões Abertas (Ação necessária)

| # | Decisão | Impacto | Urgência | Resolução |
|---|---------|---------|----------|-----------|
| D1 | Confirmar Mercado Pago como gateway | Bloqueia F03 | 🔴 Alta | ✅ Stripe (suporta Pix via Payment Intents) |
| D2 | Email suficiente para voucher (sem WhatsApp API) | F04 | 🟡 Média | ✅ Email via Resend + WhatsApp Business Cloud API |
| D3 | Estorno automático ou manual no cancelamento de data | C9 | 🔴 Alta | ✅ Estorno automático via Stripe Refunds API |
| D4 | Variantes de preço adulto/criança | Schema Tour | 🟡 Média | ✅ Sim, incluído como Must-have (R13) |
| D5 | Vendedores externos no MVP ou só barqueiros | F07 | 🟡 Média | ✅ Sim, código de parceiro no checkout com % configurável (C12) |
| D6 | Offline PWA completo ou fallback de código impresso | C4 | 🟡 Média | ✅ Sem PWA offline — scanner QR online + fallback código alfanumérico impresso + lista visual |
| D7 | Dois horários por dia são necessários agora | C8, Schema | 🟢 Baixa | ✅ Sim, campo `time` no TourDate mantido |
