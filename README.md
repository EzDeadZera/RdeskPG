# RPG Dashboard

Dashboard web para gerenciamento de RPG de Mesa — bibliotecas de sistemas, campanhas, fichas de personagem e mapa interativo.

## Stack

React 19 + Vite + TypeScript · TailwindCSS v4 + shadcn/ui (Radix) · Supabase (banco + auth) · TanStack Query · Zustand · React Hook Form + Zod

## Como rodar

```bash
npm install
cp .env.example .env   # preencha com a URL e a anon key do seu projeto Supabase
npm run dev
```

Sem um `.env` preenchido, o app lança um erro assim que tenta criar o cliente Supabase — isso é intencional, pra pegar o problema cedo.

## Onde as coisas estão

- `src/pages` + `src/layouts` — composição visual das telas e rotas
- `src/features` — lógica de cada domínio (hooks, chamadas ao Supabase, tipos), um módulo por entidade
- `src/components/ui` — componentes shadcn/ui (Button, Card, Input...). Foram montados à mão porque o registry
  `ui.shadcn.com` não é alcançável no sandbox onde este projeto foi gerado — rodando localmente,
  `npx shadcn@latest add <componente>` funciona normalmente e respeita o `components.json` já configurado
- `src/contexts` — Theme e Auth (providers que mudam pouco, no topo da árvore)
- `src/store` — Zustand (estado de UI: sidebar, drawer mobile)
- `src/services/supabase` — cliente Supabase
- `supabase/` — pasta reservada para migrations e seed (Fase 2 em diante)

## Status

Fase 0 (setup) e Fase 1 (autenticação) concluídas: login/cadastro/recuperação de senha reais, por
username (com e-mail resolvido por baixo dos panos via função no Postgres), sign-out funcional e rotas
privadas. Rode a migration em `supabase/migrations/0001_profiles.sql` no seu projeto Supabase antes de
testar. Fase 2 (bibliotecas + atributos configuráveis) é a próxima.
