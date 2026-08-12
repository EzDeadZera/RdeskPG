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

## Bug encontrado e corrigido (migration 0007)

`attributes` e `books` ficaram só com a policy de dono da biblioteca — sem a leitura por membro de
campanha que `libraries` e `equipment_slots` já tinham desde as migrations 0004/0005. Na prática,
qualquer jogador que não fosse o dono da biblioteca via a aba Atributos vazia (mesmo com atributos
configurados) e a seção de modificadores nos itens desaparecia (ela só aparece quando há atributos
carregados). `characters`/`skills`/`items`/`spells` não tinham esse problema — já usavam
`is_campaign_master`/`is_campaign_member` corretamente desde o início.

Testado com Postgres local + stub do schema `auth`, simulando dono e jogador de verdade: confirmei o
bug (0 registros pro jogador), apliquei o fix, confirmei que passou a funcionar, e confirmei que não
abriu acesso indevido (usuário sem vínculo com a campanha continua vendo 0 registros e não consegue
inserir).

## Limitação conhecida

Se um jogador for removido de `campaign_members`, os personagens que ele já tinha na campanha continuam
visíveis/editáveis por ele (a policy de `characters` também aceita `user_id = auth.uid()` independente da
membership atual). Não implementei cascata de revogação — normalmente aceitável (o personagem "continua
sendo dele"), mas vale saber que existe.
