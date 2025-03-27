import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-wrap gap-4">
        <Link to="/" className="hover:underline">Início</Link>
        <Link to="/cursos-disponiveis" className="hover:underline">Cursos</Link>
        {isAuthenticated && (
          <>
            <Link to="/cadastrar-curso" className="hover:underline">Cadastrar Curso</Link>
            <Link to="/inscricoes" className="hover:underline">Inscrições</Link>
          </>
        )}
      </div>
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Sair
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}