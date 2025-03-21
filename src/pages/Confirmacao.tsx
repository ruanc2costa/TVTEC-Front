import { useEffect, useState } from "react";

export default function Confirmacao() {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    setData(localStorage.getItem("ultimaInscricaoData") || "");
    setHora(localStorage.getItem("ultimaInscricaoHora") || "");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Inscrição Confirmada!</h1>
        <p className="text-gray-700 mb-2">Recebemos sua inscrição com sucesso.</p>
        <p className="text-gray-700">Data: <strong>{data}</strong></p>
        <p className="text-gray-700">Hora: <strong>{hora}</strong></p>
        <p className="text-sm text-gray-500 mt-2">Em breve você receberá mais informações por e-mail.</p>
      </div>
    </div>
  );
}
