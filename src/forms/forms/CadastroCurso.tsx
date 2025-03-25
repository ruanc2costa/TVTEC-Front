import { useState } from "react";

const API_URL = "https://cursos-tv.onrender.com/curso";

export default function CadastroCurso() {
  const [form, setForm] = useState({
    nome: "",
    professor: "",
    dataInicio: "",
    dataFim: "",
    cargaHoraria: "",
    certificado: "",
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cargaHoraria: parseInt(form.cargaHoraria),
        }),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar curso");
      setMensagem("Curso cadastrado com sucesso!");
      setForm({ nome: "", professor: "", dataInicio: "", dataFim: "", cargaHoraria: "", certificado: "" });
    } catch (err) {
      setMensagem("Erro ao cadastrar curso. Tente novamente.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Curso</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome do curso"
          value={form.nome}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="professor"
          placeholder="Professor responsável"
          value={form.professor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="dataInicio"
          value={form.dataInicio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="dataFim"
          value={form.dataFim}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="cargaHoraria"
          placeholder="Carga horária (em horas)"
          value={form.cargaHoraria}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          min={1}
        />
        <input
          type="text"
          name="certificado"
          placeholder="Nome do certificado (ex: certificado-foto.pdf)"
          value={form.certificado}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Cadastrar Curso
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center font-semibold text-green-700">{mensagem}</p>}
    </div>
  );
}
