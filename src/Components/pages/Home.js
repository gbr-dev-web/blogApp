import { useState, useEffect } from "react";
import { useFlash } from "../flash/FlashProvider";
import { Link, useNavigate } from "react-router-dom";

// icons
import { ReactComponent as LoginSvg } from "../../assets/Icons/Login.svg";
import { ReactComponent as SignupSvg } from "../../assets/Icons/SignUp.svg";
import { ReactComponent as CriarPostSvg } from "../../assets/Icons/CriarPost.svg";
import { ReactComponent as MeusPostsSvg } from "../../assets/Icons/MeusPosts.svg";
import { ReactComponent as LogoutSvg } from "../../assets/Icons/Logout.svg";

import Button from "../common/Button";
import Input from "../common/Input";
import Label from "../common/Label";
import Loader from "../common/Loader/Loader";
import renderMarkdown from "../markdown/RenderMarkdown";

import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";

function Home() {
  // "retorne o showFlash que foi compartilhado pelo FlashContext.Provider e o nomeie com o seu proprio nome"
  const { showFlash } = useFlash();

  const navigate = useNavigate(); // navegacao de paginas

  // Estados para controle dos modais
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true); // Estado para controlar a verificação de login

  const [blogPosts, setBlogPosts] = useState([]);

  // verifica se o usuario esta logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
    setIsCheckingLogin(false);
  }, []);

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

  //#region posts
  // Função para formatar a data para exibição
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  }

  // busca os posts no db via fetch
  useEffect(() => {
    fetch("http://localhost:3001/blogPosts")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar posts");
        return response.json();
      })
      .then((data) => {
        setBlogPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

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
  //#endregion

  //#region login, signup e logout
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Sanitiza os dados do formulário
      const username = DOMPurify.sanitize(
        e.target["signup-username"].value.trim()
      );
      const email = DOMPurify.sanitize(e.target["signup-email"].value.trim());
      const password = DOMPurify.sanitize(e.target["signup-password"].value);
      const repeatedPassword = DOMPurify.sanitize(
        e.target["signup-repeated-password"].value
      );

      // Validações simples
      if (!username || !email || !password || !repeatedPassword) {
        throw new Error("Por favor, preencha todos os campos.");
      }

      if (password !== repeatedPassword) {
        throw new Error("As senhas não coincidem.");
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Email inválido.");
      }

      // Verifica se já existe usuário com esse email
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${email}`
      );
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        throw new Error("Usuário já existe.");
      }

      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(),
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar usuário.");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: uuidv4(),
          username,
          email,
          password,
        })
      );
      if (localStorage.getItem("user")) {
        setIsLoggedIn(true);
      } else {
        throw new Error("não foi possivel logar, tente fazer o login");
      }
      showFlash("success", "Usuário criado com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      showFlash("error", err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
      setShowSignupModal(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Sanitiza inputs
      const email = DOMPurify.sanitize(e.target["login-email"].value.trim());
      const password = DOMPurify.sanitize(e.target["login-password"].value);
      console.log(password)

      // Validação simples
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Email inválido.");
      }
      // Verifica se já existe usuário com esse email
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${email}`
      );
      const existingUsers = await checkRes.json();

      if (!existingUsers) {
        throw new Error("Usuário inexistente.");
      }
      if (password !== existingUsers[0].password) {
        throw new Error("Senha incorreta.");
      }

      localStorage.setItem("user", JSON.stringify(existingUsers[0]));
      if (localStorage.getItem("user")) {
        setIsLoggedIn(true);
      } else {
        throw new Error("não foi possivel logar, tente fazer o login");
      }
      showFlash("success", "Login realizado com sucesso!");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      showFlash("error", err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
      setShowLoginModal(false);
    }
  };

  function Logout() {
    localStorage.removeItem("user");
    if (!localStorage.getItem("user")) {
      setIsLoggedIn(false);
      showFlash("success", "Logout realizado com sucesso!");
    } else {
      showFlash("error", "Erro ao fazer logout!");
    }
  }
  //#endregion

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Loader isLoading={isLoading} />

      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Blog App
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Descubra novas perspectivas e ideias.
        </p>
        {/* buttons */}
        <nav className="flex justify-center gap-4">
          {isCheckingLogin ? (
            <Loader isLoading={true} />
          ) : !isLoggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                Icon={CriarPostSvg}
                text={"Criar Post"}
                onClick={() => navigate("/novopost")}
              />
              <Button
                Icon={MeusPostsSvg}
                text={"Meus Posts"}
                onClick={() => navigate("/meusposts")}
              />
              <Button Icon={LogoutSvg} text={"Sair"} onClick={() => Logout()} />
            </>
          )}
        </nav>
      </header>

      {/* posts */}
      <main className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-7 rounded-xl shadow-2xl border border-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-teal-500/30 flex flex-col justify-between max-h-min[320px]"
          >
            <p className="text-sm text-gray-400 mb-1">
              Por: {DOMPurify.sanitize(post.user)}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Criado em: {formatDate(post.date)}
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              {DOMPurify.sanitize(post.title)}
            </h2>
            <p
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(post.summary),
              }}
              className="text-gray-300 mb-5"
            />
            <Link
              to={`/post/${post.id}`}
              className="text-teal-300 no-underline transition-colors duration-300 hover:text-teal-400 font-semibold inline-flex items-center mt-auto"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[999]">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-11/12 md:w-1/2 lg:w-1/3 relative z-[1000]">
            <Loader isLoading={isLoading} />
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Login
            </h2>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <Label htmlFor="login-email" text={"Email:"} />

                <Input
                  maxLength={50}
                  type={"email"}
                  id={"login-email"}
                  placeholder={"seuemail@exemplo.com"}
                />
              </div>

              <div className="mb-6">
                <Label htmlFor={"login-password"} text={"Senha:"} />

                <Input
                  maxLength={50}
                  type={"password"}
                  id={"login-password"}
                  placeholder={"password"}
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
            <Loader isLoading={isLoading} />
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Cadastre-se
            </h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <Label htmlFor="signup-username" text={"Nome de Usuário:"} />

                <Input
                  maxLength={50}
                  type={"text"}
                  id={"signup-username"}
                  placeholder={"Seu Nome"}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="signup-email" text={"Email:"} />

                <Input
                  maxLength={50}
                  type={"email"}
                  id={"signup-email"}
                  placeholder={"seuemail@exemplo.com"}
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="signup-password" text={"Senha:"} />

                <Input
                  maxLength={50}
                  type={"password"}
                  id={"signup-password"}
                  placeholder={"Password"}
                />
              </div>

              <div className="mb-4">
                <Label
                  htmlFor="signup-repeated-password"
                  text={"RepetirSenha:"}
                />

                <Input
                  maxLength={50}
                  type={"password"}
                  id={"signup-repeated-password"}
                  placeholder={"Repeat Password"}
                />
              </div>

              <Button text={"Criar Conta"} className={"w-full"} />
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
