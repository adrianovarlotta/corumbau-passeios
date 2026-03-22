# 📚 Documentação Completa - Corumbau Passeios

**Para:** Dev Senior, AI Assistant em continuação de conversa
**Localização:** `.claude/` folder (leia em Zed, OpenCode, VS Code, etc)
**Status:** Atualizada em 22 de março de 2026

---

## 🗂️ Arquivos de Documentação

### 1. **QUICK_START.md** ← COMECE AQUI
**Tempo de leitura:** 5 minutos
**Para:** Novo dev que quer rodar rápido

- Setup em 3 passos
- Estrutura essencial do projeto
- Comandos úteis
- Troubleshooting

**Quando ler:** Primeira coisa ao entrar no projeto

---

### 2. **PROJECT_CONTEXT.md** ← ENTENDER O PROJETO
**Tempo de leitura:** 15 minutos
**Para:** Entender a visão geral

- Resumo executivo
- Arquitetura completa
- Stack & dependências
- Database schema
- Design system
- Mercado Pago setup
- Próximas tarefas

**Quando ler:** Após rodar localmente, antes de fazer mudanças

---

### 3. **CODE_STANDARDS.md** ← PADRÕES DE CÓDIGO
**Tempo de leitura:** 20 minutos (consulta frequente)
**Para:** Escrever código que fit no projeto

**Seções principais:**
- ✅ Design System (zero hardcoded hex)
- ✅ Componentes React (template, props)
- ✅ API Routes (auth, error handling)
- ✅ Data Fetching (TanStack Query)
- ✅ Zod + Forms
- ✅ Database (Prisma)
- ✅ Authentication (Auth.js)
- ✅ Common Pitfalls

**Quando consultar:** Quando vai escrever código novo

---

### 4. **CONVERSATION_HISTORY.md** ← HISTÓRICO COMPLETO
**Tempo de leitura:** 30 minutos
**Para:** Entender como chegamos até aqui

**Conteúdo:**
- 8 Fases de desenvolvimento
- Requisitos → Soluções
- Bugs resolvidos & aprendizados
- Commits & histórico Git
- Notas para futuro dev
- Próximas ações (prioridade)

**Quando ler:** Quando tem dúvida "por que fazemos X assim?"

---

## 🎯 Roadmap de Leitura

### Cenário 1: Novo Dev Entra no Projeto
```
1. QUICK_START.md (5 min)
   ↓
2. PROJECT_CONTEXT.md (15 min)
   ↓
3. Rodar npm run dev
   ↓
4. Explorar código
   ↓
5. CODE_STANDARDS.md (consultar enquanto código)
```

### Cenário 2: AI Assistant Continua Conversa
```
1. CONVERSATION_HISTORY.md (20 min)
   ↓
2. PROJECT_CONTEXT.md (15 min)
   ↓
3. CODE_STANDARDS.md (consultar quando precisar)
   ↓
4. Ler código relevante
   ↓
5. Implementar feature
```

### Cenário 3: Fixar Bug ou Adicionar Feature
```
1. Reproduzir bug localmente (npm run dev)
   ↓
2. CODE_STANDARDS.md (seção relevante)
   ↓
3. Ler código afetado
   ↓
4. Implementar
   ↓
5. npm run build (verificar)
   ↓
6. git commit + push
```

---

## 📋 Checklist: Antes de Começar

- [ ] Leu QUICK_START.md
- [ ] `npm install` executado
- [ ] `npm run dev` rodando em http://localhost:3000
- [ ] Admin login testado (admin@corumbau.com / admin123)
- [ ] Leu PROJECT_CONTEXT.md
- [ ] Entendeu arquitetura (public/admin/api)
- [ ] Explorou código em `src/app/`, `src/components/`, `src/hooks/`

---

## 🔍 Buscar Tópico Específico

### "Como adiciono um novo passeio?"
→ `CODE_STANDARDS.md` (Database section) + `CONVERSATION_HISTORY.md` (Fase 5)

### "Como funcionam os botões?"
→ `CODE_STANDARDS.md` (Componentes section) + `PROJECT_CONTEXT.md` (Design System)

### "Como é a autenticação?"
→ `CODE_STANDARDS.md` (Authentication section) + `PROJECT_CONTEXT.md` (Auth section)

### "Por que sem `asChild` prop?"
→ `CODE_STANDARDS.md` (Shadcn/ui Components) + `CONVERSATION_HISTORY.md` (Fase 2)

### "Como funciona pagamento?"
→ `PROJECT_CONTEXT.md` (Mercado Pago) + `CONVERSATION_HISTORY.md` (Fase 6)

### "Qual era o bug do gráfico?"
→ `CONVERSATION_HISTORY.md` (Fase 4)

### "Como fazer commit?"
→ `CODE_STANDARDS.md` (Git & Commits section)

---

## 🔧 Estrutura de Arquivos Importantes

```
/
├── .claude/
│   ├── QUICK_START.md              ← Comece aqui
│   ├── PROJECT_CONTEXT.md          ← Overview projeto
│   ├── CODE_STANDARDS.md           ← Padrões de código
│   ├── CONVERSATION_HISTORY.md     ← Histórico completo
│   └── DOCUMENTATION_INDEX.md      ← Este arquivo
│
├── src/
│   ├── app/
│   │   ├── (public)/page.tsx       # Homepage catálogo
│   │   ├── (admin)/admin/          # Dashboard admin
│   │   └── api/                    # API routes
│   ├── components/                 # Componentes React
│   ├── hooks/                      # TanStack Query hooks
│   ├── lib/                        # Utilidades
│   └── app/globals.css             # Design tokens
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Seed script
│
├── design-system/
│   ├── tokens.ts                   # Single source of truth
│   └── utils.ts
│
├── .env.local                      # Variáveis locais
├── .env.example                    # Template
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🚀 Stack Rápido

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.5.14 | Framework |
| React | 19+ | UI |
| TypeScript | strict | Type safety |
| Tailwind | 4 | Styling |
| shadcn/ui | latest | Components |
| Prisma | 6 | ORM |
| Auth.js | 5.x | Auth |
| TanStack Query | latest | Data fetching |
| Recharts | latest | Charts |
| Mercado Pago | latest | Payments |
| Zod | latest | Validation |

---

## 🎯 Próximas Tarefas Imediatas

**Prioridade Alta:**
1. Obter MERCADOPAGO_ACCESS_TOKEN
2. Testar Pix (QR code)
3. Testar Cartão (redirect)
4. Criar páginas de callback pagamento

**Prioridade Média:**
1. Integrar maré real (API Tábua de Marés)
2. Featured tours (admin panel)
3. Página detalhe passeio (desktop fix)
4. Adicionar Aldeia Pará-Cura

---

## 💡 Tips para Dev/AI Futuro

### 1. Design Tokens é Sagrado
Se mudar cor, **SEMPRE** atualize `design-system/tokens.ts` + `npm run tokens`
Nunca hardcode hex.

### 2. Mobile-First
Sempre pense mobile primeiro. Desktop é enhancement, não base.

### 3. Type Safety
TypeScript strict mode. Não ignore erros com `any`.

### 4. Auth Check
Toda API route admin precisa de `session.user.role === 'ADMIN'`

### 5. Teste Localmente Antes de Push
```bash
npm run build    # Simula produção
npm run dev      # Testa feature
git push         # Depois faz push
```

### 6. Mantenha Docs Atualizadas
- Feature nova → Update PROJECT_CONTEXT.md
- Bug resolvido → Update CONVERSATION_HISTORY.md
- Padrão novo → Update CODE_STANDARDS.md

---

## 📞 Quick Debug

| Problema | Comando |
|----------|---------|
| Port em uso | `npx kill-port 3000` |
| .next corrompido | `rm -rf .next && npm run build` |
| Prisma desync | `npx prisma generate && npx prisma migrate dev` |
| Tailwind não atualiza | `npm run tokens` |
| Esquecer env var | Checar `.env.local` + Vercel console |

---

## 📚 Referências Externas

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Prisma:** https://www.prisma.io/docs
- **Auth.js:** https://authjs.dev
- **TanStack Query:** https://tanstack.com/query
- **Mercado Pago API:** https://www.mercadopago.com.br/developers

---

## 🔄 Como Manter Este Índice Atualizado

Quando:
- Novo documento criado → Adicionar aqui com descrição
- Documentação mudou → Update seção relevante
- Status do projeto mudou → Update em PROJECT_CONTEXT.md

---

## ✍️ Versão & Histórico

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 22/03/2026 | Documentação completa criada |

---

## 🎓 Para Começar Agora

1. **Você é novo dev?** → Leia `QUICK_START.md`
2. **Você é AI assistant continuando?** → Leia `CONVERSATION_HISTORY.md` depois `PROJECT_CONTEXT.md`
3. **Vai escrever código?** → Consulte `CODE_STANDARDS.md`
4. **Dúvida específica?** → Use índice "Buscar Tópico Específico" acima

---

**Documentação é Código. Mantenha atualizado! 🚀**
