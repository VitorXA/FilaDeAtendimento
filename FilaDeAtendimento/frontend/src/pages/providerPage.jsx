import { useEffect, useState } from "react";
import { api, clearSession, saveSession, session } from "../api";

function Login({ onDone, setPage }) {
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const d = await api(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: { username, password, ...(register ? { cpf } : {}) },
      });
      saveSession(d.token, d.user);
      onDone(d.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <button className="back" onClick={() => setPage(0)}>
          ← Voltar
        </button>
        <h1>{register ? "CADASTRO" : "TELA DE LOGIN"}</h1>
        <form className="card-form" onSubmit={submit}>
          <label>
            Nome de usuário
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </label>
          {register && (
            <label>
              CPF
              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </label>
          )}
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={submitting}>
            {submitting ? "AGUARDE..." : register ? "CADASTRAR-SE" : "ENTRAR"}
          </button>
        </form>
        <button className="link" onClick={() => setRegister(!register)}>
          {register
            ? "Já tenho uma conta"
            : "Ainda não tem cadastro? Clique aqui."}
        </button>
      </div>
    </main>
  );
}

export default function ProviderPage({ setPage }) {
  const [sess, setSess] = useState(session());
  const [queues, setQueues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const load = async () => {
    if (!sess.token) return;
    try {
      const d = await api("/queues/mine", { token: sess.token });
      setQueues(d.queues);
      setSelected((current) => d.queues.some((q) => q.id === current) ? current : (d.queues[0]?.id ?? null));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [sess.token]);

  useEffect(() => {
    if (!selected) { return; }
    let alive = true;
    const poll = async () => {
      try {
        const d = await api(`/queues/${selected}`);
        if (alive) { setSnapshot(d); setError(""); }
      } catch (e) {
        // Evita exibir erro na tela se a fila foi alterada ou removida
        if (alive && selected) setError(e.message);
      }
    };
    poll();
    const i = setInterval(poll, 1500);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, [selected]);

  if (!sess.token)
    return <Login setPage={setPage} onDone={(u) => setSess(session())} />;

  const create = async () => {
    if (!form.trim()) return;
    setError("");
    try {
      const d = await api("/queues", {
        method: "POST",
        token: sess.token,
        body: { name: form },
      });
      setQueues([d.queue, ...queues]);
      setSelected(d.queue.id);
      setSnapshot(null);
      setForm("");
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteQueue = async () => {
    if (!selected) return;
    if (!confirm("Tem certeza que deseja deletar esta fila?")) return;
    
    const targetId = selected;
    
    // Limpa os estados imediatamente para parar o polling antes da requisição acabar
    setSelected(null);
    setSnapshot(null);
    setError("");

    try {
      await api(`/queues/${targetId}`, {
        method: "DELETE",
        token: sess.token,
      });
      const updatedQueues = queues.filter((q) => q.id !== targetId);
      setQueues(updatedQueues);
      setSelected(updatedQueues[0]?.id ?? null);
    } catch (e) {
      setError(e.message);
      // Caso falte o método no backend, restaura o ID selecionado localmente
      setSelected(targetId);
    }
  };

  const next = async () => {
    setLoading(true);
    setError("");
    try {
      await api(`/queues/${selected}/next`, {
        method: "POST",
        token: sess.token,
      });
      setSnapshot(await api(`/queues/${selected}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (action) => {
    if (!snapshot?.current || loading) return;
    setLoading(true);
    setError("");
    try {
      await api(`/queues/${selected}/${action}`, {
        method: "POST",
        token: sess.token,
        body: { ticketId: snapshot.current.id },
      });
      setSnapshot(await api(`/queues/${selected}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finish = () => updateTicket("finish");
  const skip = () => updateTicket("skip");

  return (
    <main className="page">
      <div className="container provider-dashboard">
        <div className="top">
          <h1>SUA FILA</h1>
          <button
            className="back"
            onClick={() => {
              clearSession();
              setSess({ token: null, user: null });
            }}
          >
            Sair
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="create">
          <input
            value={form}
            onChange={(e) => setForm(e.target.value)}
            placeholder="Nome da nova fila"
          />
          <button className="primary small" onClick={create}>
            CRIAR FILA
          </button>
        </div>
        
        <div className="selection-container">
          <label className="select-label">
            Fila
            <select
              value={selected || ""}
              onChange={(e) => { setSnapshot(null); setError(""); setSelected(Number(e.target.value)); }}
            >
              <option value="" disabled>
                Selecione
              </option>
              {queues.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name} — {q.code}
                </option>
              ))}
            </select>
          </label>
          <button 
            className="btn-delete" 
            onClick={deleteQueue}
            disabled={!selected}
          >
            Deletar Fila
          </button>
        </div>

        {!selected && <p>Crie uma fila para começar a atender.</p>}
        {selected && snapshot && snapshot.queue.id === selected && (
          <>
            <div className="queue-code">
              Código: <b>{snapshot.queue.code}</b>
            </div>
            <div className="current">
              <span>EM ATENDIMENTO</span>
              <strong>{snapshot.current?.number ?? "—"}</strong>
              <p>{snapshot.current?.client_name || "Nenhum cliente chamado"}</p>
            </div>
            <div className="stats">
              <div>
                <span>Pessoas aguardando</span>
                <strong>{snapshot.waitingCount}</strong>
              </div>
              <div>
                <span>Próxima senha</span>
                <strong>{snapshot.waiting[0] ?? "—"}</strong>
              </div>
            </div>
            <div className="actions">
              <button className="primary" disabled={loading || !!snapshot.current || snapshot.waitingCount === 0} onClick={next}>
                CHAMAR O PRÓXIMO
              </button>
              <button onClick={finish} disabled={loading || !snapshot.current}>
                FINALIZAR
              </button>
              <button onClick={skip} disabled={loading || !snapshot.current}>
                PULAR
              </button>
            </div>
            <div className="waiting-list">
              <h3>Fila de espera</h3>
              {snapshot.waiting.length ? (
                <div>
                  {snapshot.waiting.map((n) => (
                    <span key={n}>#{n}</span>
                  ))}
                </div>
              ) : (
                <p>Fila vazia.</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
