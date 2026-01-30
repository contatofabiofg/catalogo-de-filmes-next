import { useRouter } from 'next/navigation'
import { Calendar, Clapperboard } from "lucide-react";
import Link from 'next/link';

export function CardFilme({ filme }) {

    const router = useRouter()

    return (
        <div className="cardFilme">
            <Link href={`/filme/${filme.id_filme}`}>

                <img src={filme.cartaz} alt={"Cartaz do filme"} className='' />
                <p className="mt-2 flex items-start  gap-1 w-full"> <Clapperboard width={14} className='min-w-[14px] -mt-1' /> {filme.titulo}</p>
                <p className="mt-2  w-full">{filme.nome_diretor}</p>
                <p className='flex gap-1 w-full '><Calendar width={14} className='min-w-[14px] -mt-1' /> {filme.ano}</p>
            </Link>
        </div>
    )
}
