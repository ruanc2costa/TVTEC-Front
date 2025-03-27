import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "https://cursos-tv.onrender.com/curso";

export default function CursosDisponiveis() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const usuario = localStorage.getItem("usuario") || "Administrador";

  const carregarCursos = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setCursos)
      .catch(() => setErro("Erro ao carregar cursos"));
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  const verificarStatus = (inicio: string) => {
    if (!inicio) return "Data inválida";
    const hoje = new Date();
    const dataInicio = new Date(inicio);
    return hoje <= dataInicio ? "Inscrições abertas" : "Encerradas";
  };

  const vagasAbertas = (curso: any) => {
    const preenchidas = curso.vagasPreenchidas ?? 0;
    const totais = curso.vagasTotais ?? 0;
    return totais - preenchidas > 0;
  };

  const formatarData = (data: string) => {
    if (!data) return "Data não definida";
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  };

  const apagarCurso = async (id: number, nome: string) => {
    const confirmado = confirm(`Tem certeza que deseja apagar o curso "${nome}"? Essa ação não poderá ser desfeita.`);
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "X-Usuario": usuario
        }
      });
      if (!res.ok) throw new Error();

      toast.success(`Curso "${nome}" removido por ${usuario}`);
      carregarCursos();
    } catch {
      toast.error("Erro ao apagar curso");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Cursos Disponíveis</h1>
      {erro && <p className="text-red-600 text-center">{erro}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {cursos.map((curso, index) => {
          const status = verificarStatus(curso.data);
          const podeInscrever = vagasAbertas(curso) && status === "Inscrições abertas";
          return (
            <div key={index} className="border p-4 rounded shadow-md bg-white relative">
              <h2 className="text-lg font-semibold mb-2">{curso.nome}</h2>
              <p><strong>Professor:</strong> {curso.professor}</p>
              <p><strong>Início:</strong> {formatarData(curso.data)}</p>
              <p><strong>Carga horária:</strong> {curso.cargaHoraria}h</p>
              <p><strong>Certificado:</strong> {curso.certificado}</p>
              <p><strong>Vagas:</strong> {curso.vagasPreenchidas ?? 0}/{curso.vagasTotais ?? 0}</p>
              <p className={`font-semibold ${podeInscrever ? "text-green-600" : "text-red-600"}`}>
                {podeInscrever ? "Vagas abertas" : "Encerradas"}
              </p>
              {podeInscrever ? (
                <Link
                  to={`/cursos/${curso.id}`}
                  className="block text-center mt-3 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                >
                  Inscrever-se
                </Link>
              ) : (
                <button
                  disabled
                  className="block w-full text-center mt-3 py-2 rounded text-white bg-gray-400 cursor-not-allowed"
                >
                  Indisponível
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => apagarCurso(curso.id, curso.nome)}
                  className="absolute top-2 right-2 text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Apagar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
