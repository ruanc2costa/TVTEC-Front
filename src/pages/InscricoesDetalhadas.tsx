import { useEffect, useState } from "react";
import { exportToExcel } from "../utils/exportToExcel";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function InscricoesDetalhadas() {
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [enviado, setEnviado] = useState(false);
  const isAuthenticated = localStorage.getItem("auth") === "true";

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("https://cursos-tv.onrender.com/aluno")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInscricoes(data);
        } else {
          setInscricoes([]);
          toast.error("Resposta inesperada da API.");
        }
      })
      .catch(() => toast.error("Erro ao carregar inscrições"));
  }, [isAuthenticated]);

  const exportar = () => {
    if (inscricoes.length === 0) return toast.info("Nenhuma inscrição para exportar.");
    exportToExcel(inscricoes, "inscricoes-detalhadas");
    toast.success("Planilha gerada com sucesso!");
  };

  const enviarParaBanco = async () => {
    try {
      const res = await fetch("https://cursos-tv.onrender.com/relatorio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inscricoes),
      });
      if (!res.ok) throw new Error();
      toast.success("Inscrições enviadas para o banco com sucesso!");
      setEnviado(true);
    } catch {
      toast.error("Erro ao enviar dados para o banco.");
    }
  };

  if (!isAuthenticated) return <p className="text-center mt-10">Você precisa estar logado para visualizar.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Inscrições Detalhadas</h1>
        <div className="flex gap-3">
          <button onClick={exportar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Exportar Excel</button>
          <button
            onClick={enviarParaBanco}
            disabled={enviado}
            className={`px-4 py-2 rounded text-white ${enviado ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {enviado ? "Enviado ✔" : "Enviar para Banco"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">CPF</th>
              <th className="border p-2">Curso</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Nascimento</th>
              <th className="border p-2">Gênero</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map((aluno, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{aluno.nome}</td>
                <td className="border p-2">{aluno.cpf}</td>
                <td className="border p-2">{aluno.curso}</td>
                <td className="border p-2">{aluno.email}</td>
                <td className="border p-2">{aluno.nascimento}</td>
                <td className="border p-2">{aluno.genero}</td>
                <td className="border p-2">{aluno.data}</td>
                <td className="border p-2">{aluno.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer autoClose={3000} hideProgressBar newestOnTop theme="colored" />
    </div>
  );
}