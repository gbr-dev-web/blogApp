import { useEffect, useState } from "react";

import { useFlash } from "../FlashProvider";

import { useNavigate } from "react-router-dom";

import { FiEdit, FiTrash } from "react-icons/fi";

import ReturnHome from "../ReturnHome";
import Loader from "../Loader";

import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import renderMarkdown from "../RenderMarkdown";

function MyPosts() {
  const [handleDeleteModal, setHandleDeleteModal] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/blogPosts?userId=${encodeURIComponent(
            user.id
          )}`
        );
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  });

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  }

  function DeletePost() {
    setLoading(true);
    fetch(`http://localhost:3001/blogPosts/${handleDeleteModal.id}`, {
      method: "DELETE",
    })
      .then(() => {
        showFlash("success", "Post deletado com sucesso!");
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== handleDeleteModal)
        );
      })
      .catch((err) => {
        console.error("Erro ao buscar posts:", err);
        showFlash("error", err.message || "Erro ao deletar post!");
      })
      .finally(() => {
        setLoading(false);
        setHandleDeleteModal(null);
      });
  }

  return (
    <div class="container mx-auto p-4 md:p-8">
      <Loader isLoading={loading} />
      <div class="mb-8">
        <ReturnHome />
      </div>

      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Meus Posts
        </h1>
        <p class="text-xl md:text-2xl text-gray-400 mb-8">
          Todos os posts que você criou.
        </p>
      </header>

      {/* posts */}
      <main className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-xl mt-10">
            Você ainda não criou nenhum post.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-7 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between min-h-[320px] hover:scale-105 hover:shadow-teal-500/30 transform transition duration-300"
            >
              <div>
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
                  className="text-gray-300 mb-6"
                />
              </div>

              <div className="flex items-center justify-between mt-auto gap-3">
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

                <div className="flex gap-2">
                  <button
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300 flex items-center gap-1"
                    onClick={() => navigate(`/editpost/${post.id}`)}
                  >
                    <FiEdit className="text-yellow-400" />
                    Editar 
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-300 flex items-center gap-1"
                    onClick={() => setHandleDeleteModal(post)}
                  >
                    <FiTrash className="text-red-400" />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* <!-- Modal de Confirmação --> */}
      {handleDeleteModal && (
        <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50   transition-opacity duration-300 ease-in-out">
          <div class="bg-gray-900 p-10 rounded-lg shadow-2xl max-w-[90%] w-[400px] text-center text-gray-300 -translate-y-5 transition-transform duration-300 ease-in-out">
            <h3 class="text-2xl font-bold text-white mb-4">
              Confirmar Exclusão
            </h3>
            <p id="text-base text-gray-400 mb-6">
              Tem certeza que deseja remover o post "
              <span class="font-semibold text-white">
                {DOMPurify.sanitize(handleDeleteModal.title)}
              </span>
              "? Esta ação não pode ser desfeita.
            </p>
            <div class="flex justify-center gap-4">
              <button
                onClick={() => DeletePost(handleDeleteModal.id)}
                class="px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ease-in-out bg-red-500 text-white hover:bg-red-600"
              >
                Confirmar
              </button>
              <button
                onClick={() => setHandleDeleteModal(null)}
                class="px-6 py-3 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-800 transition-colors duration-300 ease-in-out"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPosts;
