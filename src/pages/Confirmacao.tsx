import { Link } from "react-router-dom";

export default function Confirmacao() {
  const data = localStorage.getItem("ultimaInscricaoData");
  const hora = localStorage.getItem("ultimaInscricaoHora");

  return (
    <div className="max-w-md mx-auto text-center py-10 px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Inscrição enviada com sucesso!
      </h1>

      {data && hora && (
        <p className="text-gray-700 mb-6">
          Recebemos sua inscrição no dia <strong>{data}</strong> às{" "}
          <strong>{hora}</strong>.
        </p>
      )}

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Fazer nova inscrição
      </Link>
    </div>
  );
}
