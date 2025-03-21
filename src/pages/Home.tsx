import InscricaoForm from "../components/forms/InscricaoForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Inscrição TVTEC</h1>
        <InscricaoForm />
      </div>
    </div>
  );
}
