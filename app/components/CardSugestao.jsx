
import { Bookmark, Star } from "lucide-react";
import Link from 'next/link';

export function CardSugestao({ filme }) {


    return (
        <div className="cardSugestao">

            <button className='absolute top-3 left-3 bg-yellow-500 text-black font-semibold px-6 py-1 rounded-xl'>SUGESTÃO</button>

            <img src={filme.banner} alt={"Cartaz do filme"} className='w-[50%] min-w-[50%] object-cover' />
            <div className='p-1' >
                <h2 className="mt-2 flex items-start  gap-1 w-full"> {filme.titulo}</h2>
                <p className="mt-2  w-full">{filme.ano}   ●   Duração: {filme.ano} </p>

                <p className="mt-2  w-full">{filme.sinopse.length > 500 ? filme.sinopse.slice(0, 500) + '...' : filme.sinopse}</p>
                <p className='mt-2 flex items-center gap-1'><Star size={13} color=' #eab308' fill='#eab308' ></Star> {filme.estrelas}</p>
                <div className='flex gap-4'>
                    <Link href={`/filme/${filme.id_filme}`} className='cursor-pointer'>
                        <button className='mt-2 cursor-pointer bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg'>VER DETALHES</button>
                    </Link>
                    <button className='mt-2 cursor-pointer botaoTipoDeBusca !w-[220px] text-nowrap text-black font-semibold px-6 py-3 rounded-lg'><Bookmark size={16} /> ADICIONAR AOS FAVORITOS</button>

                </div>


            </div>

        </div >
    )
}
