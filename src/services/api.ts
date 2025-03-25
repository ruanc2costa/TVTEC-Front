const API_URL = "https://cursos-tv.onrender.com/aluno";

export async function listarInscricoes() {
  const res = await fetch(`${API_URL}/curso`);
  if (!res.ok) throw new Error("Erro ao buscar inscrições");
  return res.json();
}

export async function enviarInscricao(dados: any) {
  const res = await fetch(`${API_URL}/curso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao enviar inscrição");
  return res.json();
}

export async function enviarTermo(inscrito: any) {
  const res = await fetch(`${API_URL}/termo-menores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inscrito),
  });
  return res.ok;
}

export async function enviarCertificado(inscrito: any) {
  const res = await fetch(`${API_URL}/certificados/enviar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inscrito),
  });
  return res.ok;
}
