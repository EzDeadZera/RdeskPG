-- Fix: attributes e books ficaram só com policy de dono da biblioteca,
-- sem a leitura por membro de campanha que libraries e equipment_slots já
-- tinham. Isso quebrava a aba Atributos (e, por consequência, a seção de
-- modificadores nos itens) pra qualquer jogador que não fosse dono da
-- biblioteca.

create policy "attributes_select_campaign_member" on public.attributes
  for select to authenticated using (
    exists (
      select 1 from public.campaigns c
      where c.library_id = attributes.library_id and public.is_campaign_member(c.id)
    )
  );

create policy "books_select_campaign_member" on public.books
  for select to authenticated using (
    exists (
      select 1 from public.campaigns c
      where c.library_id = books.library_id and public.is_campaign_member(c.id)
    )
  );
