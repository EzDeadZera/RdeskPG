import { listLibraries, createLibrary } from '@/features/libraries/services/library-service'
import { createAttribute } from '@/features/attributes/services/attribute-service'
import { createBook, listBooks } from '@/features/books/services/book-service'
import { createCampaign, listCampaigns } from '@/features/campaigns/services/campaign-service'
import { exampleDndBooks, exampleDndCampaign, exampleLibraries } from '@/features/libraries/data/example-libraries'

// Roda inteiramente através dos services normais do app — ou seja, com a
// sessão de quem clicou no botão. Não precisa de SQL manual nem de saber
// seu user id: o owner_id sai naturalmente de quem está logado.
// Idempotente: pula qualquer biblioteca/livro/campanha cujo nome já exista,
// então pode clicar de novo sem duplicar.
export async function seedExampleLibraries(userId: string): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = []
  const skipped: string[] = []

  const existing = await listLibraries()
  const existingNames = new Set(existing.map((l) => l.nome))

  for (const lib of exampleLibraries) {
    if (existingNames.has(lib.nome)) {
      skipped.push(lib.nome)
      continue
    }

    const library = await createLibrary(
      { nome: lib.nome, descricao: lib.descricao, sistema: lib.sistema, livro_base: lib.livro_base, imagem_url: '' },
      userId,
    )

    for (let i = 0; i < lib.atributos.length; i++) {
      const attr = lib.atributos[i]
      await createAttribute(
        library.id,
        {
          nome: attr.nome,
          valor_inicial: attr.valor_inicial,
          valor_min: attr.valor_min,
          valor_max: attr.valor_max,
          formula: attr.formula ?? '',
          descricao: attr.descricao ?? '',
        },
        i,
      )
    }

    // Livros e campanha teste só existem pra D&D, por enquanto.
    if (lib.nome === 'Dungeons & Dragons') {
      const currentBooks = await listBooks(library.id)
      const bookNames = new Set(currentBooks.map((b) => b.nome))
      for (const book of exampleDndBooks) {
        if (!bookNames.has(book.nome)) {
          await createBook(library.id, { ...book, imagem_capa_url: '', arquivo_url: '' })
        }
      }

      const currentCampaigns = await listCampaigns(library.id)
      if (!currentCampaigns.some((c) => c.nome === exampleDndCampaign.nome)) {
        await createCampaign(library.id, { ...exampleDndCampaign, imagem_url: '' }, userId)
      }
    }

    created.push(lib.nome)
  }

  return { created, skipped }
}
