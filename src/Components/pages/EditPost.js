import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { useFlash } from "../FlashProvider";

import DOMPurify from "dompurify";

import PostForm from "../PostForm";

function EditPost() {
  const { id } = useParams();

  const { showFlash } = useFlash();

  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  // exemplo de estados no componente pai
  const [MKtitle, setMKtitle] = useState("");
  const [MKsummary, setMKSummary] = useState("");
  const [MKfullContent, setMKFullContent] = useState("");
  const [ShowSummaryViewModal, setShowSummaryViewModal] = useState(false);
  const [ShowContentViewModal, setShowContentViewModal] = useState(false);

  useEffect(() => {
    setisLoading(true);
    async function fetchPost() {
      const response = await fetch(`http://localhost:3001/blogPosts/${id}`);
      const data = await response.json();
      console.log(data.title);
      setMKtitle(data.title);
      setMKSummary(data.summary);
      setMKFullContent(data.fullContent);
      setisLoading(false);
    }
    fetchPost();
  }, [id]);

  async function editPost(e) {
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
      const fullContent = DOMPurify.sanitize(rawContent, config);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        throw new Error("Usuário não autenticado!, faça login!");
      }

      if (!title || !summary || !fullContent) {
        throw new Error("Preencha todos os campos!");
      }

      const editedPost = {
        title,
        summary,
        fullContent,
      };

      const editPost = await fetch(`http://localhost:3001/blogPosts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPost),
      });

      if (!editPost.ok) {
        throw new Error("Erro ao editar post!");
      }
      navigate("/meusposts");
      showFlash("success", "Post editado com sucesso!", 4000);
    } catch (err) {
      console.log(err);
      showFlash("error", err.message || "Erro ao editar post!");
    } finally {
      setisLoading(false);
    }
  }
  return (
    <PostForm
      ReturnHomeTo="/meusposts"
      ReturnHomeText="Voltar para meus posts"
      isLoading={isLoading}
      title={MKtitle}
      summary={MKsummary}
      content={MKfullContent}
      onChangeTitle={(e) => setMKtitle(e.target.value)}
      onChangeSummary={(e) => setMKSummary(e.target.value)}
      onChangeContent={(e) => setMKFullContent(e.target.value)}
      onSubmit={editPost}
      showSummary={ShowSummaryViewModal}
      showContent={ShowContentViewModal}
      setShowSummary={setShowSummaryViewModal}
      setShowContent={setShowContentViewModal}
      buttonText="Salvar alterações"
    />
  );
}

export default EditPost;
