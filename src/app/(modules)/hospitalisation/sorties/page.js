"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import Modal from "../../../../components/ui/modal"
import { Users, Clock, TrendingUp, Search, FileText, CreditCard } from "lucide-react"

export default function SortiesPage() {
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Données simulées des patients prêts pour sortie
  const patientsForDischarge = [
    {
      id: 1,
      name: "Marie Dubois",
      age: 45,
      room: "Ch-201",
      service: "Cardiologie",
      admissionDate: "2024-01-10",
      diagnosis: "Infarctus du myocarde",
      doctor: "Dr. Martin",
      status: "ready",
      totalBill: 15000,
      insurance: "CNSS",
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
      status: "pending",
      totalBill: 25000,
      insurance: "Privé",
    },
    {
      id: 3,
      name: "Fatou Traoré",
      age: 28,
      room: "Ch-102",
      service: "Gynécologie",
      admissionDate: "2024-01-12",
      diagnosis: "Césarienne",
      doctor: "Dr. Kone",
      status: "discharged",
      totalBill: 12000,
      insurance: "CNSS",
    },
  ]

  const stats = [
    {
      title: "Sorties Aujourd'hui",
      value: "8",
      icon: Users,
      change: "+2",
      color: "text-green-600",
    },
    {
      title: "En Attente",
      value: "12",
      icon: Clock,
      change: "-1",
      color: "text-orange-600",
    },
    {
      title: "Factures Impayées",
      value: "5",
      icon: CreditCard,
      change: "+1",
      color: "text-red-600",
    },
    {
      title: "Durée Moyenne",
      value: "4.2j",
      icon: TrendingUp,
      change: "-0.3j",
      color: "text-blue-600",
    },
  ]

  const handleDischarge = (patient) => {
    setSelectedPatient(patient)
    setShowDischargeModal(true)
  }

  const handleBilling = (patient) => {
    setSelectedPatient(patient)
    setShowBillModal(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      ready: { label: "Prêt", className: "bg-green-100 text-green-800" },
      pending: { label: "En attente", className: "bg-orange-100 text-orange-800" },
      discharged: { label: "Sorti", className: "bg-gray-100 text-gray-800" },
    }
    return statusConfig[status] || statusConfig.pending
  }

  const filteredPatients = patientsForDischarge.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sorties</h1>
            <p className="text-gray-600">Gestion des sorties et décharges des patients</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowDischargeModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Sortie
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

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Patients à Sortir</CardTitle>
                <CardDescription>Liste des patients prêts pour la sortie</CardDescription>
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="ready">Prêt</option>
                  <option value="pending">En attente</option>
                  <option value="discharged">Sorti</option>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Chambre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Admission</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Facture</th>
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
                      <td className="py-3 px-4 text-gray-900">{patient.room}</td>
                      <td className="py-3 px-4 text-gray-900">{patient.service}</td>
                      <td className="py-3 px-4 text-gray-900">{patient.admissionDate}</td>
                      <td className="py-3 px-4 text-gray-900">{patient.doctor}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadge(patient.status).className}>
                          {getStatusBadge(patient.status).label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.totalBill.toLocaleString()} FCFA</p>
                          <p className="text-sm text-gray-500">{patient.insurance}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDischarge(patient)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Sortir
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleBilling(patient)}>
                            Facturer
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

        {/* Modal de sortie */}
        <Modal
          isOpen={showDischargeModal}
          onClose={() => setShowDischargeModal(false)}
          title="Sortie de Patient"
          size="lg"
        >
          <div className="space-y-4">
            {selectedPatient && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">
                    Chambre {selectedPatient.room} - {selectedPatient.service}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de sortie</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de sortie</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={new Date().toTimeString().slice(0, 5)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de sortie</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Guérison</option>
                    <option>Amélioration</option>
                    <option>Transfert</option>
                    <option>Sortie contre avis médical</option>
                    <option>Décès</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions de sortie</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Instructions pour le patient..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDischargeModal(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">Confirmer la Sortie</Button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* Modal de facturation */}
        <Modal isOpen={showBillModal} onClose={() => setShowBillModal(false)} title="Facturation de Sortie" size="lg">
          <div className="space-y-4">
            {selectedPatient && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">
                    Facture totale: {selectedPatient.totalBill.toLocaleString()} FCFA
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span>Hospitalisation (3 jours)</span>
                    <span>9,000 FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Consultations médicales</span>
                    <span>3,000 FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Examens et analyses</span>
                    <span>2,000 FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Médicaments</span>
                    <span>1,000 FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg border-t-2">
                    <span>Total</span>
                    <span>{selectedPatient.totalBill.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Espèces</option>
                      <option>Carte bancaire</option>
                      <option>Chèque</option>
                      <option>Virement</option>
                      <option>Assurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut assurance</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>CNSS (80%)</option>
                      <option>Privé (100%)</option>
                      <option>Mutuelle (90%)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowBillModal(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Générer Facture</Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
