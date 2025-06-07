import { useFlash } from "../flash/FlashProvider";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import PostForm from "../form/PostForm";

import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";

function NewPost() {
  const { showFlash } = useFlash();

  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  // exemplo de estados no componente pai
  const [MKtitle, setMKtitle] = useState("");
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
        userId: user.id,
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
    <PostForm
      isLoading={isLoading}
      title={MKtitle}
      summary={MKsummary}
      content={MKfullContent}
      onChangeTitle={(e) => setMKtitle(e.target.value)}
      onChangeSummary={(e) => setMKSummary(e.target.value)}
      onChangeContent={(e) => setMKFullContent(e.target.value)}
      onSubmit={createPost}
      showSummary={ShowSummaryViewModal}
      showContent={ShowContentViewModal}
      setShowSummary={setShowSummaryViewModal}
      setShowContent={setShowContentViewModal}
      buttonText="Salvar Post"
    />
  );
}

export default NewPost;
