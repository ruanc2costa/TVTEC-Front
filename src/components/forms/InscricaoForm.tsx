import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarCPF } from "../../utils/cpfUtils";

export default function InscricaoForm() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    curso: "",
    genero: "",
    nascimento: "",
  });
  const [erros, setErros] = useState<any>({});
  const navigate = useNavigate();

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
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const agora = new Date();
    const data = agora.toISOString().slice(0, 10);
    const hora = agora.toTimeString().slice(0, 5);

    localStorage.setItem("ultimaInscricaoData", data);
    localStorage.setItem("ultimaInscricaoHora", hora);

    navigate("/confirmacao");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input type="text" name="nome" placeholder="Nome completo" onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.nome && <p className="text-red-600 text-sm mt-1">{erros.nome}</p>}
      </div>
      <div>
        <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.cpf && <p className="text-red-600 text-sm mt-1">{erros.cpf}</p>}
      </div>
      <div>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.email && <p className="text-red-600 text-sm mt-1">{erros.email}</p>}
      </div>
      <div>
        <select name="curso" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecione o curso</option>
          <option value="foto">Fotografia</option>
          <option value="video">Vídeo</option>
          <option value="design">Design</option>
        </select>
        {erros.curso && <p className="text-red-600 text-sm mt-1">{erros.curso}</p>}
      </div>
      <div>
        <select name="genero" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecione o gênero</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="Outro">Outro</option>
          <option value="Prefiro não dizer">Prefiro não dizer</option>
        </select>
        {erros.genero && <p className="text-red-600 text-sm mt-1">{erros.genero}</p>}
      </div>
      <div>
        <input type="date" name="nascimento" placeholder="Data de nascimento" onChange={handleChange} className="w-full p-2 border rounded" />
        {erros.nascimento && <p className="text-red-600 text-sm mt-1">{erros.nascimento}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Inscrever-se</button>
    </form>
  );
}
