import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CursoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState<any>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`https://cursos-tv.onrender.com/curso/${id}`)
      .then((res) => res.json())
      .then(setCurso)
      .catch(() => setErro("Erro ao carregar detalhes do curso"));
  }, [id]);

  if (erro) return <p className="text-red-600 text-center mt-4">{erro}</p>;
  if (!curso) return <p className="text-center mt-4">Carregando...</p>;

  const status = new Date() <= new Date(curso.data) ? "Inscrições abertas" : "Encerradas";
  const vagasRestantes = curso.vagasTotais - curso.vagasPreenchidas;

  const iniciarInscricao = () => {
    navigate("/", { state: { cursoPreSelecionado: curso.nome } });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">{curso.nome}</h1>
      <div className="space-y-2">
        <p><strong>Professor:</strong> {curso.professor}</p>
        <p><strong>Data:</strong> {new Date(curso.data).toLocaleDateString()}</p>
        <p><strong>Carga horária:</strong> {curso.cargaHoraria}h</p>
        <p><strong>Certificado:</strong> {curso.certificado}</p>
        <p><strong>Vagas:</strong> {curso.vagasPreenchidas}/{curso.vagasTotais}</p>
        <p className={`font-semibold ${status === "Inscrições abertas" ? "text-green-600" : "text-red-600"}`}>
          {status}
        </p>
      </div>
      {status === "Inscrições abertas" && (
        <button
          onClick={iniciarInscricao}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Iniciar inscrição
        </button>
      )}
    </div>
  );
}