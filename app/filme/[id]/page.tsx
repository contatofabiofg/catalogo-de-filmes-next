"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CardSessao } from "@/app/components/CardSessao";
import Script from "next/script";
import { converterMinutosEmHora } from "@/app/services/uteis"
import { IFilme } from "@/app/interfaces/filme";
import { IAtor } from "@/app/interfaces/ator";
import { IGenero } from "@/app/interfaces/genero";
import Image from "next/image";
import Link from 'next/link';
import { api } from "../../services/axios";

export default function Filme() {
  const id = usePathname().split("/")[2];
  const [filme, setFilme] = useState<IFilme>();
  const [atores, setAtores] = useState<IAtor[]>([]);
  const [generos, setGeneros] = useState<IGenero[]>([]);

  useEffect(() => {
    if (id) {
      // Verifique se 'id' está disponível antes de fazer a requisição
      api
        .get("/filme/", {
          params: {
            id: id,
          }
        }
        )
        .then((response) => {
          console.log(response.data);
          setFilme(response.data.filme[0]);
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
        });

      api
        .get(process.env.NEXT_PUBLIC_SERVIDOR + `/atores/filme/${id}`)
        .then((response) => {
          setAtores(response.data.atores);
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
        });

      api
        .get(process.env.NEXT_PUBLIC_SERVIDOR + `/filme/generos/${id}`)
        .then((response) => {
          setGeneros(response.data.generos);
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
        });
    }
  }, [id]); // Adicione 'id' como dependência do useEffect


  return filme ? (
    <div className="p-6 ">
      <Link href={`/`}>
        <button >
          <Image
            src="/voltar.png"
            alt=""
            width={35}
            height={35}
            className="mb-4 hover:brightness-110 duration-100"
          />
        </button>
      </Link>
      <div className="flex flex-col lg:flex-row gap-2 w-100  ">
        <div id="areaCartaz" className="min-w-[300px]">
          <Image
            src={filme.cartaz}
            alt="Cartaz do Filme"
            width={300}
            height={450}
            className="border-bl-4 shadow-yellow-500 m-auto lg:m-none"
          />
        </div>
        <div id="areaInformacoes" className="w-full flex flex-col justify-end">
          <h1 className="border-b-8 border-yellow-500 mb-2 text-[30px]">{filme.titulo}</h1>
          <p>Diretor: {filme.nome_diretor}</p>
          <p>Duração: {converterMinutosEmHora(filme.duracao)}</p>
          <p className="mb-3">Ano: {filme.ano}</p>

          {filme.trailer &&
            <iframe
              width={window.innerWidth > 1000 ? 500 : '100%'}
              height="230"
              src={"https://www.youtube.com/embed/" + filme.trailer.split("v=")[1]?.split("&")[0]}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"

            ></iframe>}
          <Script
            strategy="afterInteractive"
            src="https://www.youtube.com/iframe_api"
          />
        </div>
        <div id="areaInformacoes2" className="w-full flex flex-col items-center lg:items-end">
          <div className=" flex flex-col items-center lg:items-end">
            <div className="flex justify-center items-center relative w-[70px] h-[50px] my-4">
              <Image src="/imdb.png" alt="" width={70} height={50} className="absolute" />
              <p className="text-black text-[22px] font-bold relative mt-5 ">
                {filme.nota_imdb || '-/-'}
              </p>
            </div>
            {generos &&
              generos.length > 0 &&
              generos.map((genero, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-center items-center my-1 w-[150px] px-2 bg-yellow-500 text-black font-bold"
                  >
                    <h3 key={index}>{genero.descricao}</h3>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <CardSessao titulo="Sinopse">{filme.sinopse}</CardSessao>
      {filme.comentario && <CardSessao titulo="Meu comentário">{filme.comentario}</CardSessao>}
      {atores &&
        atores.length > 0 &&
        <CardSessao titulo="Elenco">
          <div className="flex gap-4 flex-wrap">
            {atores &&
              atores.length > 0 &&
              atores.map((ator, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 items-center w-fit bg-zinc-600 p-2 hover:bg-yellow-500 hover:text-black duration-100"
                  >
                    <Image src={ator.foto} alt="" width={130} height={250} />
                    <h3 key={index}>{ator.nome}</h3>
                  </div>
                );
              })}
          </div>
        </CardSessao>
      }
    </div>
  ) : (
    <div></div>
  );
}
