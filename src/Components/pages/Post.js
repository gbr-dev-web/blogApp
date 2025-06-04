import { useParams } from "react-router-dom";

import TextoMarkdown from "../TextToMarkdown";
import ReturnHome from "../ReturnHome";

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
        <ReturnHome />
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
