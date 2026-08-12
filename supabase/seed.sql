-- Seed: Ordem Paranormal + Call of Cthulhu + D&D 5e
--
-- Diferente das migrations numeradas, este script cria dados donos de UM
-- usuário específico (libraries.owner_id é NOT NULL) — por isso não é uma
-- migration de schema, é rodado manualmente por quem já tem conta.
--
-- v_owner já está preenchido com o seu user id (peguei do print que você
-- mandou: select id, owner_id from libraries). Se for rodar numa conta
-- diferente, troque o valor abaixo antes — pra conferir o id de qualquer
-- conta: select id, username from public.profiles;

do $$
declare
  v_owner uuid := '56114bc9-b58d-443a-b4c3-4ce7a5cb42a9';
  v_op_id uuid;
  v_coc_id uuid;
begin

  -- ═══════════════════════════════════════════════════════════════
  -- ORDEM PARANORMAL
  -- 5 atributos (FOR/AGI/INT/PRE/VIG), cada um = quantidade de d20
  -- rolados no teste (não um modificador calculado). Defesa é o único
  -- valor realmente derivado por fórmula simples (10 + Agilidade); os
  -- demais (NEX, PV, PE, SAN) variam por classe/nível e ficam como
  -- valores rastreados manualmente, do jeito que fica numa ficha física.
  -- ═══════════════════════════════════════════════════════════════

  insert into public.libraries (owner_id, nome, descricao, sistema, livro_base)
  values (
    v_owner,
    'Ordem Paranormal',
    'RPG brasileiro de horror urbano. Agentes da Ordem enfrentam o Outro Lado usando um sistema baseado em d20 — cada ponto de atributo é um dado extra rolado no teste.',
    'Ordem Paranormal',
    'Ordem Paranormal RPG — Livro Básico'
  )
  returning id into v_op_id;

  insert into public.attributes (library_id, nome, valor_inicial, valor_min, valor_max, formula, descricao, ordem) values
    (v_op_id, 'Força', 1, -1, 5, null, 'Rola FOR d20 em testes físicos de força bruta.', 0),
    (v_op_id, 'Agilidade', 1, -1, 5, null, 'Rola AGI d20 em testes de destreza, furtividade e reflexos.', 1),
    (v_op_id, 'Intelecto', 1, -1, 5, null, 'Rola INT d20 em testes de conhecimento, investigação e medicina.', 2),
    (v_op_id, 'Presença', 1, -1, 5, null, 'Rola PRE d20 em testes sociais e de vontade.', 3),
    (v_op_id, 'Vigor', 1, -1, 5, null, 'Rola VIG d20 em testes de fortitude e resistência.', 4),
    (v_op_id, 'Defesa', 10, null, null, '10 + agilidade', 'Base 10 + Agilidade, antes de bônus de equipamento.', 5),
    (v_op_id, 'NEX', 5, 5, 99, null, 'Nível de Experiência, em %. Define acesso a poderes e rituais.', 6),
    (v_op_id, 'PV', 0, 0, null, null, 'Pontos de Vida — varia por classe e NEX.', 7),
    (v_op_id, 'PE', 0, 0, null, null, 'Pontos de Esforço — custeiam habilidades e rituais.', 8),
    (v_op_id, 'Sanidade', 20, 0, 20, null, 'Resistência mental a horrores paranormais.', 9);

  -- ═══════════════════════════════════════════════════════════════
  -- CALL OF CTHULHU (7ª edição)
  -- 9 características, cada uma em escala percentual (d100). A maioria
  -- é rolada 3d6×5 (INT/EDU/Tamanho usam 2d6+6×5). Sanidade, Pontos de
  -- Magia e Pontos de Vida são derivados por fórmula de verdade.
  -- ═══════════════════════════════════════════════════════════════

  insert into public.libraries (owner_id, nome, descricao, sistema, livro_base)
  values (
    v_owner,
    'Call of Cthulhu',
    'RPG de horror cósmico de Lovecraft. Investigadores comuns enfrentam o desconhecido usando um sistema percentual (d100) — cada característica é a própria chance de sucesso.',
    'Call of Cthulhu 7ª Edição',
    'Call of Cthulhu — Investigator Handbook'
  )
  returning id into v_coc_id;

  insert into public.attributes (library_id, nome, valor_inicial, valor_min, valor_max, formula, descricao, ordem) values
    (v_coc_id, 'Força', 50, 15, 90, null, 'STR — potência física, contribui pro dano corpo a corpo.', 0),
    (v_coc_id, 'Constituição', 50, 15, 90, null, 'CON — saúde e resistência a doenças/venenos.', 1),
    (v_coc_id, 'Tamanho', 65, 40, 90, null, 'SIZ — altura e peso combinados.', 2),
    (v_coc_id, 'Destreza', 50, 15, 90, null, 'DEX — agilidade física e velocidade de reação.', 3),
    (v_coc_id, 'Aparência', 50, 15, 90, null, 'APP — apelo físico e presença social.', 4),
    (v_coc_id, 'Inteligência', 65, 40, 90, null, 'INT — raciocínio e capacidade de dedução.', 5),
    (v_coc_id, 'Poder', 50, 15, 90, null, 'POW — força de vontade e afinidade com o sobrenatural.', 6),
    (v_coc_id, 'Educação', 65, 40, 90, null, 'EDU — conhecimento formal acumulado.', 7),
    (v_coc_id, 'Sorte', 50, 15, 90, null, 'Luck — reserva pra forçar rolagens a seu favor.', 8),
    (v_coc_id, 'Sanidade', 50, 0, 99, 'poder', 'Começa igual ao Poder; cai com exposição aos Mitos.', 9),
    (v_coc_id, 'Pontos de Magia', 10, 0, null, 'poder/5', 'POW ÷ 5.', 10),
    (v_coc_id, 'Pontos de Vida', 11, 0, null, 'floor((constituicao+tamanho)/10)', '(CON + SIZ) ÷ 10, arredondado pra baixo.', 11);

end $$;

-- ═══════════════════════════════════════════════════════════════════
-- DUNGEONS & DRAGONS 5e (revisão 2024)
-- 6 atributos brutos + 6 modificadores calculados (fórmula real do livro:
-- (valor - 10) ÷ 2, arredondado pra baixo) + Classe de Armadura (10 +
-- mod. Destreza, base sem armadura) — mais 3 livros e uma campanha teste
-- já com você como mestre.
-- ═══════════════════════════════════════════════════════════════════

do $$
declare
  v_owner uuid := '56114bc9-b58d-443a-b4c3-4ce7a5cb42a9';
  v_dnd_id uuid;
  v_campaign_id uuid;
begin

  insert into public.libraries (owner_id, nome, descricao, sistema, livro_base)
  values (
    v_owner,
    'Dungeons & Dragons',
    'O RPG de fantasia mais jogado do mundo. Seis atributos definem tudo — cada um gera um modificador que se soma a praticamente toda rolagem de d20.',
    'D&D 5e (revisão 2024)',
    'Player''s Handbook (2024)'
  )
  returning id into v_dnd_id;

  insert into public.attributes (library_id, nome, valor_inicial, valor_min, valor_max, formula, descricao, ordem) values
    (v_dnd_id, 'Força', 10, 1, 30, null, 'STR — poder físico bruto.', 0),
    (v_dnd_id, 'Destreza', 10, 1, 30, null, 'DEX — agilidade, reflexos e pontaria.', 1),
    (v_dnd_id, 'Constituição', 10, 1, 30, null, 'CON — resistência física e pontos de vida.', 2),
    (v_dnd_id, 'Inteligência', 10, 1, 30, null, 'INT — raciocínio e memória.', 3),
    (v_dnd_id, 'Sabedoria', 10, 1, 30, null, 'WIS — percepção e força de vontade.', 4),
    (v_dnd_id, 'Carisma', 10, 1, 30, null, 'CHA — força de personalidade.', 5),
    (v_dnd_id, 'Modificador de Força', 0, null, null, 'floor((forca-10)/2)', '(Força − 10) ÷ 2, arredondado pra baixo.', 6),
    (v_dnd_id, 'Modificador de Destreza', 0, null, null, 'floor((destreza-10)/2)', '(Destreza − 10) ÷ 2, arredondado pra baixo.', 7),
    (v_dnd_id, 'Modificador de Constituição', 0, null, null, 'floor((constituicao-10)/2)', '(Constituição − 10) ÷ 2, arredondado pra baixo.', 8),
    (v_dnd_id, 'Modificador de Inteligência', 0, null, null, 'floor((inteligencia-10)/2)', '(Inteligência − 10) ÷ 2, arredondado pra baixo.', 9),
    (v_dnd_id, 'Modificador de Sabedoria', 0, null, null, 'floor((sabedoria-10)/2)', '(Sabedoria − 10) ÷ 2, arredondado pra baixo.', 10),
    (v_dnd_id, 'Modificador de Carisma', 0, null, null, 'floor((carisma-10)/2)', '(Carisma − 10) ÷ 2, arredondado pra baixo.', 11),
    (v_dnd_id, 'Classe de Armadura', 10, 0, null, '10 + floor((destreza-10)/2)', 'Base sem armadura: 10 + mod. Destreza. Some equipamento manualmente.', 12),
    (v_dnd_id, 'Pontos de Vida', 0, 0, null, null, 'Varia por classe, nível e Constituição — acompanhe manualmente.', 13);

  insert into public.books (library_id, nome, autor, descricao, sistema, imagem_capa_url) values
    (v_dnd_id, 'Player''s Handbook (2024)', 'Wizards of the Coast', 'Livro do jogador: criação de personagem, classes, perícias, equipamentos e magias.', 'D&D 5e (2024)', null),
    (v_dnd_id, 'Dungeon Master''s Guide (2024)', 'Wizards of the Coast', 'Guia do mestre: construção de mundo, recompensas, itens mágicos e conselhos de condução de mesa.', 'D&D 5e (2024)', null),
    (v_dnd_id, 'Monster Manual (2024)', 'Wizards of the Coast', 'Manual dos monstros: mais de 500 criaturas com estatísticas completas.', 'D&D 5e (2024)', null);

  insert into public.campaigns (library_id, master_id, nome, descricao)
  values (
    v_dnd_id,
    v_owner,
    'Campanha Teste — D&D',
    'Campanha de exemplo pra testar o fluxo completo: crie um personagem, confira os modificadores calculando sozinhos, e experimente o mapa interativo.'
  )
  returning id into v_campaign_id;
  -- o trigger on_campaign_created já te adiciona como mestre automaticamente

end $$;

