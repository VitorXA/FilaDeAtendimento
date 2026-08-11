import { useState } from "react";
import InitialPage from "./pages/initialPage";
import ClientPage from "./pages/clientPage";
import ProviderPage from "./pages/providerPage";
import "./App.css";
export default function App() {
  const [page, setPage] = useState(0);
  if (page === 1) return <ProviderPage setPage={setPage} />;
  if (page === 2) return <ClientPage setPage={setPage} />;
  return <InitialPage setPage={setPage} />;
}
