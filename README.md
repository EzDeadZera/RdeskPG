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

## Bibliotecas prontas (seed)

`supabase/seed.sql` cria três bibliotecas completas, já com o seu user id preenchido:
- **Ordem Paranormal** — Força, Agilidade, Intelecto, Presença, Vigor (cada um = dados de d20 rolados),
  Defesa (fórmula `10 + agilidade`), NEX, PV, PE, Sanidade
- **Call of Cthulhu 7ª ed.** — as 9 características (STR/CON/SIZ/DEX/APP/INT/POW/EDU/Sorte) em escala
  percentual, Sanidade (`= poder`), Pontos de Magia (`poder/5`) e Pontos de Vida
  (`floor((constituicao+tamanho)/10)`) já calculados por fórmula
- **Dungeons & Dragons 5e (2024)** — os 6 atributos + os 6 modificadores calculados pela fórmula real
  do livro (`floor((valor-10)/2)`), Classe de Armadura (`10 + mod. Destreza`), 3 livros (Player's
  Handbook, Dungeon Master's Guide, Monster Manual) e uma campanha teste já com você como mestre

Como esses registros pertencem a um usuário (`owner_id`), confira o comentário no topo do arquivo —
o valor já está preenchido com o id que apareceu no seu print, mas vale conferir se bate com a conta
que você quer usar.

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
