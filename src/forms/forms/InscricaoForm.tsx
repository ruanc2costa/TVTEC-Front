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
    genero: "",
    nascimento: "",
    telefone: "",  // Adicionando telefone celular
  });

  const [cursos, setCursos] = useState<any[]>([]);
  const [erros, setErros] = useState<any>({});

  useEffect(() => {
    fetch(CURSO_API)
      .then((res) => res.json())
      .then((data) => {
        console.log("Cursos carregados:", data); // Log de cursos para verificar
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

  const validar = () => {
    const novosErros: any = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!form.cpf.trim()) novosErros.cpf = "CPF é obrigatório";
    else if (!validarCPF(form.cpf)) novosErros.cpf = "CPF inválido";
    if (!form.email.trim()) novosErros.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novosErros.email = "Email inválido";
    if (!form.curso) novosErros.curso = "Selecione um curso";
    if (!form.genero) novosErros.genero = "Selecione o gênero";
    if (!form.nascimento) novosErros.nascimento = "Data de nascimento é obrigatória";
    if (!form.telefone.trim()) novosErros.telefone = "Telefone celular é obrigatório"; // Validando telefone celular
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const cursoSelecionado = cursos.find((c: any) => c.nome === form.curso);
    if (!cursoSelecionado) {
      toast.error("Curso selecionado não encontrado", { position: "top-center" });
      return;
    }

    // Log para verificar as vagas antes da comparação
    console.log("Vagas do curso:", cursoSelecionado.vagasPreenchidas, "/", cursoSelecionado.vagasTotais);  // Log de depuração
    
    // Verificar se as vagas ainda estão disponíveis
    if (cursoSelecionado.vagasPreenchidas >= cursoSelecionado.vagasTotais) {
      toast.error("As vagas para este curso já foram preenchidas", { position: "top-center" });
      return;
    }

    const agora = new Date();
    const data = agora.toISOString().slice(0, 10);
    const hora = agora.toTimeString().slice(0, 5);

    const inscricaoCompleta = {
      ...form,
      data,
      hora,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inscricaoCompleta),
      });

      if (res.status === 409) {
        toast.error("CPF já cadastrado para este curso", { position: "top-center" });
        return;
      }

      if (!res.ok) throw new Error("Erro ao salvar inscrição");

      localStorage.setItem("ultimaInscricaoData", data);
      localStorage.setItem("ultimaInscricaoHora", hora);
      toast.success("Inscrição enviada com sucesso!", { position: "top-center" });
      setTimeout(() => navigate("/confirmacao"), 2000);
    } catch (err) {
      toast.error("Erro ao enviar inscrição. Tente novamente.", { position: "top-center" });
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
            <option key={index} value={curso.nome}>{curso.nome}</option>
          ))}
        </select>
        {erros.curso && <p className="text-red-600 text-sm mt-1">{erros.curso}</p>}
      </div>
      <div>
        <select name="genero" value={form.genero} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecione o gênero</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="Outro">Outro</option>
          <option value="Prefiro não dizer">Prefiro não informar</option>
        </select>
        {erros.genero && <p className="text-red-600 text-sm mt-1">{erros.genero}</p>}
      </div>
      <div>
        <input type="date" name="nascimento" value={form.nascimento} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.nascimento && <p className="text-red-600 text-sm mt-1">{erros.nascimento}</p>}
      </div>
      <div>
        <input type="tel" name="telefone" placeholder="Telefone celular" value={form.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.telefone && <p className="text-red-600 text-sm mt-1">{erros.telefone}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Inscrever-se</button>
      <ToastContainer autoClose={3000} hideProgressBar newestOnTop theme="colored" />
    </form>
  );
}
