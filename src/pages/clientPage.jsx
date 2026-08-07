export default function ProviderPage({ setPage }) {
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
              <button className="actionButton">ENTRAR</button>
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
