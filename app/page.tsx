"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { CardFilme } from "./components/CardFilme";
import Select from "react-select";
import { IDiretor } from "./interfaces/diretor";
import { api } from "./services/axios";
import { stylesInputSelect } from "./services/stylesInputSelect";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IReactSelect } from "./interfaces/reactSelect";
import { IAtor } from "./interfaces/ator";
import { IFilme } from "./interfaces/filme";
import { IGenero } from "./interfaces/genero";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [diretores, setDiretores] = useState<IDiretor[] & IReactSelect[]>([]);
  const [atores, setAtores] = useState<IAtor[] & IReactSelect[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [generos, setGeneros] = useState<IGenero[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("todos");
  const [generoSelecionado, setGeneroSelecionado] = useState<
    number | undefined
  >();
  const [offset, setOffset] = useState(0);
  const [buscarMais, setBuscarMais] = useState(false);


  useEffect(() => {
    setFilmes([]);
    setOffset(0);
    setBuscarMais(false);
  }, [tipoSelecionado]);

  function buscarFilmes(dados: IReactSelect, categoria: string) {
    setFilmes([]);
    setLoading(true);

    if (categoria == "diretor") {
      const id_diretor = dados.value;

      api
        .get("/filmes/diretor/" + id_diretor)
        .then((response) => {
          setFilmes(response.data.filmes);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          //console.error("Erro na requisição:", error);
        });
    } else if (categoria == "ator") {
      const id_ator = dados.value;

      api
        .get("/filmes/ator/" + id_ator)
        .then((response) => {
          setFilmes(response.data.filmes);
          setLoading(false);
        })
        .catch(() => {
          //console.error("Erro na requisição:", error);
          setLoading(false);
        });
    }
  }

  const buscarTodosOsFilmes = useCallback(() => {
    setLoading(true);
    api
      .get("/filmes", {
        params: {
          offset: 0,
        },
      })
      .then((response) => {
        setFilmes(response.data.filmes);
        if (response.data.filmes.length === 10) {
          setBuscarMais(true);
          setOffset(10);
        } else {
          setBuscarMais(false);
          setOffset(0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setLoading(false);
      });
  }, []);
  
  const buscarDiretores = useCallback(() => {
    api
      .get("/diretores")
      .then((response) => {
        const diretoresFormatado = response.data.diretores.map(
          (diretor: IDiretor) => {
            return { value: diretor.id_diretor, label: diretor.nome };
          }
        );
        setDiretores(diretoresFormatado);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }, []);
  
  const buscarAtores = useCallback(() => {
    api
      .get("/atores")
      .then((response) => {
        const atoresFormatado = response.data.atores.map((ator: IAtor) => {
          return { value: ator.id_ator, label: ator.nome };
        });
        setAtores(atoresFormatado);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }, []);
  
  const buscarGeneros = useCallback(() => {
    api
      .get("/generos")
      .then((response) => {
        setGeneros(response.data.generos);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }, []);

  function buscarMaisFilmes() {
    api
      .get("/filmes", {
        params: {
          offset: offset,
        },
      })
      .then((response) => {
        const filmesRetorno = response.data.filmes as IFilme[];
        setFilmes((filmes) => [...filmes, ...filmesRetorno]);
        if (response.data.filmes.length == 10) {
          setOffset((offset) => offset + 10);
        } else {
          setBuscarMais(false);
          setOffset(0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setLoading(false);
      });
  }

  function buscarFilmesPeloGenero(id_genero: number) {
    setFilmes([]);
    setLoading(true);
    setGeneroSelecionado(id_genero);
    api
      .get("/filmes/genero/" + id_genero)
      .then((response) => {
        setFilmes(response.data.filmes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setLoading(false);
      });
  }

  useEffect(() => {   
      buscarTodosOsFilmes();
      buscarDiretores();
      buscarAtores();
      buscarGeneros(); 
    
  }, [buscarTodosOsFilmes, buscarDiretores, buscarAtores, buscarGeneros]);
  

  return (
    <div className="m-6 mt-8">
      <div className="flex gap-2 lg:gap-6 mb-6">
        <button
          className={
            "botaoTipoDeBusca " +
            (tipoSelecionado == "todos" ? "!bg-yellow-500 text-black" : "")
          }
          onClick={() => {
            setTipoSelecionado("todos");
            buscarTodosOsFilmes();
          }}
        >
          <p>TODOS OS FILMES</p>
        </button>
        <button
          className={
            "botaoTipoDeBusca " +
            (tipoSelecionado == "diretor" ? "!bg-yellow-500 text-black" : "")
          }
          onClick={() => setTipoSelecionado("diretor")}
        >
          <p>BUSCA POR DIRETOR</p>
        </button>
        <button
          className={
            "botaoTipoDeBusca " +
            (tipoSelecionado == "ator" ? "!bg-yellow-500 text-black" : "")
          }
          onClick={() => setTipoSelecionado("ator")}
        >
          <p>BUSCA POR ATOR</p>
        </button>
        <button
          className={
            "botaoTipoDeBusca " +
            (tipoSelecionado == "genero" ? "!bg-yellow-500 text-black" : "")
          }
          onClick={() => setTipoSelecionado("genero")}
        >
          <p>BUSCA POR GÊNERO</p>
        </button>
      </div>
      <hr className="mb-4" />

      <AnimatePresence mode="wait">
        {tipoSelecionado === "diretor" && (
          <motion.div
            key="diretor"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <Select
              instanceId="selectDiretor"
              placeholder="Selecione o Diretor"
              className="mb-4 meuSelect"
              styles={stylesInputSelect}
              options={diretores}
              onChange={(e) => buscarFilmes(e as IReactSelect, "diretor")}
            />
          </motion.div>
        )}

        {tipoSelecionado === "ator" && (
          <motion.div
            key="ator"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <Select
              instanceId="selectAtor"
              placeholder="Selecione o(a) Ator/Atriz"
              className="mb-4 meuSelect"
              styles={stylesInputSelect}
              options={atores}
              onChange={(e) => buscarFilmes(e as IReactSelect, "ator")}
            />
          </motion.div>
        )}
        {tipoSelecionado === "genero" && (
          <>
            <div className="flex gap-1 lg:gap-4 flex-wrap mb" key="areaGenero">
              {generos.map((genero: IGenero, index) => (
                <button
                  key={`generoBotao${index}`}
                  className={`botaoGenero ${
                    generoSelecionado === genero.id_genero
                      ? "!bg-yellow-500 text-black"
                      : ""
                  }`}
                  onClick={() => buscarFilmesPeloGenero(genero.id_genero)}
                >
                  {genero.descricao}
                </button>
              ))}
            </div>
            <hr className="my-6" />
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-4 flex-wrap">
        {!filmes.length && loading && (
          <SkeletonTheme baseColor="#3f3f46" highlightColor="#656570">
            <Skeleton
              count={5}
              height={270}
              width={window.innerWidth > 1000 ? 170 : 140}
              inline
              className="ml-4 mb-4"
              borderRadius={0}
            />
          </SkeletonTheme>
        )}
        {filmes &&
          filmes.length > 0 &&
          filmes.map((filme, index) => {
            return <CardFilme filme={filme} key={"filme" + index} />;
          })}
      </div>
      {buscarMais && (
        <button className="botaoBuscarMais mt-6" onClick={() => buscarMaisFilmes()}>
          + BUSCAR MAIS
        </button>
      )}
    </div>
  );
}
