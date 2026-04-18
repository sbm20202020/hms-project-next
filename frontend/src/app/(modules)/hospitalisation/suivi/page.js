"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import Modal from "../../../../components/ui/modal"
import { FileText, Users, Activity, Calendar, Search, Plus, Eye, Edit } from "lucide-react"

export default function SuiviPage() {
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterService, setFilterService] = useState("all")

  // Données simulées des patients hospitalisés
  const hospitalizedPatients = [
    {
      id: 1,
      name: "Marie Dubois",
      age: 45,
      room: "Ch-201",
      service: "Cardiologie",
      admissionDate: "2024-01-10",
      diagnosis: "Infarctus du myocarde",
      doctor: "Dr. Martin",
      condition: "stable",
      lastVitals: {
        temperature: "37.2°C",
        bloodPressure: "120/80",
        heartRate: "75 bpm",
        oxygen: "98%",
      },
      prescriptions: [
        { medication: "Aspirine", dosage: "100mg", frequency: "1x/jour" },
        { medication: "Lisinopril", dosage: "10mg", frequency: "1x/jour" },
      ],
      notes: "Patient stable, amélioration progressive",
    },
    {
      id: 2,
      name: "Jean Kouassi",
      age: 62,
      room: "Ch-305",
      service: "Orthopédie",
      admissionDate: "2024-01-08",
      diagnosis: "Fracture du fémur",
      doctor: "Dr. Bamba",
      condition: "improving",
      lastVitals: {
        temperature: "36.8°C",
        bloodPressure: "130/85",
        heartRate: "68 bpm",
        oxygen: "97%",
      },
      prescriptions: [
        { medication: "Tramadol", dosage: "50mg", frequency: "3x/jour" },
        { medication: "Calcium", dosage: "500mg", frequency: "2x/jour" },
      ],
      notes: "Rééducation en cours, mobilité améliorée",
    },
  ]

  const stats = [
    {
      title: "Patients Hospitalisés",
      value: "24",
      icon: Users,
      change: "+2",
      color: "text-blue-600",
    },
    {
      title: "État Critique",
      value: "3",
      icon: Activity,
      change: "-1",
      color: "text-red-600",
    },
    {
      title: "Prescriptions Actives",
      value: "48",
      icon: FileText,
      change: "+5",
      color: "text-green-600",
    },
    {
      title: "Consultations Prévues",
      value: "12",
      icon: Calendar,
      change: "+3",
      color: "text-orange-600",
    },
  ]

  const services = ["Cardiologie", "Orthopédie", "Chirurgie", "Réanimation", "Pédiatrie"]

  const getConditionBadge = (condition) => {
    const conditionConfig = {
      stable: { label: "Stable", className: "bg-green-100 text-green-800" },
      improving: { label: "En amélioration", className: "bg-blue-100 text-blue-800" },
      critical: { label: "Critique", className: "bg-red-100 text-red-800" },
      monitoring: { label: "Surveillance", className: "bg-orange-100 text-orange-800" },
    }
    return conditionConfig[condition] || conditionConfig.stable
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const handlePrescription = (patient) => {
    setSelectedPatient(patient)
    setShowPrescriptionModal(true)
  }

  const filteredPatients = hospitalizedPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = filterService === "all" || patient.service === filterService
    return matchesSearch && matchesService
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suivi Médical</h1>
            <p className="text-gray-600">Suivi des patients hospitalisés et prescriptions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowPrescriptionModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Prescription
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} vs hier</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Liste des patients */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Patients Hospitalisés</CardTitle>
                <CardDescription>Suivi médical des patients en cours d'hospitalisation</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les services</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Chambre/Service</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Diagnostic</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">État</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Derniers Signes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.age} ans</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.room}</p>
                          <p className="text-sm text-gray-500">{patient.service}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{patient.doctor}</td>
                      <td className="py-3 px-4 text-gray-900">{patient.diagnosis}</td>
                      <td className="py-3 px-4">
                        <Badge className={getConditionBadge(patient.condition).className}>
                          {getConditionBadge(patient.condition).label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p>T: {patient.lastVitals.temperature}</p>
                          <p>TA: {patient.lastVitals.bloodPressure}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewPatient(patient)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePrescription(patient)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal détails patient */}
        <Modal isOpen={showPatientModal} onClose={() => setShowPatientModal(false)} title="Dossier Patient" size="xl">
          <div className="space-y-6">
            {selectedPatient && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-gray-600">
                        {selectedPatient.age} ans - {selectedPatient.room}
                      </p>
                      <p className="text-sm text-gray-500">Admis le {selectedPatient.admissionDate}</p>
                    </div>
                    <Badge className={getConditionBadge(selectedPatient.condition).className}>
                      {getConditionBadge(selectedPatient.condition).label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Signes Vitaux</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Température:</span>
                        <span className="font-medium">{selectedPatient.lastVitals.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tension:</span>
                        <span className="font-medium">{selectedPatient.lastVitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pouls:</span>
                        <span className="font-medium">{selectedPatient.lastVitals.heartRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturation:</span>
                        <span className="font-medium">{selectedPatient.lastVitals.oxygen}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Prescriptions Actives</h4>
                    <div className="space-y-2">
                      {selectedPatient.prescriptions.map((prescription, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes Médicales</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700">{selectedPatient.notes}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowPatientModal(false)}>
                    Fermer
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Modifier Dossier</Button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* Modal prescription */}
        <Modal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          title="Nouvelle Prescription"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Rechercher patient..."
                defaultValue={selectedPatient?.name || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Médicament</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du médicament"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: 100mg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>1x/jour</option>
                  <option>2x/jour</option>
                  <option>3x/jour</option>
                  <option>4x/jour</option>
                  <option>Au besoin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: 7 jours"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Instructions particulières..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPrescriptionModal(false)}>
                Annuler
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Ajouter Prescription</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
