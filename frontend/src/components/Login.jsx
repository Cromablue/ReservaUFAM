import React from "react";
import logo from "../assets/logo.png";
const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login realizado");
  };
  return (
    <section className="flex items-center justify-center flex-col gap-4">
            <img src={logo} alt="logo" className="w-26 h-20" />
          {/* <!-- Right column container with form --> */}
          <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-60">
            <form onSubmit={handleLogin}>
              {/* <!-- Email input --> */}
              <label htmlFor="siape">SIAPE: </label>
              <input
                type="text"
                label="SIAPE"
                style={{border: "1px solid #ccc"}}
                size="lg"
              ></input>

              {/* <!--Password input--> */}
              <label htmlFor="password">Senha: </label>
              <input
                type="password"
                label="Senha"
                style={{border: "1px solid #ccc"}}
                size="lg"
              ></input>

              {/* <!-- Remember me checkbox --> */}
              <div className="mb-6 flex justify-between flex-col">

                {/* <!-- Forgot password link --> */}
                <a
                  href="#!"
                  className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                >
                  Esqueceu sua senha?
                </a>
                <a
                  href="#!"
                  className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                >
                  Primeiro acesso
                </a>
              </div>

              {/* <!-- Submit button --> */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md items-center justify-center"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
    </section>
  );
}

export default Login;
