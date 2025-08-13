import DashboardLayout from "@/components/dashboard-layout"

export default function LaboratoirePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratoire</h1>
          <p className="text-gray-600">Gestion des examens de laboratoire et résultats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveaux Examens</h3>
            <p className="text-gray-600 mb-4">Programmer un examen de laboratoire</p>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Programmer Examen
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats Disponibles</h3>
            <p className="text-gray-600 mb-4">Consulter les résultats d'examens</p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Voir Résultats
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Examens en Cours</h3>
            <p className="text-gray-600 mb-4">Suivi des examens en cours</p>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Suivre Examens
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
