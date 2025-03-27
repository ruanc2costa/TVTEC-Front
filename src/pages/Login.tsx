import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === "tvtec123") {
      localStorage.setItem("auth", "true");
      navigate("/admin");
    } else {
      setErro("Senha incorreta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Login Administrativo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
            Entrar
          </button>
          {erro && <p className="text-center text-red-600">{erro}</p>}
        </form>
      </div>
    </div>
  );
}
