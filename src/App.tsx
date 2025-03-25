import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Confirmacao from "./pages/Confirmacao";
import Login from "./pages/Login";
import CadastroCurso from "./pages/CadastroCurso";
import Menu from "./components/Menu";
import CursosDisponiveis from "./pages/CursosDisponiveis";

function App() {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cadastrar-curso"
          element={isAuthenticated ? <CadastroCurso /> : <Navigate to="/login" replace />}
        />
        <Route path="/cursos-disponiveis" element={<CursosDisponiveis />} />
      </Routes>
    </Router>
  );
}

export default App;
