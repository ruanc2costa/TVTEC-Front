import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Confirmacao from "./pages/Confirmacao";
import Login from "./pages/Login";
import CadastroCurso from "./pages/CadastroCurso";
import CursosDisponiveis from "./pages/CursosDisponiveis";
import CursoDetalhes from "./pages/CursoDetalhes";
import InscricoesDetalhadas from "./pages/InscricoesDetalhadas";
import PaginaGerenciamento from "./pages/PaginaGerenciamento";
import Menu from "./components/Menu";

function App() {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/cadastrar-curso" element={isAuthenticated ? <CadastroCurso /> : <Navigate to="/login" replace />} />
        <Route path="/cursos-disponiveis" element={<CursosDisponiveis />} />
        <Route path="/cursos/:id" element={<CursoDetalhes />} />
        <Route path="/inscricoes" element={isAuthenticated ? <InscricoesDetalhadas /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={isAuthenticated ? <PaginaGerenciamento  /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;