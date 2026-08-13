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

Antes de usar, rode as migrations em `supabase/migrations/` **em ordem** (0001 a 0007 — a 0007 corrige
um bug real de permissão, veja `supabase/RLS-NOTES.md`) no SQL Editor
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

## Bibliotecas prontas (Ordem Paranormal, Call of Cthulhu, D&D 5e)

Sem precisar de SQL: logado no app, no Dashboard Principal (mesmo se já tiver bibliotecas), tem um
botão **"Bibliotecas de exemplo"** que cria as três direto pela sua conta — usa os mesmos formulários
que o resto do sistema, então owner_id sai sozinho de quem tá logado. Pode clicar de novo sem medo:
já pula o que já existe (checa pelo nome).

- **Ordem Paranormal** — Força, Agilidade, Intelecto, Presença, Vigor (cada um = dados de d20 rolados),
  Defesa (fórmula `10 + agilidade`), NEX, PV, PE, Sanidade
- **Call of Cthulhu 7ª ed.** — as 9 características em escala percentual, Sanidade (`= poder`),
  Pontos de Magia (`poder/5`) e Pontos de Vida (`floor((constituicao+tamanho)/10)`)
- **Dungeons & Dragons 5e (2024)** — os 6 atributos + os 6 modificadores (`floor((valor-10)/2)`),
  Classe de Armadura, 3 livros e uma campanha teste com você como mestre

`supabase/seed.sql` continua existindo como alternativa via SQL Editor (mesmo conteúdo), pra quem
preferir popular direto no banco sem passar pelo app.

## Validações

Só o essencial pra cada registro existir é obrigatório (nome, título, usuário/senha). Campos de
URL/imagem, descrições e a maioria dos números são opcionais em todo o sistema — a única exceção
proposital é a imagem base de um mapa, que continua obrigatória porque o mapa não funciona sem ela
(mas aceita qualquer texto, não exige mais formato estrito de URL).

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
