import { useState, useEffect } from "react";
import { exportToExcel } from "../utils/exportToExcel";
import { useNavigate } from "react-router-dom";
import { listarInscricoes } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function calcularIdade(dataNascimento: string) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export default function Admin() {
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroFaixaEtaria, setFiltroFaixaEtaria] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    listarInscricoes().then(setInscritos).catch(() => toast.error("Erro ao carregar dados"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const inscritosFiltrados = inscritos.filter((inscrito) => {
    const idade = calcularIdade(inscrito.nascimento);
    const faixaEtariaValida =
      filtroFaixaEtaria === ""
        || (filtroFaixaEtaria === "18-25" && idade >= 18 && idade <= 25)
        || (filtroFaixaEtaria === "26-35" && idade >= 26 && idade <= 35)
        || (filtroFaixaEtaria === "36+" && idade >= 36);

    return (
      (filtroCurso ? inscrito.curso === filtroCurso : true) &&
      (filtroGenero ? inscrito.genero === filtroGenero : true) &&
      faixaEtariaValida
    );
  });

  const totalPaginas = Math.ceil(inscritosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paginaAtualDados = inscritosFiltrados.slice(inicio, fim);

  const menoresDeIdade = inscritosFiltrados.filter(inscrito => {
    const idade = calcularIdade(inscrito.nascimento);
    return idade === 16 || idade === 17;
  });

  const enviarTermoAutorizacao = () => {
    if (menoresDeIdade.length === 0) {
      toast.info("Nenhum menor de idade encontrado.");
    } else {
      toast.success(`Enviar termo para: ${menoresDeIdade.map(p => p.nome).join(", ")}`);
    }
  };

  const exportar = () => {
    exportToExcel(inscritosFiltrados, "inscricoes-filtradas");
    toast.success("Exportação concluída!");
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto">
          Sair
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
        <div>
          <label className="mr-2 font-semibold">Curso:</label>
          <select className="border p-2 rounded" value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos</option>
            <option value="Vídeo">Vídeo</option>
            <option value="Fotografia">Fotografia</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Gênero:</label>
          <select className="border p-2 rounded" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
            <option value="">Todos</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não dizer">Prefiro não dizer</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Faixa Etária:</label>
          <select className="border p-2 rounded" value={filtroFaixaEtaria} onChange={(e) => setFiltroFaixaEtaria(e.target.value)}>
            <option value="">Todas</option>
            <option value="18-25">18 a 25</option>
            <option value="26-35">26 a 35</option>
            <option value="36+">36 ou mais</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nome</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Curso</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Hora</th>
              <th className="border p-2">Gênero</th>
              <th className="border p-2">Nascimento</th>
              <th className="border p-2">Idade</th>
            </tr>
          </thead>
          <tbody>
            {paginaAtualDados.map((inscrito, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{inscrito.nome}</td>
                <td className="border p-2">{inscrito.email}</td>
                <td className="border p-2">{inscrito.curso}</td>
                <td className="border p-2">{inscrito.data}</td>
                <td className="border p-2">{inscrito.hora}</td>
                <td className="border p-2">{inscrito.genero}</td>
                <td className="border p-2">{inscrito.nascimento}</td>
                <td className="border p-2">{calcularIdade(inscrito.nascimento)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">Página {paginaAtual} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={exportar}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Exportar para Excel
        </button>

        <button
          onClick={enviarTermoAutorizacao}
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Enviar termo p/ menores de idade
        </button>
      </div>

      <ToastContainer autoClose={3000} hideProgressBar newestOnTop theme="colored" />
    </div>
  );
}
