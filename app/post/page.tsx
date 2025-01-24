"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { stylesInputSelect } from "../services/stylesInputSelect";
import { api } from "../services/axios";
import { IDiretor } from "../interfaces/diretor";
import { useRouter } from "next/navigation";
import { IAtor } from "../interfaces/ator";
import { IReactSelect } from "../interfaces/reactSelect";
import { IGenero } from "../interfaces/genero";
import { IFilme } from "../interfaces/filme";
import Image from "next/image";

export default function Post() {
  const router = useRouter();
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [filmesRaw, setFilmesRaw] = useState<IFilme[]>([]);
  const [filme, setFilme] = useState<Partial<IFilme>>({
    id_filme: undefined,
    titulo: "",
    id_diretor: undefined,
    duracao: undefined,
    ano: undefined,
    nota_imdb: undefined,
    sinopse: "",
    comentario: "",
    trailer: "",
    cartaz: "",
  });
  const [elenco, setElenco] = useState<IAtor[]>([]);
  const [todosOsAtores, setTodosOsAtores] = useState<(IAtor & IReactSelect)[]>(
    []
  );
  const [diretores, setDiretores] = useState<(IDiretor & IReactSelect)[]>([]);
  const [generos, setGeneros] = useState<IGenero[]>([]);
  const [generosSelecionados, setGenerosSelecionados] = useState<
    (IGenero & IReactSelect)[]
  >([]);

  useEffect(() => {
    api.get("/filmes").then((response) => {
      setFilmesRaw(response.data.filmes);
      const filmesFormatado = response.data.filmes.map((filme: IFilme) => {
        return { value: filme.id_filme, label: filme.titulo };
      });

      setFilmes(filmesFormatado);
    });

    api.get("/atores").then((response) => {
      const atoresFormatado = response.data.atores.map((ator: IAtor) => {
        return { value: ator.id_ator, label: ator.nome, ...ator };
      });

      setTodosOsAtores(atoresFormatado);
    });

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

    api.get("/generos").then((response) => {
      const generosFormatado = response.data.generos.map((genero: IGenero) => {
        return { value: genero.id_genero, label: genero.descricao, ...genero };
      });

      setGeneros(generosFormatado);
    });
  }, []);

  function abrirFilmeParaEdicao(filme: IFilme & IReactSelect) {
    const filmeSelecionado = filmesRaw.find((el) => el.id_filme == filme.value);
    if (filmeSelecionado) {
      setFilme(filmeSelecionado);
      buscarElenco(filmeSelecionado.id_filme);
      buscarGeneros(filmeSelecionado.id_filme);
    }
  }

  function buscarElenco(id_filme: number) {
    api
      .get(`/atores/filme/${id_filme}`)
      .then((response) => {
        const atoresRegistrados = response.data.atores.map((ator: IAtor) => {
          ator.registrado = true;
          return ator;
        });
        setElenco(atoresRegistrados);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }

  function buscarGeneros(id_filme: number) {
    api
      .get(`/filme/generos/${id_filme}`)
      .then((response) => {
        const generosRegistrados = response.data.generos.map(
          (genero: IGenero & IReactSelect) => {
            console.log(genero);
            genero.registrado = true;
            genero.label = genero.descricao;
            genero.value = genero.id_genero;
            return genero;
          }
        );
        setGenerosSelecionados(generosRegistrados);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }

  function adicionarAtor(ator: IAtor) {
    if (elenco.findIndex((el) => el.id_ator == ator.id_ator) < 0) {
      setElenco((elenco) => {
        return [...elenco, ator];
      });
    }
  }

  function apagarAtor(ator: IAtor) {
    if (ator.registrado) {
      const userConfirmed = confirm("Deseja apagar esse ator desse filme?");
      if (userConfirmed) {
        api
          .delete(`/filme/ator/`, {
            data: { id_filme: filme.id_filme, id_ator: ator.id_ator },
          })
          .then((response) => {
            alert(response.data.mensagem);
            setElenco((e) => {
              return e.filter((el) => el.id_ator != ator.id_ator);
            });
          })
          .catch((error) => {
            console.error("Erro na requisição:", error);
          });
      } else {
        console.log("Usuário cancelou a ação!");
      }
    } else {
      setElenco((elenco) => {
        return elenco.filter((el) => el.id_ator != ator.id_ator);
      });
    }
  }

  function apagarGenero(generos: IGenero[] & IReactSelect[]) {
    const genero = generosSelecionados.find(
      (elemento) => !generos.some((item) => item.value === elemento.value)
    );

    if (genero && genero.registrado) {
      const userConfirmed = confirm("Deseja apagar esse gênero desse filme?");
      if (userConfirmed) {
        api
          .delete(`/filme/genero/`, {
            data: { id_filme: filme.id_filme, id_genero: genero.id_genero },
          })
          .then((response) => {
            alert(response.data.mensagem);
            setGenerosSelecionados((e) => {
              return e.filter((el) => el.id_genero != genero.id_genero) as (IGenero & IReactSelect)[];
            });
          })
          .catch((error) => {
            console.error("Erro na requisição:", error);
          });
      } else {
        console.log("Usuário cancelou a ação!");
      }
    } else {
      setGenerosSelecionados((e) => {
        return e.filter(
          (el) => el.id_genero != genero?.id_genero  
        );
      });
    }
  }

  function gravar() {
    if (filme.id_filme && filme.id_filme > 0) {
      api
        .put(`/filme`, {
          filme: filme,
          elenco: elenco,
          generos: generosSelecionados,
        })
        .then(() => {
          alert("Registro Atualizado com Sucesso!");
          router.push("/");
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
        });
    } else {
      api
        .post(`/filme`, {
          filme: filme,
          elenco: elenco,
          generos: generosSelecionados,
        })
        .then(() => {
          alert("Registro Incluído com Sucesso!");
          router.push("/");
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
        });
    }
  }

  function novoFilme() {
    setFilme({
      id_filme: undefined,
      titulo: "",
      id_diretor: undefined,
      duracao: undefined,
      ano: undefined,
      nota_imdb: undefined,
      sinopse: "",
      comentario: "",
      trailer: "",
      cartaz: "",
    });
    setElenco([]);
    setGenerosSelecionados([]);
  }

  return (
    <div className="m-6 mt-8">
      <Select
        instanceId="SelectFilme"
        placeholder="Selecione o Filme"
        className="mb-4 meuSelect"
        styles={stylesInputSelect}
        options={filmes}
        onChange={(e) => abrirFilmeParaEdicao(e as IFilme & IReactSelect)}
      />
      {filme.id_filme && (
        <button
          className="bg-yellow-500 text-black px-12 py-1 hover:bg-yellow-400 duration-100 mb-4"
          onClick={novoFilme}
        >
          + NOVO FILME
        </button>
      )}

      <h2>Informações Básicas</h2>
      <hr className="mb-4" />
      <div className="flex gap-2 flex-wrap mb-8 bg-zinc-600">
        <div className="bg-zinc-600 w-fit p-2 opacity-30">
          <div>id_filme</div>
          <input
            className="meuInput"
            disabled
            defaultValue={filme.id_filme} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, id_filme: Number(e.target.value) }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Título</div>
          <input
            className="meuInput"
            defaultValue={filme.titulo} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, titulo: e.target.value }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Diretor</div>
          <Select
            instanceId="SelectDiretor"
            placeholder="Selecione o Diretor"
            className="mb-4 meuSelect"
            styles={stylesInputSelect}
            options={diretores}
            onChange={(e) =>
            {
              const valor = e as IDiretor & IReactSelect
              setFilme((filme) => ({ ...filme, id_diretor: Number(valor.value) }))
            }
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Duração</div>
          <input
            className="meuInput"
            defaultValue={filme.duracao} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, duracao: Number(e.target.value) }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Ano</div>
          <input
            className="meuInput"
            defaultValue={filme.ano} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, ano: Number(e.target.value) }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Nota IMDb</div>
          <input
            className="meuInput"
            defaultValue={filme.nota_imdb} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, nota_imdb: Number(e.target.value) }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Sinopse</div>
          <input
            className="meuInput"
            defaultValue={filme.sinopse} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, sinopse: e.target.value }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Comentário</div>
          <input
            className="meuInput"
            defaultValue={filme.comentario} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, comentario: e.target.value }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Trailer</div>
          <input
            className="meuInput"
            defaultValue={filme.trailer} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, trailer: e.target.value }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Cartaz</div>
          <input
            className="meuInput"
            defaultValue={filme.cartaz} // Valor inicial baseado no objeto
            onChange={(e) =>
              setFilme((filme) => ({ ...filme, cartaz: e.target.value }))
            }
          />
        </div>
        <div className=" w-fit p-2">
          <div>Gêneros</div>
          <Select
            instanceId="SelectGeneros"
            placeholder="Selecione o(s) Gênero(s)"
            isMulti
            value={generosSelecionados}
            className="mb-4 meuSelect"
            styles={stylesInputSelect}
            options={generos as (IGenero & IReactSelect)[]}
            components={{ ClearIndicator: () => null }}
            onChange={(e, tipo) => {
              if (tipo.action == "remove-value") {
                apagarGenero(e as (IGenero & IReactSelect)[]);
              } else {
                setGenerosSelecionados(e as (IGenero & IReactSelect)[]);
              }
            }}
          />
        </div>
      </div>

      <h2>Elenco</h2>
      <hr className="mb-2" />
      <Select
        instanceId="SelectAtor"
        placeholder="Selecione o Ator"
        className="mb-4 meuSelect"
        styles={stylesInputSelect}
        options={todosOsAtores}
        onChange={(e) => adicionarAtor(e as unknown as IAtor)}
      />

      <div className="flex gap-4 flex-wrap">
        {elenco &&
          elenco.length > 0 &&
          elenco.map((ator, index) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-2 items-center w-fit bg-zinc-600 p-2 hover:bg-red-500 hover:text-black duration-100"
                onClick={() => apagarAtor(ator)}
              >
                <Image src={ator.foto} alt="" width={150} />
                <h3 key={index}>{ator.nome}</h3>
              </div>
            );
          })}
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
          className="bg-yellow-500 text-black px-12 py-1 hover:bg-yellow-400 duration-100 "
          onClick={() => gravar()}
        >
          {filme.id_filme ? "ATUALIZAR" : "GRAVAR"}
        </button>
      </div>
    </div>
  );
}
