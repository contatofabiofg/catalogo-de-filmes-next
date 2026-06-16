import { useRouter } from 'next/navigation'
import { Calendar, Clapperboard, Star } from "lucide-react";
import Link from 'next/link';

export function CardFilme({ filme }) {

    const router = useRouter()

    return (
        <div className="cardFilme">
            <Link href={`/filme/${filme.id_filme}`}>

                <img src={filme.cartaz} alt={"Cartaz do filme"} className='' />
                <div className='p-1' >
                    <p className="mt-2 flex items-start  gap-1 w-full"> {filme.titulo}</p>
                    <p className='mt-2 flex items-center gap-1'><Star size={13} color=' #eab308' fill='#eab308' ></Star> {filme.estrelas}</p>
                    <p className="mt-2  w-full">{filme.nome_diretor}</p>
                    <p className='flex gap-1 w-full '><Calendar width={13} className='min-w-[14px] -mt-1' /> {filme.ano}</p>
                </div>
            </Link >
        </div >
    )
}
