import { useState } from "react";

export default function ProviderPage({ setPage }) {
  const [logged, setLogged] = useState(0);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const checkLoguin = () => {
    console.log("teste");
    setLogged(1);
  };

  if (logged == 0) {
    return (
      <div id="page">
        <div id="container">
          <div className="boxButton">
            <h1> TELA DE LOGIN </h1>
            <section>
              <h2> Digite seu Usuário </h2>
              <input type="text" className="textField" />
              <h2> Digite sua senha </h2>
              <input type="password" className="textField" />

              <div className="actionBox">
                <button className="actionButton" onClick={() => setPage(0)}>
                  VOLTAR
                </button>
                <button className="actionButton" onClick={checkLoguin}>
                  ENTRAR
                </button>
              </div>
              <a href="#" className="linkLoguin" onClick={() => setLogged(2)}>
                ainda não tem cadastro? clique aqui.
              </a>
            </section>
          </div>
        </div>
      </div>
    );
  }
  if (logged == 1) {
    return (
      <div id="page">
        <div id="container">
          <h1> SUA FILA </h1>
          <section>
          </section>
        </div>
      </div>
    );
  }if (logged == 2) {
    return (<div id="page">
        <div id="container">
          <div className="boxButton">
            <h1> TELA DE LOGIN </h1>
            <section>
              <h2> Nome de Usuário </h2>
              <input type="text" className="textField" />
              <h2>  Senha </h2>
              <input type="password" className="textField" />
              <h2> Seu CPF </h2>
              <input type="password" className="textField" />
              <div className="actionBox">
                <button className="actionButton" onClick={() => setPage(0)}>
                  VOLTAR
                </button>
                <button className="actionButton" onClick={checkLoguin}>
                  CADASTRAR-SE
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
