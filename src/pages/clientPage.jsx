export default function ProviderPage({ setPage }) {
  return (
    <div id="page">
      <div id="container">
        <div className="boxButton">
          <h1> TELA DE ACESSO </h1>
          <section>
            <h2> Digite seu nome e sobrenome</h2>
            <input type="text" className="textField" />
            <h2> Digite o código da LINE</h2>
            <input type="text" className="textField" />

            <div className="actionBox">
              <button className="actionButton" onClick={() => setPage(0)}>
                VOLTAR
              </button>
              <button className="actionButton">Gerar ACCESS KEY</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
