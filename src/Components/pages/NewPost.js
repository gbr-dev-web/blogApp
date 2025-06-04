import { useFlash } from "../FlashProvider";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import Loader from "../Loader";
import ReturnHome from "../ReturnHome";
import Label from "../Label";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";

import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";

function NewPost() {
  const { showFlash } = useFlash();

  const navigate = useNavigate(); 

  const [isLoading, setisLoading] = useState(false);

  async function createPost(e)  {
    e.preventDefault()

    try {
      setisLoading(true);

      const rawTitle = document.getElementById("post-title").value.trim();
      const rawSummary = document.getElementById("post-summary").value.trim();
      const rawContent = document.getElementById("post-full-content").value.trim();
      
      const title = DOMPurify.sanitize(rawTitle);
      const summary = DOMPurify.sanitize(rawSummary);
      const content = DOMPurify.sanitize(rawContent);
      
      const date = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD

      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user.username); 

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
        fullContent: content
      };
      console.log(post)

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
          <div class="mb-4">
            <Label htmlFor="post-summary" text={"Resumo:"} />
            <TextArea
              id={"post-summary"}
              rows={"3"}
              placeholder={"Escreva um breve resumo do seu post"}
            />
          </div>
          <div class="mb-6">
            <Label htmlFor="post-full-content" text={"Conteúdo Completo:"} />
            
            <TextArea
              id={"post-full-content"}
              rows={"10"}
              placeholder={"Escreva o conteúdo completo do seu post aqui"}
            />
          </div>
          <Button text={"Criar Post"} className={"w-full"} />
        </form>
      </main>
    </div>
  );
}

export default NewPost;
