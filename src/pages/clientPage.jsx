export default function  ProviderPage({ setPage }) {
const [client, setClient] = useState(0)
IF(client == 0) {
  return (
    <div id="page">
      <div id="container">
        <div className="boxButton">
          <h1> SUA POSIÇÃO NA QUEUE</h1>
          <section>
            <h3> "NUMBER HERE" </h3>
          </section>
        </div>
      </div>
    </div>
  );} IF (client == 1) 
{return (
    <div id="page">
      <div id="container">
        <div className="boxButton">
          <h1> TELA DE ACESSO </h1>
          <section>
            <h2> Digite seu nome e sobrenome</h2>
            <input type="text" className="textField" />
            <h2> Digite o código da QUEUE </h2>
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
}
