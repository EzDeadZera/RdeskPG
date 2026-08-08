-- Fase 6: painel do mestre (NPCs, monstros, bosses)
-- Fase 7: mapa interativo

create table public.npcs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  nome text not null,
  descricao text,
  atributos jsonb not null default '{}'::jsonb,
  imagem_url text,
  created_at timestamptz not null default now()
);
alter table public.npcs enable row level security;

create table public.bestiary (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  tipo text not null check (tipo in ('monstro', 'boss')),
  nome text not null,
  descricao text,
  atributos jsonb not null default '{}'::jsonb,
  imagem_url text,
  created_at timestamptz not null default now()
);
alter table public.bestiary enable row level security;

-- Só o mestre da campanha vê e edita — são registros pessoais dele.
create policy "npcs_all_master" on public.npcs for all to authenticated
  using (public.is_campaign_master(campaign_id)) with check (public.is_campaign_master(campaign_id));
create policy "bestiary_all_master" on public.bestiary for all to authenticated
  using (public.is_campaign_master(campaign_id)) with check (public.is_campaign_master(campaign_id));

create table public.maps (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  nome text not null,
  imagem_url text not null,
  created_at timestamptz not null default now()
);
alter table public.maps enable row level security;

create table public.waypoints (
  id uuid primary key default gen_random_uuid(),
  map_id uuid not null references public.maps (id) on delete cascade,
  pos_x numeric not null,
  pos_y numeric not null,
  titulo text not null,
  descricao text,
  icone text,
  cor text,
  imagem_url text,
  created_at timestamptz not null default now()
);
alter table public.waypoints enable row level security;

-- Mapas: qualquer membro vê; só o mestre cria/edita/remove.
create policy "maps_select_member" on public.maps for select to authenticated
  using (public.is_campaign_member(campaign_id));
create policy "maps_write_master" on public.maps for all to authenticated
  using (public.is_campaign_master(campaign_id)) with check (public.is_campaign_master(campaign_id));

-- Waypoints: mesma regra, via o mapa.
create policy "waypoints_select_member" on public.waypoints for select to authenticated using (
  exists (select 1 from public.maps m where m.id = map_id and public.is_campaign_member(m.campaign_id)));
create policy "waypoints_write_master" on public.waypoints for all to authenticated
  using (exists (select 1 from public.maps m where m.id = map_id and public.is_campaign_master(m.campaign_id)))
  with check (exists (select 1 from public.maps m where m.id = map_id and public.is_campaign_master(m.campaign_id)));
