# Deploy

## 1. Supabase (backend)

1. Crie um projeto em supabase.com.
2. No SQL Editor, rode as migrations de `supabase/migrations/` **em ordem** (0001 → 0006).
3. Em Authentication → URL Configuration, defina o **Site URL** e adicione a **Redirect URL** de
   produção terminando em `/redefinir-senha` (é pra onde o link de recuperação de senha aponta —
   veja `requestPasswordReset` em `features/auth/services/auth-service.ts`).
4. Em Project Settings → API, copie a **Project URL** e a **anon public key**.

## 2. Variáveis de ambiente

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Configure as duas na plataforma de hospedagem escolhida (nunca commite o `.env` real).

## 3. Frontend

Build de produção:
```bash
npm run build
```
Gera `dist/` — arquivos estáticos, sem servidor Node necessário.

**Vercel**: importe o repositório, framework preset "Vite", build command `npm run build`, output
`dist`. Adicione as variáveis de ambiente do passo 2.

**Netlify**: build command `npm run build`, publish directory `dist`. Como as rotas são todas
client-side (React Router), adicione um redirect catch-all pra `index.html`:
```
# public/_redirects
/*  /index.html  200
```

## 4. Checklist final antes de divulgar

- [ ] Migrations 0001-0006 rodadas no projeto de produção
- [ ] Redirect URL de recuperação de senha aponta pro domínio de produção (não localhost)
- [ ] Variáveis de ambiente configuradas na hospedagem
- [ ] Testar o fluxo completo uma vez: cadastro → confirmação de e-mail → login → criar biblioteca →
      criar campanha → criar personagem → equipar item → criar mapa e um waypoint
- [ ] Testar como um segundo usuário (jogador) adicionado à campanha, confirmando que ele não
      acessa o painel do mestre nem edita fichas de terceiros
