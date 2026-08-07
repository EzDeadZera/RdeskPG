-- Fase 1: autenticação por username
--
-- auth.users (do Supabase Auth) guarda e-mail/senha; profiles guarda o
-- username público e dados de exibição. auth.users nunca é exposta
-- diretamente: as duas funções abaixo são a única ponte controlada entre
-- "username" (público) e "e-mail" (privado).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  nome_exibicao text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Autenticado pode ler qualquer perfil (necessário mais adiante pra listar
-- membros de campanha, ver quem é o mestre etc.)
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Cria o profile automaticamente quando um usuário se cadastra.
-- O username vem de options.data.username no supabase.auth.signUp() do frontend.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lookup controlado username -> e-mail, usado SÓ no momento do login
-- (antes de existir sessão). security definer é o que permite ler
-- auth.users aqui; a função devolve exclusivamente o e-mail, nada mais.
create or replace function public.get_email_for_username(input_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select au.email
  from public.profiles p
  join auth.users au on au.id = p.id
  where p.username = input_username
  limit 1;
$$;

grant execute on function public.get_email_for_username(text) to anon, authenticated;

-- Checagem de disponibilidade de username no formulário de cadastro,
-- sem precisar expor a tabela profiles inteira pro papel anon.
create or replace function public.username_available(check_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where username = check_username);
$$;

grant execute on function public.username_available(text) to anon, authenticated;
