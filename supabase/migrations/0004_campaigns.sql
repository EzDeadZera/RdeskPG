-- Fase 4: campanhas e membros (jogador/mestre)

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  library_id uuid not null references public.libraries (id) on delete cascade,
  master_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  descricao text,
  imagem_url text,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('jogador', 'mestre')),
  created_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

alter table public.campaign_members enable row level security;

create or replace function public.is_campaign_member(target_campaign_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.campaign_members
    where campaign_id = target_campaign_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_campaign_master(target_campaign_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.campaign_members
    where campaign_id = target_campaign_id and user_id = auth.uid() and role = 'mestre'
  );
$$;

-- Quem cria a campanha vira mestre automaticamente (evita depender de duas
-- chamadas separadas do client, e evita problema de ordem com a RLS).
create or replace function public.handle_new_campaign()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.campaign_members (campaign_id, user_id, role)
  values (new.id, new.master_id, 'mestre');
  return new;
end;
$$;

create trigger on_campaign_created
  after insert on public.campaigns
  for each row execute function public.handle_new_campaign();

create policy "campaigns_select_member" on public.campaigns
  for select to authenticated using (public.is_campaign_member(id));
create policy "campaigns_insert_library_owner" on public.campaigns
  for insert to authenticated with check (
    auth.uid() = master_id
    and exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid())
  );
create policy "campaigns_update_master" on public.campaigns
  for update to authenticated using (public.is_campaign_master(id));
create policy "campaigns_delete_master" on public.campaigns
  for delete to authenticated using (public.is_campaign_master(id));

create policy "campaign_members_select_member" on public.campaign_members
  for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "campaign_members_insert_master" on public.campaign_members
  for insert to authenticated with check (public.is_campaign_master(campaign_id));
create policy "campaign_members_delete_master" on public.campaign_members
  for delete to authenticated using (public.is_campaign_master(campaign_id));

-- Agora que campanha existe: membro de campanha também lê a biblioteca
-- associada (não só o dono da biblioteca).
create policy "libraries_select_campaign_member" on public.libraries
  for select to authenticated using (
    exists (select 1 from public.campaigns c where c.library_id = libraries.id and public.is_campaign_member(c.id))
  );
