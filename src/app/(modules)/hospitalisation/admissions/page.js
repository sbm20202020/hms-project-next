"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import Modal from "../../../../components/ui/modal"
import { UserPlus, Search, Clock, AlertCircle, CheckCircle, Eye, Edit } from "lucide-react"

export default function AdmissionsPage() {
  const [showAdmissionModal, setShowAdmissionModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAdmission, setSelectedAdmission] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Données simulées des admissions
  const admissions = [
    {
      id: 1,
      patient: "Starly Beloved",
      patientId: "P001",
      dateAdmission: "2025-01-13",
      heureAdmission: "14:30",
      service: "Médecine Interne",
      chambre: "101",
      lit: "A",
      medecin: "Dr. Martin",
      motif: "Pneumonie",
      statut: "En attente",
      urgence: "Normale",
      assurance: "CNSS",
    },
    {
      id: 2,
      patient: "Jean Kouassi",
      patientId: "P002",
      dateAdmission: "2025-01-13",
      heureAdmission: "16:45",
      service: "Chirurgie",
      chambre: "205",
      lit: "B",
      medecin: "Dr. Bamba",
      motif: "Appendicectomie",
      statut: "Admis",
      urgence: "Urgente",
      assurance: "Privé",
    },
  ]

  const handleAdmission = (formData) => {
    console.log("Nouvelle admission:", formData)
    setShowAdmissionModal(false)
  }

  const handleViewDetails = (admission) => {
    setSelectedAdmission(admission)
    setShowDetailsModal(true)
  }

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || admission.statut.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (statut) => {
    switch (statut) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Admis":
        return "bg-green-100 text-green-800"
      case "Refusé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgenceColor = (urgence) => {
    switch (urgence) {
      case "Urgente":
        return "bg-red-100 text-red-800"
      case "Normale":
        return "bg-blue-100 text-blue-800"
      case "Programmée":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Admissions</h1>
            <p className="text-gray-600 mt-1">Gestion des admissions hospitalières</p>
          </div>
          <Button
            onClick={() => setShowAdmissionModal(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvelle Admission
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admissions Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admis</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgences</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou ID patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="admis">Admis</option>
                <option value="refusé">Refusé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des admissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre/Lit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médecin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmissions.map((admission) => (
                  <tr key={admission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admission.patient}</div>
                        <div className="text-sm text-gray-500">{admission.patientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admission.dateAdmission}</div>
                      <div className="text-sm text-gray-500">{admission.heureAdmission}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admission.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admission.chambre} - {admission.lit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admission.medecin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admission.statut)}`}
                      >
                        {admission.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgenceColor(admission.urgence)}`}
                      >
                        {admission.urgence}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(admission)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale nouvelle admission */}
        <Modal
          isOpen={showAdmissionModal}
          onClose={() => setShowAdmissionModal(false)}
          title="Nouvelle Admission"
          size="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleAdmission(Object.fromEntries(formData))
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <Input name="patient" placeholder="Nom du patient" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Patient</label>
                <Input name="patientId" placeholder="P001" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'admission</label>
                <Input name="dateAdmission" type="date" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'admission</label>
                <Input name="heureAdmission" type="time" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  name="service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un service</option>
                  <option value="Médecine Interne">Médecine Interne</option>
                  <option value="Chirurgie">Chirurgie</option>
                  <option value="Pédiatrie">Pédiatrie</option>
                  <option value="Gynécologie">Gynécologie</option>
                  <option value="Cardiologie">Cardiologie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
                <select
                  name="medecin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un médecin</option>
                  <option value="Dr. Martin">Dr. Martin</option>
                  <option value="Dr. Bamba">Dr. Bamba</option>
                  <option value="Dr. Kouame">Dr. Kouame</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif d'admission</label>
              <textarea
                name="motif"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Décrivez le motif d'admission..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
                <select
                  name="urgence"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="Normale">Normale</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Programmée">Programmée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assurance</label>
                <select
                  name="assurance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="CNSS">CNSS</option>
                  <option value="Privé">Privé</option>
                  <option value="Mutuelle">Mutuelle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chambre préférée</label>
                <Input name="chambre" placeholder="101" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAdmissionModal(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer l'admission</Button>
            </div>
          </form>
        </Modal>

        {/* Modale détails admission */}
        {selectedAdmission && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Détails de l'admission"
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.patient}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Patient</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'admission</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.dateAdmission}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure d'admission</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.heureAdmission}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.service}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Médecin</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.medecin}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Motif d'admission</label>
                <p className="text-sm text-gray-900">{selectedAdmission.motif}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAdmission.statut)}`}
                  >
                    {selectedAdmission.statut}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urgence</label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgenceColor(selectedAdmission.urgence)}`}
                  >
                    {selectedAdmission.urgence}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assurance</label>
                  <p className="text-sm text-gray-900">{selectedAdmission.assurance}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}
