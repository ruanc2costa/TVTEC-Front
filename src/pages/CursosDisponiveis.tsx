import { useEffect, useState } from "react";

const API_URL = "https://cursos-tv.onrender.com/curso";

export default function CursosDisponiveis() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setCursos)
      .catch(() => setErro("Erro ao carregar cursos"));
  }, []);

  const verificarStatus = (inicio: string) => {
    const hoje = new Date();
    const dataInicio = new Date(inicio);
    return hoje <= dataInicio ? "Inscrições abertas" : "Encerradas";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Cursos Disponíveis</h1>
      {erro && <p className="text-red-600 text-center">{erro}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {cursos.map((curso, index) => {
          const status = verificarStatus(curso.dataInicio);
          const vagasRestantes = curso.vagasTotais - curso.vagasPreenchidas;
          return (
            <div key={index} className="border p-4 rounded shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-2">{curso.nome}</h2>
              <p><strong>Professor:</strong> {curso.professor}</p>
              <p><strong>Início:</strong> {new Date(curso.dataInicio).toLocaleDateString()}</p>
              <p><strong>Fim:</strong> {new Date(curso.dataFim).toLocaleDateString()}</p>
              <p><strong>Carga horária:</strong> {curso.cargaHoraria}h</p>
              <p><strong>Certificado:</strong> {curso.certificado}</p>
              <p><strong>Vagas:</strong> {curso.vagasPreenchidas}/{curso.vagasTotais}</p>
              <p className={`font-semibold ${status === "Inscrições abertas" ? "text-green-600" : "text-red-600"}`}>
                {status}
              </p>
              {status === "Inscrições abertas" && (
                <a
                  href="/"
                  className="block text-center mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Inscrever-se
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
