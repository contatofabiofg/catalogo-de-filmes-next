import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardFilme } from '../CardFilme'

// Mock do filme para testes
const mockFilme = {
  id_filme: 1,
  titulo: 'Filme Teste',
  cartaz: 'https://example.com/poster.jpg',
  nome_diretor: 'Diretor Teste',
  ano: 2023,
}

describe('CardFilme Component', () => {
  it('deve renderizar as informações do filme corretamente', () => {
    render(<CardFilme filme={mockFilme} />)

    // Verificar se o título do filme está presente
    expect(screen.getByText('Filme Teste')).toBeInTheDocument()

    // Verificar se o nome do diretor está presente
    expect(screen.getByText('Diretor Teste')).toBeInTheDocument()

    // Verificar se o ano está presente
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('deve renderizar a imagem do cartaz com o alt correto', () => {
    render(<CardFilme filme={mockFilme} />)

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockFilme.cartaz)
    expect(image).toHaveAttribute('alt', 'Cartaz do filme')
  })

  it('deve ter um link para a página de detalhes do filme', () => {
    render(<CardFilme filme={mockFilme} />)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/filme/1')
  })

  it('deve renderizar os ícones corretamente', () => {
    render(<CardFilme filme={mockFilme} />)

    // Verificar se os ícones estão presentes (através dos SVGs)
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('deve aplicar as classes CSS corretamente', () => {
    render(<CardFilme filme={mockFilme} />)

    // Verificar se o container principal tem a classe correta
    const cardContainer = screen.getByRole('link').parentElement
    expect(cardContainer).toHaveClass('cardFilme')
  })

  it('deve renderizar informações em estrutura correta', () => {
    render(<CardFilme filme={mockFilme} />)

    // Verificar se o título está com o ícone Clapperboard
    const tituloElement = screen.getByText('Filme Teste')
    expect(tituloElement.previousElementSibling).toBeInTheDocument()

    // Verificar se o ano está com o ícone Calendar
    const anoElement = screen.getByText('2023')
    expect(anoElement.previousElementSibling).toBeInTheDocument()
  })

  it('deve ser um componente acessível', () => {
    render(<CardFilme filme={mockFilme} />)

    // Verificar se a imagem tem alt text descritivo
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Cartaz do filme')

    // Verificar se o link é acessível via teclado
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href')
  })

  it('deve funcionar com diferentes dados de filme', () => {
    const outroFilme = {
      id_filme: 999,
      titulo: 'Outro Filme',
      cartaz: 'https://example.com/outro-poster.jpg',
      nome_diretor: 'Outro Diretor',
      ano: 1999,
    }

    render(<CardFilme filme={outroFilme} />)

    expect(screen.getByText('Outro Filme')).toBeInTheDocument()
    expect(screen.getByText('Outro Diretor')).toBeInTheDocument()
    expect(screen.getByText('1999')).toBeInTheDocument()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/filme/999')

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/outro-poster.jpg')
  })

  it('deve manter a estrutura consistente mesmo com títulos longos', () => {
    const filmeComTituloLongo = {
      ...mockFilme,
      titulo: 'Este é um título muito longo que deve ser tratado corretamente pelo componente',
    }

    render(<CardFilme filme={filmeComTituloLongo} />)

    expect(screen.getByText(filmeComTituloLongo.titulo)).toBeInTheDocument()
    expect(screen.getByText('Diretor Teste')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('deve navegar para página de detalhes ao clicar', async () => {
    const user = userEvent.setup()
    render(<CardFilme filme={mockFilme} />)

    const link = screen.getByRole('link')

    // Verificar se o clique no link funciona (sem quebrar)
    await user.click(link)

    // O link deve ter o href correto
    expect(link).toHaveAttribute('href', '/filme/1')
  })
})