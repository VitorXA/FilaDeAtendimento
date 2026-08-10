import { useState } from "react";

export default function ProviderPage({ setPage }) {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const checkLoguin = () => {
    console.log("teste");
    setLogged(true);
  };

  if (logged == false) {
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
              <a href="#" className="linkLoguin">
                ainda não tem cadastro? clique aqui.
              </a>
            </section>
          </div>
        </div>
      </div>
    );
  }
  if (logged == true) {
    return (
      <div id="page">
        <div id="container">
          <h1> SUA FILA </h1>
          <section>
          </section>
        </div>
      </div>
    );
  }
}
