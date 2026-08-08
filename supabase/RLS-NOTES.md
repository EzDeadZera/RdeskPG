# Modelo de permissões (RLS)

Auditoria: as 18 tabelas do schema têm RLS habilitado e pelo menos uma policy — nenhuma tabela fica
bloqueada por padrão nem aberta sem policy.

## Resumo por tipo de dono

| Dono | Tabelas | Regra |
|---|---|---|
| Usuário (perfil) | `profiles` | Autenticado lê todos (nome/avatar são públicos pra outros membros); só edita o próprio |
| Dono da biblioteca | `libraries`, `attributes`, `books`, `equipment_slots` | CRUD completo só pra quem tem `owner_id = auth.uid()` |
| Membro de campanha | `campaigns`, `campaign_members` | Leitura pra quem está em `campaign_members`; escrita (criar campanha, gerenciar membros) só pro mestre |
| Dono do personagem | `characters`, `character_attributes`, `skills`, `spells`, `items`, `item_attribute_modifiers`, `character_equipment` | Jogador dono do personagem tem CRUD; mestre da campanha tem **só leitura** (visualizar fichas) |
| Mestre da campanha | `npcs`, `bestiary`, `maps`, `waypoints` | CRUD exclusivo do mestre; `maps`/`waypoints` também têm leitura liberada pra qualquer membro |

## Funções auxiliares (security definer)

- `is_campaign_member(campaign_id)` / `is_campaign_master(campaign_id)` — checam `campaign_members`, reusadas em quase toda policy que envolve campanha.
- `get_email_for_username` / `username_available` — únicas funções chamadas por usuário **não autenticado** (login e cadastro), por isso devolvem só o mínimo necessário (e-mail; disponibilidade), nunca a tabela `profiles` inteira.

## Limitação conhecida

Se um jogador for removido de `campaign_members`, os personagens que ele já tinha na campanha continuam
visíveis/editáveis por ele (a policy de `characters` também aceita `user_id = auth.uid()` independente da
membership atual). Não implementei cascata de revogação — normalmente aceitável (o personagem "continua
sendo dele"), mas vale saber que existe.
