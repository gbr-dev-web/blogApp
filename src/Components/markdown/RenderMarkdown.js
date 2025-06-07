import DOMPurify from "dompurify";
import { marked } from "marked";

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
  ALLOWED_ATTR: ["title"],
  FORBID_TAGS: ["href", "img", "script", "iframe", "object", "embed"],
  FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover"],
};

marked.setOptions({
  breaks: true,
  mangle: false,
  headerIds: false,
  sanitizer: null, // importante
});

function renderMarkdown(mdText) {
  const sanitizedInput = DOMPurify.sanitize(mdText, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }); // <-- remove HTML antes do marked
  const rawHtml = marked.parse(sanitizedInput); // markdown seguro convertido para HTML
  return DOMPurify.sanitize(rawHtml, {
    ...config,
    SAFE_FOR_JQUERY: true,
    SAFE_FOR_TEMPLATES: true,
  });
}

export default renderMarkdown;
