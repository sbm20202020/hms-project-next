import DashboardLayout from "@/components/dashboard-layout"

export default function ImageriePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imagerie Médicale</h1>
          <p className="text-gray-600">Gestion des examens radiologiques et d'imagerie</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Radiographie</h3>
            <p className="text-gray-600 mb-4">Examens radiographiques</p>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Programmer Radio
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Échographie</h3>
            <p className="text-gray-600 mb-4">Examens échographiques</p>
            <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Programmer Echo
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanner/IRM</h3>
            <p className="text-gray-600 mb-4">Examens avancés</p>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Programmer
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
