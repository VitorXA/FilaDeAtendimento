import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUser } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

export default function InitialPage({ setPage }) {
  return (
    <div id="page">
      <div id="container">
        <h1> SELECIONE O MODO </h1>
        <section>
          <button
            className="button"
            onClick={() => {
              setPage(1);
            }}
          >
            <h2> PRESTADOR </h2>
            <FontAwesomeIcon
              icon={faUserTie}
              className="icons"
              onClick={() => setPage(1)}
            />
          </button>

          <button
            className="button"
            onClick={() => {
              setPage(2);
            }}
          >
            <h2> CLIENTE </h2>
            <FontAwesomeIcon
              icon={faUser}
              className="icons"
              onClick={() => setPage(2)}
            />
          </button>
        </section>
      </div>
    </div>
  );
}
