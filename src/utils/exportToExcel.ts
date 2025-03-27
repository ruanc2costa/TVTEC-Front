import * as XLSX from "xlsx";

export function exportToExcel(data: any[], fileName = "inscricoes") {
  const formatados = data.map(item => ({
    Nome: item.nome,
    Email: item.email,
    Curso: item.curso,
    Data: item.data,
    Hora: item.hora,
    Gênero: item.genero,
    "Data de Nascimento": item.nascimento,
    Idade: calcularIdade(item.nascimento),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}
