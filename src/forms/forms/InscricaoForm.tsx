import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validarCPF } from "../../utils/cpfUtils";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://cursos-tv.onrender.com/aluno";
const CURSO_API = "https://cursos-tv.onrender.com/curso";

export default function InscricaoForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const cursoPreSelecionado = location.state?.cursoPreSelecionado || "";

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    curso: cursoPreSelecionado,
    sexo: "", // Alterado de "genero" para "sexo" conforme esperado pelo backend
    dataNascto: "", // Alterado de "nascimento" para "dataNascto" conforme esperado pelo backend
    telefone: "",
  });

  const [cursos, setCursos] = useState<any[]>([]);
  const [erros, setErros] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(CURSO_API)
      .then((res) => res.json())
      .then((data) => {
        console.log("Cursos carregados:", data);
        setCursos(data);
      })
      .catch(() => toast.error("Erro ao carregar cursos", { position: "top-center" }));
  }, []);

  useEffect(() => {
    if (cursoPreSelecionado) {
      setForm((prev) => ({ ...prev, curso: cursoPreSelecionado }));
    }
  }, [cursoPreSelecionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const formatarData = (dataISO: string): string => {
    // Converter formato yyyy-MM-dd para dd/MM/yyyy
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const validar = () => {
    const novosErros: any = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!form.cpf.trim()) novosErros.cpf = "CPF é obrigatório";
    else if (!validarCPF(form.cpf)) novosErros.cpf = "CPF inválido";
    if (!form.email.trim()) novosErros.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novosErros.email = "Email inválido";
    if (!form.curso) novosErros.curso = "Selecione um curso";
    if (!form.sexo) novosErros.sexo = "Selecione o sexo"; // Alterado de "genero" para "sexo"
    if (!form.dataNascto) novosErros.dataNascto = "Data de nascimento é obrigatória"; // Alterado de "nascimento" para "dataNascto"
    if (!form.telefone.trim()) novosErros.telefone = "Telefone celular é obrigatório";
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    
    setLoading(true);

    const cursoSelecionado = cursos.find((c: any) => c.nome === form.curso);
    if (!cursoSelecionado) {
      toast.error("Curso selecionado não encontrado", { position: "top-center" });
      setLoading(false);
      return;
    }

    console.log("Vagas do curso:", cursoSelecionado.vagasPreenchidas, "/", cursoSelecionado.vagasTotais);
    
    if (cursoSelecionado.vagasPreenchidas >= cursoSelecionado.vagasTotais) {
      toast.error("As vagas para este curso já foram preenchidas", { position: "top-center" });
      setLoading(false);
      return;
    }

    const agora = new Date();
    const data = agora.toISOString().slice(0, 10);
    const hora = agora.toTimeString().slice(0, 5);

    // Formatando a data de nascimento conforme esperado pelo backend (DD/MM/YYYY)
    const dataNasctoFormatada = formatarData(form.dataNascto);

    // Preparar dados conforme estrutura esperada pela API
    const dadosParaEnviar = {
      aluno: {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        sexo: form.sexo,
        telefone: form.telefone,
        dataNascto: dataNasctoFormatada
      },
      cursoId: cursoSelecionado.id
    };

    try {
      console.log("Enviando dados:", dadosParaEnviar);
      
      const res = await fetch(`${API_URL}/inscricao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (res.status === 409) {
        toast.error("CPF já cadastrado para este curso", { position: "top-center" });
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Erro ao salvar inscrição");

      localStorage.setItem("ultimaInscricaoData", data);
      localStorage.setItem("ultimaInscricaoHora", hora);
      toast.success("Inscrição enviada com sucesso!", { position: "top-center" });
      setTimeout(() => navigate("/confirmacao"), 2000);
    } catch (err) {
      toast.error("Erro ao enviar inscrição. Tente novamente.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.nome && <p className="text-red-600 text-sm mt-1">{erros.nome}</p>}
      </div>
      <div>
        <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.cpf && <p className="text-red-600 text-sm mt-1">{erros.cpf}</p>}
      </div>
      <div>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.email && <p className="text-red-600 text-sm mt-1">{erros.email}</p>}
      </div>
      <div>
        <select name="curso" value={form.curso} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecione o curso</option>
          {cursos.map((curso: any, index) => (
            <option 
              key={index} 
              value={curso.nome}
              disabled={curso.vagasPreenchidas >= curso.vagasTotais}
            >
              {curso.nome} {curso.vagasPreenchidas >= curso.vagasTotais ? '(SEM VAGAS)' : ''}
            </option>
          ))}
        </select>
        {erros.curso && <p className="text-red-600 text-sm mt-1">{erros.curso}</p>}
      </div>
      <div>
        <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecione o sexo</option>
          <option value="F">Feminino</option>
          <option value="M">Masculino</option>
          <option value="O">Outro</option>
        </select>
        {erros.sexo && <p className="text-red-600 text-sm mt-1">{erros.sexo}</p>}
      </div>
      <div>
        <input 
          type="date" 
          name="dataNascto" 
          value={form.dataNascto} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
        />
        {erros.dataNascto && <p className="text-red-600 text-sm mt-1">{erros.dataNascto}</p>}
      </div>
      <div>
        <input type="tel" name="telefone" placeholder="Telefone celular" value={form.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.telefone && <p className="text-red-600 text-sm mt-1">{erros.telefone}</p>}
      </div>
      <button 
        type="submit" 
        className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white py-2 rounded`}
        disabled={loading}
      >
        {loading ? "Processando..." : "Inscrever-se"}
      </button>
      <ToastContainer autoClose={3000} hideProgressBar newestOnTop theme="colored" />
    </form>
  );
}