import { useEffect, useState } from "react";
import { api } from "../api";
export default function ClientPage({ setPage }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function join(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const q = await findQueue();
      const d = await api(`/queues/${q.id}/join`, {
        method: "POST",
        body: { clientName: name },
      });
      setTicket(d.ticket);
      setQueue(q);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function findQueue() {
    const d = await api(
      `/queues/by-code/${encodeURIComponent(code.trim().toUpperCase())}`,
    );
    return d;
  }
  useEffect(() => {
    if (!ticket) return;
    const poll = async () => {
      try {
        const d = await api(`/tickets/${ticket.id}`);
        setTicket(d.ticket);
        const q = await api(`/queues/${ticket.queue_id}`);
        setQueue(q);
      } catch {}
    };
    poll();
    const i = setInterval(poll, 2000);
    return () => clearInterval(i);
  }, [ticket?.id]);
  if (ticket)
    return (
      <main className="page">
        <div className="container dashboard">
          <button className="back" onClick={() => setPage(0)}>
            ← Voltar
          </button>
          <h1>SUA SENHA</h1>
          <div className="ticket-number">
            {String(ticket.number).padStart(2, "0")}
          </div>
          <p className="status">
            Status:{" "}
            <b>
              {ticket.status === "WAITING"
                ? "AGUARDANDO"
                : ticket.status === "CALLED"
                  ? "FOI CHAMADO"
                  : ticket.status === "COMPLETED"
                    ? "FINALIZADO"
                    : "ATENDIMENTO"}
            </b>
          </p>
          <div className="stats">
            <div>
              <span>Fila</span>
              <strong>{queue?.queue?.name || queue?.name || "—"}</strong>
            </div>
            <div>
              <span>Pessoas à frente</span>
              <strong>
                {queue?.waiting?.filter((n) => n < ticket.number).length ?? "—"}
              </strong>
            </div>
            <div>
              <span>Senha atual</span>
              <strong>{queue?.current?.number ?? "—"}</strong>
            </div>
          </div>
          {ticket.status === "CALLED" && (
            <div className="alert">Sua senha foi chamada!</div>
          )}
        </div>
      </main>
    );
  return (
    <main className="page">
      <div className="container">
        <button className="back" onClick={() => setPage(0)}>
          ← Voltar
        </button>
        <h1>TELA DE ACESSO</h1>
        <form className="card-form" onSubmit={join}>
          <label>
            Seu nome e sobrenome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Código da QUEUE
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex.: ABC123"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={loading}>
            {loading ? "ENTRANDO..." : "ENTRAR NA FILA"}
          </button>
        </form>
      </div>
    </main>
  );
}
