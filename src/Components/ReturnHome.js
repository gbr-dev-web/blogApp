import { Link } from "react-router-dom";

function ReturnHome({ text = "Voltar para o Blog", to = "/" }) {
  return (
    <Link
      to={to}
      class="text-teal-300 hover:text-teal-500 no-underline transition-colors duration-300 ease-in-out
flex items-center gap-2"
    >
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
      {text}
    </Link>
  );
}

export default ReturnHome;
