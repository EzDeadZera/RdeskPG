-- Fase 5: ficha de personagem completa

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  classe text,
  raca text,
  nivel integer,
  historia text,
  idade text,
  aparencia text,
  retrato_url text,
  anotacoes text,
  created_at timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "characters_select_owner_or_master" on public.characters
  for select to authenticated
  using (auth.uid() = user_id or public.is_campaign_master(campaign_id));
create policy "characters_insert_own" on public.characters
  for insert to authenticated
  with check (auth.uid() = user_id and public.is_campaign_member(campaign_id));
create policy "characters_update_own" on public.characters
  for update to authenticated using (auth.uid() = user_id);
create policy "characters_delete_own" on public.characters
  for delete to authenticated using (auth.uid() = user_id);

-- valor: valor base/bruto do atributo pro personagem (usado como escopo nas
-- fórmulas de OUTROS atributos). valor_manual: se preenchido, sobrescreve o
-- valor efetivo mostrado (mesmo quando o atributo tem fórmula) — é o
-- "editar manualmente quando permitido" do enunciado.
create table public.character_attributes (
  character_id uuid not null references public.characters (id) on delete cascade,
  attribute_id uuid not null references public.attributes (id) on delete cascade,
  valor numeric not null default 0,
  valor_manual numeric,
  primary key (character_id, attribute_id)
);

alter table public.character_attributes enable row level security;

create policy "character_attributes_select" on public.character_attributes
  for select to authenticated using (
    exists (
      select 1 from public.characters c
      where c.id = character_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))
    )
  );
create policy "character_attributes_write_own" on public.character_attributes
  for all to authenticated
  using (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()));

-- Skills, itens e magias seguem o mesmo padrão de policy (dono do
-- personagem edita; dono OU mestre da campanha enxerga).
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  nome text not null,
  tipo text,
  descricao text,
  imagem_url text,
  dano text,
  custo text,
  efeitos text,
  observacoes text,
  created_at timestamptz not null default now()
);
alter table public.skills enable row level security;

create table public.spells (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  nome text not null,
  tipo text,
  descricao text,
  imagem_url text,
  dano text,
  custo text,
  efeitos text,
  observacoes text,
  created_at timestamptz not null default now()
);
alter table public.spells enable row level security;

create table public.items (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  nome text not null,
  categoria text,
  quantidade numeric not null default 1,
  peso numeric,
  valor numeric,
  descricao text,
  imagem_url text,
  created_at timestamptz not null default now()
);
alter table public.items enable row level security;

create table public.item_attribute_modifiers (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  attribute_id uuid not null references public.attributes (id) on delete cascade,
  modificador numeric not null
);
alter table public.item_attribute_modifiers enable row level security;

create table public.equipment_slots (
  id uuid primary key default gen_random_uuid(),
  library_id uuid not null references public.libraries (id) on delete cascade,
  nome text not null,
  ordem integer not null default 0
);
alter table public.equipment_slots enable row level security;

create table public.character_equipment (
  character_id uuid not null references public.characters (id) on delete cascade,
  slot_id uuid not null references public.equipment_slots (id) on delete cascade,
  item_id uuid references public.items (id) on delete set null,
  primary key (character_id, slot_id)
);
alter table public.character_equipment enable row level security;

-- Cria os 6 slots de equipamento padrão do enunciado quando uma biblioteca
-- é criada. O dono pode renomear/adicionar depois direto no banco (editor
-- de slots na UI fica pra uma próxima iteração).
create or replace function public.seed_default_equipment_slots()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.equipment_slots (library_id, nome, ordem) values
    (new.id, 'Arma Principal', 0),
    (new.id, 'Arma Secundária', 1),
    (new.id, 'Capacete', 2),
    (new.id, 'Armadura', 3),
    (new.id, 'Botas', 4),
    (new.id, 'Acessórios', 5);
  return new;
end;
$$;

create trigger on_library_created_seed_slots
  after insert on public.libraries
  for each row execute function public.seed_default_equipment_slots();

-- Policies: dono do personagem tem CRUD; mestre da campanha só lê.
-- skills
create policy "skills_select" on public.skills for select to authenticated using (
  exists (select 1 from public.characters c where c.id = character_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))));
create policy "skills_write_own" on public.skills for all to authenticated
  using (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()));

-- spells
create policy "spells_select" on public.spells for select to authenticated using (
  exists (select 1 from public.characters c where c.id = character_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))));
create policy "spells_write_own" on public.spells for all to authenticated
  using (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()));

-- items
create policy "items_select" on public.items for select to authenticated using (
  exists (select 1 from public.characters c where c.id = character_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))));
create policy "items_write_own" on public.items for all to authenticated
  using (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()));

-- item_attribute_modifiers (segue o dono do item)
create policy "item_modifiers_select" on public.item_attribute_modifiers for select to authenticated using (
  exists (
    select 1 from public.items i join public.characters c on c.id = i.character_id
    where i.id = item_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))
  ));
create policy "item_modifiers_write_own" on public.item_attribute_modifiers for all to authenticated
  using (exists (select 1 from public.items i join public.characters c on c.id = i.character_id where i.id = item_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.items i join public.characters c on c.id = i.character_id where i.id = item_id and c.user_id = auth.uid()));

-- equipment_slots (segue o dono da biblioteca; qualquer membro de campanha lê)
create policy "equipment_slots_select" on public.equipment_slots for select to authenticated using (
  exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid())
  or exists (select 1 from public.campaigns c where c.library_id = equipment_slots.library_id and public.is_campaign_member(c.id))
);
create policy "equipment_slots_write_owner" on public.equipment_slots for all to authenticated
  using (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from public.libraries l where l.id = library_id and l.owner_id = auth.uid()));

-- character_equipment
create policy "character_equipment_select" on public.character_equipment for select to authenticated using (
  exists (select 1 from public.characters c where c.id = character_id and (c.user_id = auth.uid() or public.is_campaign_master(c.campaign_id))));
create policy "character_equipment_write_own" on public.character_equipment for all to authenticated
  using (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.characters c where c.id = character_id and c.user_id = auth.uid()));

-- Semeia character_attributes (valor = valor_inicial da biblioteca) assim
-- que um personagem é criado, pra sempre existir uma linha por atributo.
create or replace function public.seed_character_attributes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.character_attributes (character_id, attribute_id, valor)
  select new.id, a.id, a.valor_inicial
  from public.attributes a
  join public.campaigns c on c.library_id = a.library_id
  where c.id = new.campaign_id;
  return new;
end;
$$;

create trigger on_character_created_seed_attributes
  after insert on public.characters
  for each row execute function public.seed_character_attributes();
