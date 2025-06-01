import { ReactComponent as LoginSvg } from "../../assets/Icons/Login.svg";
import { ReactComponent as SignupSvg } from "../../assets/Icons/SignUp.svg";

import Button from "../Button";

function Home() {
  return (
    <div class="container mx-auto p-4 md:p-8">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Blog Insights
        </h1>
        <p class="text-xl md:text-2xl text-gray-400 mb-8">
          Descubra novas perspectivas e ideias.
        </p>
        <nav class="flex justify-center gap-4">
          <Button Icon={LoginSvg} text={"Login"} id={"open-login-modal"} />
          <Button
            Icon={SignupSvg}
            text={"Cadastre-se"}
            id={"open-signup-modal"}
          />
        </nav>
      </header>

      <main
        id="blog-posts-v3"
        class="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
      ></main>
    </div>
  );
}

export default Home;
