"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import Modal from "../../../../components/ui/modal"
import { Bed, Search, Activity, FileText, Eye, Edit, AlertTriangle, CheckCircle } from "lucide-react"

export default function PatientsHospitalises() {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterService, setFilterService] = useState("all")

  // Données simulées des patients hospitalisés
  const patientsHospitalises = [
    {
      id: 1,
      nom: "Marie Dubois",
      patientId: "P001",
      age: 45,
      sexe: "F",
      chambre: "101",
      lit: "A",
      service: "Médecine Interne",
      medecin: "Dr. Martin",
      dateAdmission: "2025-01-10",
      diagnostic: "Pneumonie",
      etat: "Stable",
      traitement: "Antibiotiques, Repos",
      prochainExamen: "2025-01-14",
      assurance: "CNSS",
      accompagnant: "Jean Dubois (Époux)",
      telephone: "07 12 34 56 78",
    },
    {
      id: 2,
      nom: "Jean Kouassi",
      patientId: "P002",
      age: 32,
      sexe: "M",
      chambre: "205",
      lit: "B",
      service: "Chirurgie",
      medecin: "Dr. Bamba",
      dateAdmission: "2025-01-12",
      diagnostic: "Post-opératoire appendicectomie",
      etat: "En récupération",
      traitement: "Antalgiques, Surveillance",
      prochainExamen: "2025-01-15",
      assurance: "Privé",
      accompagnant: "Aya Kouassi (Épouse)",
      telephone: "05 98 76 54 32",
    },
  ]

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  const filteredPatients = patientsHospitalises.filter((patient) => {
    const matchesSearch =
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterService === "all" || patient.service === filterService
    return matchesSearch && matchesFilter
  })

  const getEtatColor = (etat) => {
    switch (etat) {
      case "Stable":
        return "bg-green-100 text-green-800"
      case "En récupération":
        return "bg-blue-100 text-blue-800"
      case "Critique":
        return "bg-red-100 text-red-800"
      case "En observation":
        return "bg-yellow-100 text-yellow-800"
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
            <h1 className="text-3xl font-bold text-gray-900 font-display">Patients Hospitalisés</h1>
            <p className="text-gray-600 mt-1">Suivi des patients actuellement hospitalisés</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bed className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hospitalisés</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">État Stable</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Observation</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">État Critique</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
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
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les services</option>
                <option value="Médecine Interne">Médecine Interne</option>
                <option value="Chirurgie">Chirurgie</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Gynécologie">Gynécologie</option>
                <option value="Cardiologie">Cardiologie</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre/Lit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médecin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnostic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée séjour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  const dureeSejourJours = Math.floor(
                    (new Date() - new Date(patient.dateAdmission)) / (1000 * 60 * 60 * 24),
                  )
                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.nom}</div>
                          <div className="text-sm text-gray-500">
                            {patient.patientId} • {patient.age} ans • {patient.sexe}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.chambre} - {patient.lit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.medecin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.diagnostic}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatColor(patient.etat)}`}
                        >
                          {patient.etat}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dureeSejourJours} jour{dureeSejourJours > 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(patient)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale détails patient */}
        {selectedPatient && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={`Dossier de ${selectedPatient.nom}`}
            size="xl"
          >
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations Patient</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-sm text-gray-900">{selectedPatient.nom}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Patient</label>
                      <p className="text-sm text-gray-900">{selectedPatient.patientId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Âge</label>
                        <p className="text-sm text-gray-900">{selectedPatient.age} ans</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sexe</label>
                        <p className="text-sm text-gray-900">{selectedPatient.sexe === "M" ? "Masculin" : "Féminin"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assurance</label>
                      <p className="text-sm text-gray-900">{selectedPatient.assurance}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hospitalisation</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Chambre/Lit</label>
                      <p className="text-sm text-gray-900">
                        {selectedPatient.chambre} - {selectedPatient.lit}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service</label>
                      <p className="text-sm text-gray-900">{selectedPatient.service}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Médecin responsable</label>
                      <p className="text-sm text-gray-900">{selectedPatient.medecin}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date d'admission</label>
                      <p className="text-sm text-gray-900">{selectedPatient.dateAdmission}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">État actuel</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatColor(selectedPatient.etat)}`}
                      >
                        {selectedPatient.etat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations médicales */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Médicales</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diagnostic</label>
                    <p className="text-sm text-gray-900">{selectedPatient.diagnostic}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Traitement en cours</label>
                    <p className="text-sm text-gray-900">{selectedPatient.traitement}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prochain examen</label>
                    <p className="text-sm text-gray-900">{selectedPatient.prochainExamen}</p>
                  </div>
                </div>
              </div>

              {/* Contact d'urgence */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact d'Urgence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Accompagnant</label>
                    <p className="text-sm text-gray-900">{selectedPatient.accompagnant}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedPatient.telephone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}
