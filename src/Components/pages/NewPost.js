import { useFlash } from "../FlashProvider";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import Loader from "../Loader";
import ReturnHome from "../ReturnHome";
import Label from "../Label";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";
import renderMarkdown from "../RenderMarkdown";

import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";

function NewPost() {
  const { showFlash } = useFlash();

  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  // exemplo de estados no componente pai
  const [MKsummary, setMKSummary] = useState("");
  const [MKfullContent, setMKFullContent] = useState("");
  const [ShowSummaryViewModal, setShowSummaryViewModal] = useState(false);
  const [ShowContentViewModal, setShowContentViewModal] = useState(false);

  async function createPost(e) {
    e.preventDefault();

    try {
      setisLoading(true);

      // configuração restritiva do dompurify
      const config = {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "p",
          "ul",
          "ol",
          "li",
          "br",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
        ],
        ALLOWED_ATTR: ["href", "title"],
        FORBID_TAGS: ["img", "script", "iframe", "object", "embed"],
        FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover"],
      };

      const rawTitle = document.getElementById("post-title").value.trim();
      const rawSummary = document.getElementById("post-summary").value.trim();
      const rawContent = document
        .getElementById("post-full-content")
        .value.trim();

      const title = DOMPurify.sanitize(rawTitle, config);
      const summary = DOMPurify.sanitize(rawSummary, config);
      const content = DOMPurify.sanitize(rawContent, config);

      const date = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        throw new Error("Usuário não autenticado!, faça login!");
      }

      if (!title || !summary || !content) {
        throw new Error("Preencha todos os campos!");
      }

      const post = {
        id: uuidv4(),
        user: user.username,
        title,
        summary,
        date,
        fullContent: content,
      };

      const postPost = await fetch("http://localhost:3001/blogPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!postPost.ok) {
        throw new Error("Erro ao criar post!");
      }
      navigate("/");
      showFlash("success", "Post criado com sucesso!", 4000);
    } catch (err) {
      console.log(err);
      showFlash("error", err.message || "Erro ao criar post!");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div class="container mx-auto p-4 md:p-8 max-w-3xl">
      <Loader isLoading={isLoading} />
      <div class="mb-8">
        <ReturnHome />
      </div>
      {/* modal de diew */}
      {(ShowSummaryViewModal || ShowContentViewModal) && (
        <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] transition-opacity duration-300 ease-in-out">
          <div class="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-[90%] w-[700px] relative -translate-y-5 transition-transform duration-300 ease-in-out">
            <button
              onClick={() => {
                setShowSummaryViewModal(false);
                setShowContentViewModal(false);
              }}
              class="absolute top-4 right-4 bg-transparent border-none text-gray-400 text-4xl cursor-pointer transition-colors duration-300 ease-in-out hover:text-teal-400"
            >
              &times;
            </button>
            <h3 class="text-2xl font-bold text-white mb-4">
              Visualização de Conteúdo em Markdown
            </h3>

            {ShowSummaryViewModal && (
              <div
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(MKsummary),
                }}
                class="markdown-preview w-full p-3 rounded-lg bg-gray-700 text-white min-h-[15rem] overflow-auto border border-gray-600 max-h-[60vh] overflow-y-auto"
              />
            )}
            {ShowContentViewModal && (
              <div
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(MKfullContent),
                }}
                class="markdown-preview w-full p-3 rounded-lg bg-gray-700 text-white min-h-[15rem] overflow-auto border border-gray-600 max-h-[60vh] overflow-y-auto"
              />
            )}
          </div>
        </div>
      )}
      <main class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">
          Criar Novo Post
        </h2>
        <form onSubmit={(e) => createPost(e)}>
          <div class="mb-4">
            <Label htmlFor="post-title" text={"Título do Post:"} />
            <Input
              type={"text"}
              id={"post-title"}
              placeholder={"Digite o título do seu post"}
            />
          </div>
          <div class="mb-2">
            <div class="flex items-center justify-between">
              <Label htmlFor="post-summary" text={"Resumo:"} />
              <button
                onClick={() => setShowSummaryViewModal(true)}
                type="button"
                class="text-teal-400 hover:text-teal-300 text-sm font-semibold py-1 px-2 rounded-md border border-teal-400 hover:border-teal-300 transition-colors duration-200"
              >
                Visualizar
              </button>
            </div>
            <TextArea
              id={"post-summary"}
              rows={"3"}
              placeholder={"Escreva um breve resumo do seu post"}
              onChange={(e) => setMKSummary(e.target.value)}
              maxLength={"100"}
            />
          </div>
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <Label htmlFor="post-full-content" text={"Conteúdo Completo:"} />
              <button
                onClick={() => setShowContentViewModal(true)}
                type="button"
                class="text-teal-400 hover:text-teal-300 text-sm font-semibold py-1 px-2 rounded-md border border-teal-400 hover:border-teal-300 transition-colors duration-200"
              >
                Visualizar
              </button>
            </div>
            <TextArea
              id={"post-full-content"}
              rows={"10"}
              placeholder={"Escreva o conteúdo completo do seu post aqui"}
              onChange={(e) => setMKFullContent(e.target.value)}
              maxLength={"1000"}
            />
          </div>
          <Button text={"Criar Post"} className={"w-full"} />
        </form>
      </main>
    </div>
  );
}

export default NewPost;
