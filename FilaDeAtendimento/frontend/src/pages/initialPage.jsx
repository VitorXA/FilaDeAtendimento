import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUser } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
export default function InitialPage({ setPage }) {
  return (
    <main className="page">
      <div className="container home">
        <h1>SELECIONE O MODO</h1>
        <div className="choice-grid">
          <button className="choice" onClick={() => setPage(1)}>
            <h2>COORDENADOR</h2>
            <FontAwesomeIcon icon={faUserTie} className="icons" />
          </button>
          <button className="choice" onClick={() => setPage(2)}>
            <h2>ALUNO</h2>
            <FontAwesomeIcon icon={faUser} className="icons" />
          </button>
        </div>
      </div>
    </main>
  );
}
