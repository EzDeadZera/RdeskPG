# RPG Dashboard

Dashboard web para gerenciamento de RPG de Mesa — bibliotecas de sistemas, campanhas, fichas de
personagem e mapa interativo.

## Stack

React 19 + Vite + TypeScript · TailwindCSS v4 + shadcn/ui (Radix) · Supabase (banco + auth) ·
TanStack Query · Zustand · React Hook Form + Zod · mathjs (motor de fórmulas) · sonner (toasts)

## Como rodar

```bash
npm install
cp .env.example .env   # preencha com a URL e a anon key do seu projeto Supabase
npm run dev
```

Antes de usar, rode as migrations em `supabase/migrations/` **em ordem** (0001 a 0006) no SQL Editor
do seu projeto Supabase — veja `supabase/RLS-NOTES.md` pra entender o modelo de permissões, e
`DEPLOY.md` quando for pra produção.

## Onde as coisas estão

- `src/pages` + `src/layouts` — composição visual das telas e rotas
- `src/features` — lógica de cada domínio (schemas, services, hooks, componentes), um módulo por
  entidade: `auth`, `libraries`, `attributes`, `books`, `campaigns`, `characters`, `skills` (skills e
  magias compartilham a mesma factory), `inventory`, `equipment`, `master`, `maps`
- `src/components/ui` — componentes shadcn/ui, montados à mão (veja nota abaixo) mas com
  `components.json` configurado pro CLI oficial funcionar localmente
- `src/contexts` — Theme e Auth
- `src/store` — Zustand (estado de UI)
- `src/lib/formula-engine.ts` — avaliador seguro de fórmulas (mathjs, nunca `eval()`)
- `supabase/` — migrations, notas de RLS e seed

### Sobre o shadcn/ui
Foi montado componente por componente porque o registry `ui.shadcn.com` é bloqueado no sandbox onde
o projeto foi gerado. Rodando localmente, `npx shadcn@latest add <componente>` funciona normal.

### Erros de mutation
Centralizados: qualquer `useMutation`/query que falhar (RLS negando, rede caindo) aparece como toast
automaticamente (`app/providers/app-providers.tsx`) — não precisa de try/catch em cada formulário.
Os formulários de autenticação são exceção de propósito (erro inline, mais claro pra login/cadastro).

## Status

**Projeto completo, todas as 10 fases do planejamento:**

| Fase | Conteúdo |
|---|---|
| 0 | Setup, tema dark/light, layout, rotas |
| 1 | Login/cadastro/recuperação por username, sign-out |
| 2 | CRUD de bibliotecas + atributos configuráveis com motor de fórmulas |
| 3 | CRUD de livros |
| 4 | CRUD de campanhas, membros (mestre/jogador) por username |
| 5 | Ficha de personagem completa (info, atributos, skills, inventário, equipamentos, magias, anotações) |
| 6 | Painel do mestre (fichas em somente-leitura, NPCs, monstros, bosses) |
| 7 | Mapa interativo com waypoints clicáveis |
| 8 | Auditoria de RLS — todas as 18 tabelas cobertas |
| 9 | Toast de erro centralizado, responsividade dos formulários |
| 10 | Guia de deploy (`DEPLOY.md`) |

## Próximos passos sugeridos (fora do escopo original)
- Upload de imagem de verdade via Supabase Storage (hoje é URL manual)
- Editor de slots de equipamento pela UI (hoje vêm 6 slots padrão, editáveis só direto no banco)
- Testes automatizados
