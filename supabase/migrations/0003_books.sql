-- Fase 3: livros (referência dentro da biblioteca)

create table public.books (
  id uuid primary key default gen_random_uuid(),
  library_id uuid not null references public.libraries (id) on delete cascade,
  nome text not null,
  autor text,
  descricao text,
  sistema text,
  imagem_capa_url text,
  arquivo_url text,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "books_all_via_library_owner" on public.books
  for all to authenticated
  using (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()));
