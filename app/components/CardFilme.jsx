import { useRouter } from 'next/navigation'
import Link from 'next/link';

export function CardFilme({ filme }) {

    const router = useRouter()

    return(
        <div className="cardFilme">
             <Link href={`/filme/${filme.id_filme}`}>
            <img src={filme.cartaz} alt={"Cartaz do filme"}  />
            <h3 className="font-bold mt-2 text-center">{filme.titulo}</h3>
            <h3 className='text-center'>Ano: {filme.ano}</h3>
            </Link>
        </div>
    )
}
