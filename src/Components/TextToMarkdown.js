import { marked } from "marked";
import DOMPurify from "dompurify";

const renderMarkdown = (markdownText) => {
  const tokens = marked.lexer(markdownText);

  return tokens.map((token, index) => {
    switch (token.type) {
      case "paragraph": // **
        // parseInline retorna HTML, sanitizamos com DOMPurify
        const paragraphHtml = DOMPurify.sanitize(
          marked.parseInline(token.text)
        );
        return (
          <p
            key={index}
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: paragraphHtml }}
          />
        );

      case "heading": // #, ##, ###
        const HeadingTag = `h${token.depth}`;
        const headingHtml = DOMPurify.sanitize(marked.parseInline(token.text));

        // Mapeia o nível do heading para uma classe Tailwind de tamanho
        const sizeClass =
          {
            1: "text-3xl font-bold",
            2: "text-2xl font-semibold",
            3: "text-1xl font-semibold",
          }[token.depth] || "text-base";

        return (
          <HeadingTag
            key={index}
            className={sizeClass}
            dangerouslySetInnerHTML={{ __html: headingHtml }}
          />
        );

      default:
        return null;
    }
  });
};

const TextoMarkdown = ({ text }) => {
  return <div>{renderMarkdown(text)}</div>;
};

export default TextoMarkdown;
