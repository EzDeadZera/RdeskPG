-- Fase 2: bibliotecas e atributos configuráveis

create table public.libraries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  descricao text,
  sistema text,
  livro_base text,
  imagem_url text,
  created_at timestamptz not null default now()
);

alter table public.libraries enable row level security;

create policy "libraries_select_own" on public.libraries
  for select to authenticated using (auth.uid() = owner_id);
create policy "libraries_insert_own" on public.libraries
  for insert to authenticated with check (auth.uid() = owner_id);
create policy "libraries_update_own" on public.libraries
  for update to authenticated using (auth.uid() = owner_id);
create policy "libraries_delete_own" on public.libraries
  for delete to authenticated using (auth.uid() = owner_id);

-- Nota: quando campanhas/membros existirem (Fase 4), member de uma campanha
-- também vai precisar de select na library associada — policy extra entra
-- naquela migration.

create table public.attributes (
  id uuid primary key default gen_random_uuid(),
  library_id uuid not null references public.libraries (id) on delete cascade,
  nome text not null,
  valor_inicial numeric not null default 10,
  valor_min numeric,
  valor_max numeric,
  formula text,
  descricao text,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.attributes enable row level security;

create policy "attributes_all_via_library_owner" on public.attributes
  for all to authenticated
  using (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()));
