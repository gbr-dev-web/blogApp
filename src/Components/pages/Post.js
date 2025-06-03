import { useParams, Link } from "react-router-dom";

import TextoMarkdown from "../TextToMarkdown";

import db from "../../data/db.json";

function Post() {
  const { id } = useParams();

  const samplePost = db.blogPosts.find((post) => post.id === id);

  //   Função para formatar a data para exibição
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  }

  return (
    <div class="container mx-auto p-4 md:p-8 max-w-3xl">
      <div class="mb-8">
        <Link to={"/"} class="nav-link flex items-center gap-2">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Voltar para o Blog
        </Link>
      </div>

      <main class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <p class="text-sm text-gray-400 mb-3">
          Por: {samplePost.user} | Criado em: {formatDate(samplePost.date)}
        </p>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
          {samplePost.title}
        </h1>
        <div class="text-gray-300 leading-relaxed text-lg">
          <TextoMarkdown text={samplePost.fullContent} />
        </div>
      </main>
    </div>
  );
}

export default Post;
