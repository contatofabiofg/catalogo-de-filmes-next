// Mock da API antes de tudo
jest.mock('../services/axios', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))




import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Home from '../page'
import { api } from '../services/axios'

// Mock dos dados
const mockFilmes = [
  {
    id_filme: 1,
    titulo: 'Filme Teste 1',
    cartaz: 'https://example.com/poster1.jpg',
    nome_diretor: 'Diretor Teste 1',
    ano: 2023,
  },
  {
    id_filme: 2,
    titulo: 'Filme Teste 2',
    cartaz: 'https://example.com/poster2.jpg',
    nome_diretor: 'Diretor Teste 2',
    ano: 2022,
  },
]

const mockDiretores = [
  { id_diretor: 1, nome: 'Diretor Teste 1' },
  { id_diretor: 2, nome: 'Diretor Teste 2' },
]

const mockAtores = [
  { id_ator: 1, nome: 'Ator Teste 1' },
  { id_ator: 2, nome: 'Ator Teste 2' },
]

const mockGeneros = [
  { id_genero: 1, descricao: 'Ação' },
  { id_genero: 2, descricao: 'Comédia' },
]

describe('Home Page', () => {
  const mockApiGet = api.get as jest.MockedFunction<typeof api.get>

  beforeEach(() => {
    jest.clearAllMocks()
    mockApiGet.mockImplementation((url, config) => {

      if (url === '/filmes/' || url === '/filmes') {
        console.log('Mocked API GET /filmes called with params:', config?.params);

        // Retornar filmes diferentes baseado no tipo de chamada
        if (config?.params?.call === 'getFilmesPorGenero') {
          // Filmes do gênero 1 (Ação)
          return Promise.resolve({
            data: {
              filmes: [
                {
                  id_filme: 3,
                  titulo: 'Filme Ação 1',
                  cartaz: 'https://example.com/action1.jpg',
                  nome_diretor: 'Diretor Ação',
                  ano: 2023,
                }
              ]
            },
          })
        }

        // Chamada padrão (getAllFilmes)
        return Promise.resolve({
          data: { filmes: mockFilmes },
        })
      }

      if (url === '/diretores') {
        return Promise.resolve({
          data: { diretores: mockDiretores },
        })
      }
      if (url === '/atores') {
        return Promise.resolve({
          data: { atores: mockAtores },
        })
      }
      if (url === '/generos') {
        return Promise.resolve({
          data: { generos: mockGeneros },
        })
      }
      return Promise.reject(new Error('URL não encontrada'))
    })
  })

  it('deve renderizar a página inicial com todos os elementos', async () => {
    render(<Home />)

    // Verificar botões de filtro
    expect(screen.getByText('TODOS OS FILMES')).toBeInTheDocument()
    expect(screen.getByText('BUSCA POR DIRETOR')).toBeInTheDocument()
    expect(screen.getByText('BUSCA POR ATOR')).toBeInTheDocument()
    expect(screen.getByText('BUSCA POR GÊNERO')).toBeInTheDocument()

    // Aguardar carregamento dos filmes
    await waitFor(() => {
      expect(screen.getByText('Filme Teste 1')).toBeInTheDocument()
      expect(screen.getByText('Filme Teste 2')).toBeInTheDocument()
    })
  })

  it('deve carregar filmes ao montar o componente', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/filmes/', {
        params: { call: 'getAllFilmes', offset: 0 },
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Filme Teste 1')).toBeInTheDocument()
    })
  })

  it('deve exibir skeletons durante o carregamento', () => {
    mockApiGet.mockImplementation(() => new Promise(() => { })) // Mock de requisição pendente

    render(<Home />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve alternar entre tipos de busca', async () => {
    const user = userEvent.setup()
    render(<Home />)

    // Botão "Todos os filmes" deve estar ativo por padrão
    const todosButton = screen.getByText('TODOS OS FILMES')
    expect(todosButton.closest('button')).toHaveClass('!bg-yellow-500')

    // Clicar em "Busca por diretor"
    const diretorButton = screen.getByText('BUSCA POR DIRETOR')
    await user.click(diretorButton)

    // Verificar se o select de diretor aparece
    await waitFor(() => {
      expect(screen.getByTestId('react-select')).toBeInTheDocument()
      expect(screen.getByText('Selecione o Diretor')).toBeInTheDocument()
    })
  })

  it('deve mostrar select de atores quando buscar por ator', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const atorButton = screen.getByText('BUSCA POR ATOR')
    await user.click(atorButton)

    await waitFor(() => {
      expect(screen.getByTestId('react-select')).toBeInTheDocument()
      expect(screen.getByText('Selecione o(a) Ator/Atriz')).toBeInTheDocument()
    })
  })

  it('deve mostrar botões de gênero quando buscar por gênero', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const generoButton = screen.getByText('BUSCA POR GÊNERO')
    await user.click(generoButton)

    await waitFor(() => {
      expect(screen.getByText('Ação')).toBeInTheDocument()
      expect(screen.getByText('Comédia')).toBeInTheDocument()
    })
  })

  it('deve buscar filmes por diretor', async () => {
    const user = userEvent.setup()
    render(<Home />)

    // Mudar para busca por diretor
    const diretorButton = screen.getByText('BUSCA POR DIRETOR')
    await user.click(diretorButton)

    // Aguardar o select aparecer
    await waitFor(() => {
      expect(screen.getByTestId('react-select')).toBeInTheDocument()
    })

    // Selecionar um diretor
    const select = screen.getByTestId('react-select')
    await user.selectOptions(select, '1')

    // Verificar se a API foi chamada corretamente
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenLastCalledWith('/filmes/', {
        params: { call: 'getFilmesPorDiretor', id: 1 },
      })
    })
  })

  it('deve buscar filmes por gênero', async () => {
    const user = userEvent.setup()
    render(<Home />)

    // limpa chamadas feitas no mount
    mockApiGet.mockClear()

    // Mudar para busca por gênero
    const generoButton = screen.getByText('BUSCA POR GÊNERO')

    await user.click(generoButton)

    // Aguardar botões de gênero aparecerem
    await waitFor(() => {
      expect(screen.getByText('Ação')).toBeInTheDocument()
    })

    // Clicar no botão de gênero "Ação"
    const acaoButton = screen.getByText('Ação')
    await user.click(acaoButton)

    // Verificar se a API foi chamada corretamente
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenLastCalledWith('/filmes/', {
        params: { call: 'getFilmesPorGenero', id: 1 },
      })
    })
  })

  it('deve resetar filmes quando mudar tipo de busca', async () => {
    const user = userEvent.setup()
    render(<Home />)

    // Aguardar filmes carregarem
    await waitFor(() => {
      expect(screen.getByText('Filme Teste 1')).toBeInTheDocument()
    })

    // Mudar para busca por diretor
    const diretorButton = screen.getByText('BUSCA POR DIRETOR')
    await user.click(diretorButton)

    // Verificar se os filmes foram removidos (lista vazia)
    await waitFor(() => {
      expect(screen.queryByText('Filme Teste 1')).not.toBeInTheDocument()
    })
  })

  it('deve mostrar botão "buscar mais" quando houver mais filmes', async () => {
    // Mock com 10 filmes para ativar o botão "buscar mais"
    const dezFilmes = Array.from({ length: 10 }, (_, i) => ({
      id_filme: i + 1,
      titulo: `Filme ${i + 1}`,
      cartaz: `https://example.com/poster${i + 1}.jpg`,
      nome_diretor: `Diretor ${i + 1}`,
      ano: 2023 - i,
    }))

    mockApiGet.mockImplementation((url) => {
      if (url === '/filmes/') {
        return Promise.resolve({
          data: { filmes: dezFilmes },
        })
      }
      return Promise.resolve({
        data: { diretores: mockDiretores, atores: mockAtores, generos: mockGeneros },
      })
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('+ BUSCAR MAIS')).toBeInTheDocument()
    })
  })

  it('deve carregar mais filmes ao clicar no botão "buscar mais"', async () => {
    const user = userEvent.setup()

    // Mock inicial com 10 filmes
    const dezFilmes = Array.from({ length: 10 }, (_, i) => ({
      id_filme: i + 1,
      titulo: `Filme ${i + 1}`,
      cartaz: `https://example.com/poster${i + 1}.jpg`,
      nome_diretor: `Diretor ${i + 1}`,
      ano: 2023 - i,
    }))

    // Mock para buscar mais filmes
    const maisFilmes = Array.from({ length: 5 }, (_, i) => ({
      id_filme: i + 11,
      titulo: `Filme ${i + 11}`,
      cartaz: `https://example.com/poster${i + 11}.jpg`,
      nome_diretor: `Diretor ${i + 11}`,
      ano: 2023 - i,
    }))

    mockApiGet.mockImplementation((url, config) => {
      console.log(url)
      if (url === '/filmes/') {
        const offset = config?.params?.offset || 0

        if (offset === 0) {
          console.log('Returning first 10 filmes');
          return Promise.resolve({ data: { filmes: dezFilmes } })
        } else if (offset === 10) {

          return Promise.resolve({ data: { filmes: maisFilmes } })
        }
      }

      return Promise.resolve({
        data: { filmes: dezFilmes },
      })
    })

    render(<Home />)

    // Aguardar botão "buscar mais" aparecer
    await waitFor(() => {
      expect(screen.getByText('+ BUSCAR MAIS')).toBeInTheDocument()
    })

    // Clicar no botão "buscar mais"
    const buscarMaisButton = screen.getByText('+ BUSCAR MAIS')
    await user.click(buscarMaisButton)

    // Verificar se a API foi chamada com offset correto
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/filmes', {
        params: { call: 'getAllFilmes', offset: 10 },
      })
    })
  })

  it('deve tratar erros na requisição da API', async () => {
    // Mock de erro na API
    mockApiGet.mockRejectedValue(new Error('Erro de API'))

    render(<Home />)

    // Aguardar tentativa de requisição
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled()
    })

    // Verificar que não há filmes na tela
    expect(screen.queryByText('Filme Teste 1')).not.toBeInTheDocument()
  })
})