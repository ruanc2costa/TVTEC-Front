import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, PlusCircle, LogIn, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";

export default function Menu() {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const linkStyle = (path: string) =>
    `flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 transition ${
      location.pathname === path ? "bg-gray-700" : ""
    }`;

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex flex-wrap gap-4 items-center justify-between shadow-md">
      <div className="flex gap-3 items-center flex-wrap">
        <Link to="/" className={linkStyle("/")}> <Home size={18} /> Início </Link>
        <Link to="/cursos-disponiveis" className={linkStyle("/cursos-disponiveis")}> <GraduationCap size={18} /> Cursos </Link>
        {isAuthenticated && (
          <>
            <Link to="/admin" className={linkStyle("/admin")}> <LayoutDashboard size={18} /> Admin </Link>
            <Link to="/cadastrar-curso" className={linkStyle("/cadastrar-curso")}> <PlusCircle size={18} /> Cadastrar </Link>
          </>
        )}
      </div>
      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            <LogOut size={18} /> Sair
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
            <LogIn size={18} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}
