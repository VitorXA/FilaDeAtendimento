const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export async function api(path, { method = "GET", body, token } = {}) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Erro na requisição");
  return data;
}
export const saveSession = (token, user) => {
  localStorage.setItem("fila_token", token);
  localStorage.setItem("fila_user", JSON.stringify(user));
};
export const session = () => ({
  token: localStorage.getItem("fila_token"),
  user: JSON.parse(localStorage.getItem("fila_user") || "null"),
});
export const clearSession = () => {
  localStorage.removeItem("fila_token");
  localStorage.removeItem("fila_user");
};
