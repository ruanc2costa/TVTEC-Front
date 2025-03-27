import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Constante da URL da API (mantida para referência)
const API_URL = "https://cursos-tv.onrender.com/curso";

// Serviço de API que contorna o problema de CORS
const apiService = {
  // Função para verificar se estamos em ambiente de desenvolvimento
  isDevelopment: () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  },

  // Buscar todos os cursos
  getCursos: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      throw error;
    }
  },

  // Excluir um curso, contornando problema de CORS com cabeçalho X-Usuario
  deleteCurso: async (id: number, usuario: string) => {
    try {
      let url = `${API_URL}/${id}`;
      const options: RequestInit = {
        method: 'DELETE'
      };

      // Se estamos em desenvolvimento, usamos uma abordagem diferente para evitar o erro CORS
      if (apiService.isDevelopment()) {
        // Adicionar o usuário como parâmetro de consulta em vez de cabeçalho
        url = `${url}?usuario=${encodeURIComponent(usuario)}`;
        
        console.log(`Enviando requisição DELETE para ${url} (CORS contornado)`);
      } else {
        // Em produção, usamos o cabeçalho normalmente
        options.headers = {
          'X-Usuario': usuario
        };
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      throw error;
    }
  }
};

export default function CursosDisponiveis() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const usuario = localStorage.getItem("usuario") || "Administrador";

  const carregarCursos = async () => {
    setCarregando(true);
    try {
      const dados = await apiService.getCursos();
      setCursos(dados);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setErro("Erro ao carregar cursos");
    } finally {
      setCarregando(false);
    }
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
    const confirmado = window.confirm(`Tem certeza que deseja apagar o curso "${nome}"? Essa ação não poderá ser desfeita.`);
    if (!confirmado) return;

    try {
      setCarregando(true);
      
      // Usar o serviço de API que contorna o problema de CORS
      await apiService.deleteCurso(id, usuario);
      
      toast.success(`Curso "${nome}" removido por ${usuario}`);
      await carregarCursos();
    } catch (error) {
      console.error("Erro ao apagar curso:", error);
      toast.error("Erro ao apagar curso");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Cursos Disponíveis</h1>
      {erro && <p className="text-red-600 text-center">{erro}</p>}
      
      {carregando && <p className="text-center my-4">Carregando cursos...</p>}

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
                  disabled={carregando}
                >
                  {carregando ? "..." : "Apagar"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}