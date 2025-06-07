// src/Components/PostForm.jsx
import Label from "./Label";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import renderMarkdown from "./RenderMarkdown";
import Loader from "./Loader";
import ReturnHome from "./ReturnHome";

function PostForm({
  ReturnHomeText,
  ReturnHomeTo,
  isLoading,
  title,
  summary,
  content,
  onChangeTitle,
  onChangeSummary,
  onChangeContent,
  onSubmit,
  showSummary,
  showContent,
  setShowSummary,
  setShowContent,
  buttonText = "Salvar Post",
}) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Loader isLoading={isLoading} />
      <div className="mb-8">
        <ReturnHome to={ReturnHomeTo} text={ReturnHomeText} />
      </div>

      {(showSummary || showContent) && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-[700px] max-w-[90%] relative">
            <button
              onClick={() => {
                setShowSummary(false);
                setShowContent(false);
              }}
              className="absolute top-4 right-4 text-4xl text-gray-400 hover:text-teal-400"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">
              Visualização de Conteúdo em Markdown
            </h3>
            {showSummary && (
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
                className="markdown-preview bg-gray-700 text-white p-3 rounded-lg border border-gray-600 max-h-[60vh] overflow-auto"
              />
            )}
            {showContent && (
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                className="markdown-preview bg-gray-700 text-white p-3 rounded-lg border border-gray-600 max-h-[60vh] overflow-auto"
              />
            )}
          </div>
        </div>
      )}

      <main className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {buttonText === "Salvar Post" ? "Criar Novo Post" : "Editar Post"}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <Label htmlFor="post-title" text={"Título do Post:"} />
            <Input
              type="text"
              id="post-title"
              value={title}
              placeholder="Digite o título do seu post"
              onChange={onChangeTitle}
            />
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="post-summary" text={"Resumo:"} />
              <button
                type="button"
                onClick={() => setShowSummary(true)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold border border-teal-400 hover:border-teal-300 px-2 py-1 rounded-md transition"
              >
                Visualizar
              </button>
            </div>
            <TextArea
              id="post-summary"
              rows="3"
              placeholder="Escreva um breve resumo"
              value={summary}
              onChange={onChangeSummary}
              maxLength="100"
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="post-full-content" text={"Conteúdo Completo:"} />
              <button
                type="button"
                onClick={() => setShowContent(true)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold border border-teal-400 hover:border-teal-300 px-2 py-1 rounded-md transition"
              >
                Visualizar
              </button>
            </div>
            <TextArea
              id="post-full-content"
              rows="10"
              placeholder="Escreva o conteúdo completo do post"
              value={content}
              onChange={onChangeContent}
              maxLength="1000"
            />
          </div>
          <Button text={buttonText} className="w-full" />
        </form>
      </main>
    </div>
  );
}

export default PostForm;
