import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Clapperboard, Code, Heart, House, Search, Tags, Users } from "lucide-react";
import { Input } from "@/components/ui/input"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu Catálogo de Filmes",
  description: "Dois em um: um projeto de desenvolvimento e a minha estante de filmes favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const ativo = "inicio";


  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >

        <div className="w-25 h-screen fixed flex flex-col justify-between absolute bg-[#0c0f15] border-r border-[#24272d] z-50">
          <div className="mt-[120px]">
            <button
              className={`flex flex-col items-center justify-center gap-2 h-20 w-full transition-all duration-200
          ${ativo === "inicio"
                  ? "text-yellow-400 border-l-3 border-yellow-400"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <House size={22} strokeWidth={2} />
              <span className="text-sm">Início</span>
            </button>



            <button
              className={`flex flex-col items-center justify-center gap-2 h-20 w-full transition-all duration-200
          ${ativo === "generos"
                  ? "text-yellow-400 border-l-3 border-yellow-400"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <Code size={22} strokeWidth={2} />
              <span className="text-sm">Tecnologias</span>
            </button>

            <button
              className={`flex flex-col items-center justify-center gap-2 h-20 w-full transition-all duration-200
          ${ativo === "favoritos"
                  ? "text-yellow-400 border-l-3 border-yellow-400"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <Heart size={22} strokeWidth={2} />
              <span className="text-sm">Favoritos</span>
            </button>
          </div>
          <div className="text-center text-[11px] text-slate-200 mb-6">
            <p>{new Date().getFullYear()}</p>
            <p>v1.0.0</p>
          </div>
        </div>
        <div className="w-full pl-[120px] bg-[#14161b] border-b border-[#24272d] p-4 pl-6 flex justify-between items-center">
          <div className="mt-4 lg:mt-0">
            <div className="flex gap-2 items-center">
              <Clapperboard width={30} className="" />
              <div>
                <h1 className="text-xl">Meu <span className="text-amber-400">Catálogo</span> de Filmes</h1>
                <h4 className="">
                  Dois em um: um projeto de desenvolvimento e a minha estante de
                  filmes favoritos.
                </h4>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6 lg:mr-8 absolute lg:static top-3 right-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input placeholder="Buscar filmes, diretores, gêneros..." className="pl-10 py-5 w-70" />
            </div>
            <a href="https://github.com/contatofabiofg/catalogo-de-filmes-next" target="_blank">
              <Image src="/github.png" alt="" width={32} height={32} className="hover:brightness-110" />
            </a>
            <a href="https://www.linkedin.com/in/contatofabiofg/" target="_blank">
              <Image src="/linkedin.png" alt="" width={32} height={32} className="hover:brightness-110" />
            </a>
          </div>
        </div>


        <div className="pl-[100px]">{children}</div>


      </body>
    </html>
  );
}
