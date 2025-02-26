import React from "react";
import logo from "../assets/logo.png";

function cadastroPage() {
    return (
        <section className="flex items-center justify-center flex-col gap-4">
                    <img src={logo} alt="logo" className="w-26 h-20" />
                    <div className="text-2xl">Cadastro</div>
                  {/* <!-- Right column container with form --> */}
                  <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-90">
                    <form>
                      {/* <!-- Email input --> */}
                      <label htmlFor="nome">Nome: </label>
                      <input
                        type="text"
                        label="nome"
                        style={{border: "1px solid #ccc"}}
                        size="lg"
                      ></input>

                    <label htmlFor="cpf">CPF: </label>
                      <input
                        type="number"
                        label="CPF"
                        style={{border: "1px solid #ccc"}}
                        size="lg"
                      ></input>
        
                      {/* <!--Password input--> */}
                      <label htmlFor="email">Email: </label>
                      <input
                        type="texte"
                        label="email"
                        style={{border: "1px solid #ccc"}}
                        size="lg"
                      ></input>

                    <label htmlFor="telefone">Telefone: </label>
                      <input
                        type="number"
                        label="telefone"
                        style={{border: "1px solid #ccc"}}
                        size="lg"
                      ></input>
                      
                      <label htmlFor="password">Senha: </label>
                      <input
                        type="password"
                        label="Senha"
                        style={{border: "1px solid #ccc"}}
                        size="lg"
                      ></input>
        
                      {/* <!-- Submit button --> */}
                      <div className="flex items-center justify-center p-2">
                        <button
                          type="button"
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

export default cadastroPage