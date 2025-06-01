import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { ReactComponent as LoginSvg } from "../../assets/Icons/Login.svg";
import { ReactComponent as SignupSvg } from "../../assets/Icons/SignUp.svg";

import Button from "../Button";

import db from "../../data/db.json";

function Home() {
  // Estados para controle dos modais
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // efeito de ux pra focar no input
  useEffect(() => {
    if (showLoginModal) {
      document.getElementById("login-email")?.focus();
    }
  }, [showLoginModal]);
  
  useEffect(() => {
    if (showSignupModal) {
      document.getElementById("signup-username")?.focus();
    }
  }, [showSignupModal]);

  // Função para formatar a data para exibição
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  }

  const blogPosts = db.blogPosts;

  // ordena os itens do mais novo para o mais antigo
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const postsPerPage = 6; // Quantidade de posts por página

  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual

  // Calcular os posts que serão exibidos na página atual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost); // dividem os posts que serao exibidos

  const nextPage = () => {
    if (indexOfLastPost < sortedPosts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Blog App
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Descubra novas perspectivas e ideias.
        </p>
        {/* buttons */}
        <nav className="flex justify-center gap-4">
          <Button
            Icon={LoginSvg}
            text={"Login"}
            onClick={() => setShowLoginModal(true)}
          />
          <Button
            Icon={SignupSvg}
            text={"Cadastre-se"}
            onClick={() => setShowSignupModal(true)}
          />
        </nav>
      </header>
      {/* posts */}
      <main className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-7 rounded-xl shadow-2xl border border-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-teal-500/30"
          >
            <p className="text-sm text-gray-400 mb-1">Por: {post.user}</p>
            <p className="text-xs text-gray-500 mb-3">
              Criado em: {formatDate(post.date)}
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">{post.title}</h2>
            <p className="text-gray-300 mb-5">{post.summary}</p> {/* resumo */}
            <Link
              to={`/post/${post.id}`}
              className="text-teal-300 no-underline transition-colors duration-300 hover:text-teal-400 font-semibold inline-flex items-center"
            >
              Ler Mais{" "}
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>
        ))}
      </main>
      {/* Navegação da paginação */}
      {sortedPosts.length > postsPerPage && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={nextPage}
            disabled={indexOfLastPost >= sortedPosts.length}
            className="bg-teal-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Modal Login */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[999] bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-11/12 md:w-1/2 lg:w-1/3 relative z-[1000]">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Login
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="login-email"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="login-password"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Senha:
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="password"
                />
              </div>
              <Button text={"Entrar"} className={"w-full"} />
            </form>
            <p className="text-center text-gray-400 text-sm mt-6">
              Não tem uma conta?{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-teal-300 no-underline transition-colors duration-300 hover:text-teal-400"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Modal Signup */}
      {showSignupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[999]">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-11/12 md:w-1/2 lg:w-1/3 relative z-[1000]">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Cadastre-se
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="signup-username"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Nome de Usuário:
                </label>
                <input
                  type="text"
                  id="signup-username"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Seu Nome"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="signup-email"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Email:
                </label>

                <input
                  type="email"
                  id="signup-email"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="signup-password"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Senha:
                </label>
                <input
                  type="password"
                  id="signup-password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Password"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="signup-repeated-password"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Repetir Senha:
                </label>
                <input
                  type="password"
                  id="signup-repeated-password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Repeat Password"
                />
              </div>

              <button
                type="submit"
                className="bg-teal-400 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-teal-500 w-full"
              >
                Criar Conta
              </button>
            </form>
            <p className="text-center text-gray-400 text-sm mt-6">
              Já tem uma conta?{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-teal-300 no-underline transition-colors duration-300 hover:text-teal-400"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
