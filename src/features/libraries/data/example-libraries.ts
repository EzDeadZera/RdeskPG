// Dados das bibliotecas de exemplo — mesmo conteúdo do supabase/seed.sql,
// só que aplicado através dos services normais do app (logado como o
// próprio usuário), em vez de SQL manual. Ver seed-example-libraries.ts.

export interface ExampleAttribute {
  nome: string
  valor_inicial: number
  valor_min?: number
  valor_max?: number
  formula?: string
  descricao?: string
}

export interface ExampleLibrary {
  nome: string
  descricao: string
  sistema: string
  livro_base: string
  atributos: ExampleAttribute[]
}

export const exampleLibraries: ExampleLibrary[] = [
  {
    nome: 'Ordem Paranormal',
    descricao:
      'RPG brasileiro de horror urbano. Agentes da Ordem enfrentam o Outro Lado usando um sistema baseado em d20 — cada ponto de atributo é um dado extra rolado no teste.',
    sistema: 'Ordem Paranormal',
    livro_base: 'Ordem Paranormal RPG — Livro Básico',
    atributos: [
      { nome: 'Força', valor_inicial: 1, valor_min: -1, valor_max: 5, descricao: 'Rola FOR d20 em testes físicos de força bruta.' },
      { nome: 'Agilidade', valor_inicial: 1, valor_min: -1, valor_max: 5, descricao: 'Rola AGI d20 em testes de destreza, furtividade e reflexos.' },
      { nome: 'Intelecto', valor_inicial: 1, valor_min: -1, valor_max: 5, descricao: 'Rola INT d20 em testes de conhecimento, investigação e medicina.' },
      { nome: 'Presença', valor_inicial: 1, valor_min: -1, valor_max: 5, descricao: 'Rola PRE d20 em testes sociais e de vontade.' },
      { nome: 'Vigor', valor_inicial: 1, valor_min: -1, valor_max: 5, descricao: 'Rola VIG d20 em testes de fortitude e resistência.' },
      { nome: 'Defesa', valor_inicial: 10, formula: '10 + agilidade', descricao: 'Base 10 + Agilidade, antes de bônus de equipamento.' },
      { nome: 'NEX', valor_inicial: 5, valor_min: 5, valor_max: 99, descricao: 'Nível de Experiência, em %. Define acesso a poderes e rituais.' },
      { nome: 'PV', valor_inicial: 0, valor_min: 0, descricao: 'Pontos de Vida — varia por classe e NEX.' },
      { nome: 'PE', valor_inicial: 0, valor_min: 0, descricao: 'Pontos de Esforço — custeiam habilidades e rituais.' },
      { nome: 'Sanidade', valor_inicial: 20, valor_min: 0, valor_max: 20, descricao: 'Resistência mental a horrores paranormais.' },
    ],
  },
  {
    nome: 'Call of Cthulhu',
    descricao:
      'RPG de horror cósmico de Lovecraft. Investigadores comuns enfrentam o desconhecido usando um sistema percentual (d100) — cada característica é a própria chance de sucesso.',
    sistema: 'Call of Cthulhu 7ª Edição',
    livro_base: 'Call of Cthulhu — Investigator Handbook',
    atributos: [
      { nome: 'Força', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'STR — potência física, contribui pro dano corpo a corpo.' },
      { nome: 'Constituição', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'CON — saúde e resistência a doenças/venenos.' },
      { nome: 'Tamanho', valor_inicial: 65, valor_min: 40, valor_max: 90, descricao: 'SIZ — altura e peso combinados.' },
      { nome: 'Destreza', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'DEX — agilidade física e velocidade de reação.' },
      { nome: 'Aparência', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'APP — apelo físico e presença social.' },
      { nome: 'Inteligência', valor_inicial: 65, valor_min: 40, valor_max: 90, descricao: 'INT — raciocínio e capacidade de dedução.' },
      { nome: 'Poder', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'POW — força de vontade e afinidade com o sobrenatural.' },
      { nome: 'Educação', valor_inicial: 65, valor_min: 40, valor_max: 90, descricao: 'EDU — conhecimento formal acumulado.' },
      { nome: 'Sorte', valor_inicial: 50, valor_min: 15, valor_max: 90, descricao: 'Luck — reserva pra forçar rolagens a seu favor.' },
      { nome: 'Sanidade', valor_inicial: 50, valor_min: 0, valor_max: 99, formula: 'poder', descricao: 'Começa igual ao Poder; cai com exposição aos Mitos.' },
      { nome: 'Pontos de Magia', valor_inicial: 10, valor_min: 0, formula: 'poder/5', descricao: 'POW ÷ 5.' },
      { nome: 'Pontos de Vida', valor_inicial: 11, valor_min: 0, formula: 'floor((constituicao+tamanho)/10)', descricao: '(CON + SIZ) ÷ 10, arredondado pra baixo.' },
    ],
  },
  {
    nome: 'Dungeons & Dragons',
    descricao:
      'O RPG de fantasia mais jogado do mundo. Seis atributos definem tudo — cada um gera um modificador que se soma a praticamente toda rolagem de d20.',
    sistema: 'D&D 5e (revisão 2024)',
    livro_base: "Player's Handbook (2024)",
    atributos: [
      { nome: 'Força', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'STR — poder físico bruto.' },
      { nome: 'Destreza', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'DEX — agilidade, reflexos e pontaria.' },
      { nome: 'Constituição', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'CON — resistência física e pontos de vida.' },
      { nome: 'Inteligência', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'INT — raciocínio e memória.' },
      { nome: 'Sabedoria', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'WIS — percepção e força de vontade.' },
      { nome: 'Carisma', valor_inicial: 10, valor_min: 1, valor_max: 30, descricao: 'CHA — força de personalidade.' },
      { nome: 'Modificador de Força', valor_inicial: 0, formula: 'floor((forca-10)/2)', descricao: '(Força − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Modificador de Destreza', valor_inicial: 0, formula: 'floor((destreza-10)/2)', descricao: '(Destreza − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Modificador de Constituição', valor_inicial: 0, formula: 'floor((constituicao-10)/2)', descricao: '(Constituição − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Modificador de Inteligência', valor_inicial: 0, formula: 'floor((inteligencia-10)/2)', descricao: '(Inteligência − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Modificador de Sabedoria', valor_inicial: 0, formula: 'floor((sabedoria-10)/2)', descricao: '(Sabedoria − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Modificador de Carisma', valor_inicial: 0, formula: 'floor((carisma-10)/2)', descricao: '(Carisma − 10) ÷ 2, arredondado pra baixo.' },
      { nome: 'Classe de Armadura', valor_inicial: 10, valor_min: 0, formula: '10 + floor((destreza-10)/2)', descricao: 'Base sem armadura: 10 + mod. Destreza. Some equipamento manualmente.' },
      { nome: 'Pontos de Vida', valor_inicial: 0, valor_min: 0, descricao: 'Varia por classe, nível e Constituição — acompanhe manualmente.' },
    ],
  },
]

export const exampleDndBooks = [
  { nome: "Player's Handbook (2024)", autor: 'Wizards of the Coast', descricao: 'Livro do jogador: criação de personagem, classes, perícias, equipamentos e magias.', sistema: 'D&D 5e (2024)' },
  { nome: "Dungeon Master's Guide (2024)", autor: 'Wizards of the Coast', descricao: 'Guia do mestre: construção de mundo, recompensas, itens mágicos e conselhos de condução de mesa.', sistema: 'D&D 5e (2024)' },
  { nome: 'Monster Manual (2024)', autor: 'Wizards of the Coast', descricao: 'Manual dos monstros: mais de 500 criaturas com estatísticas completas.', sistema: 'D&D 5e (2024)' },
]

export const exampleDndCampaign = {
  nome: 'Campanha Teste — D&D',
  descricao: 'Campanha de exemplo pra testar o fluxo completo: crie um personagem, confira os modificadores calculando sozinhos, e experimente o mapa interativo.',
}
