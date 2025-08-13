"use client"

import { useState } from "react"
import DashboardLayout from "../../../components/dashboard-layout"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import Modal from "../../../components/ui/modal"
import { ArrowRightLeft, Clock, CheckCircle, Search, Plus, AlertCircle } from "lucide-react"

export default function TransfertsPage() {
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Données simulées des transferts
  const transfers = [
    {
      id: 1,
      patientName: "Marie Dubois",
      patientId: "P001",
      fromService: "Urgences",
      toService: "Cardiologie",
      fromRoom: "Urg-01",
      toRoom: "Ch-201",
      requestDate: "2024-01-15 14:30",
      requestedBy: "Dr. Martin",
      reason: "Stabilisation cardiaque",
      status: "pending",
      priority: "urgent",
    },
    {
      id: 2,
      patientName: "Jean Kouassi",
      patientId: "P002",
      fromService: "Chirurgie",
      toService: "Réanimation",
      fromRoom: "Ch-305",
      toRoom: "Rea-02",
      requestDate: "2024-01-15 16:45",
      requestedBy: "Dr. Bamba",
      reason: "Surveillance post-opératoire",
      status: "approved",
      priority: "high",
    },
    {
      id: 3,
      patientName: "Fatou Traoré",
      patientId: "P003",
      fromService: "Maternité",
      toService: "Pédiatrie",
      fromRoom: "Mat-12",
      toRoom: "Ped-08",
      requestDate: "2024-01-15 10:15",
      requestedBy: "Dr. Kone",
      reason: "Suivi nouveau-né",
      status: "completed",
      priority: "normal",
    },
  ]

  const stats = [
    {
      title: "Transferts Aujourd'hui",
      value: "12",
      icon: ArrowRightLeft,
      change: "+3",
      color: "text-blue-600",
    },
    {
      title: "En Attente",
      value: "5",
      icon: Clock,
      change: "+1",
      color: "text-orange-600",
    },
    {
      title: "Approuvés",
      value: "4",
      icon: CheckCircle,
      change: "+2",
      color: "text-green-600",
    },
    {
      title: "Urgents",
      value: "2",
      icon: AlertCircle,
      change: "0",
      color: "text-red-600",
    },
  ]

  const services = [
    "Urgences",
    "Cardiologie",
    "Chirurgie",
    "Réanimation",
    "Pédiatrie",
    "Maternité",
    "Orthopédie",
    "Neurologie",
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "En attente", className: "bg-orange-100 text-orange-800" },
      approved: { label: "Approuvé", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-800" },
      rejected: { label: "Refusé", className: "bg-red-100 text-red-800" },
    }
    return statusConfig[status] || statusConfig.pending
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { label: "Urgent", className: "bg-red-100 text-red-800" },
      high: { label: "Élevée", className: "bg-orange-100 text-orange-800" },
      normal: { label: "Normale", className: "bg-gray-100 text-gray-800" },
    }
    return priorityConfig[priority] || priorityConfig.normal
  }

  const handleTransferAction = (transfer, action) => {
    setSelectedTransfer({ ...transfer, action })
    setShowTransferModal(true)
  }

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || transfer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transferts</h1>
            <p className="text-gray-600">Gestion des transferts entre services</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowTransferModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Transfert
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

        {/* Liste des transferts */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Demandes de Transfert</CardTitle>
                <CardDescription>Suivi des transferts entre services</CardDescription>
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
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="completed">Terminé</option>
                  <option value="rejected">Refusé</option>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Transfert</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Demandé par</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date/Heure</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Priorité</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{transfer.patientName}</p>
                          <p className="text-sm text-gray-500">{transfer.patientId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{transfer.fromService}</span>
                          <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 font-medium">{transfer.toService}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{transfer.fromRoom}</span>
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>{transfer.toRoom}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{transfer.requestedBy}</td>
                      <td className="py-3 px-4 text-gray-900">{transfer.requestDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityBadge(transfer.priority).className}>
                          {getPriorityBadge(transfer.priority).label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadge(transfer.status).className}>
                          {getStatusBadge(transfer.status).label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {transfer.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleTransferAction(transfer, "approve")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTransferAction(transfer, "reject")}
                              >
                                Refuser
                              </Button>
                            </>
                          )}
                          {transfer.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleTransferAction(transfer, "complete")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Effectuer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de transfert */}
        <Modal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          title={selectedTransfer ? "Action sur Transfert" : "Nouveau Transfert"}
          size="lg"
        >
          <div className="space-y-4">
            {selectedTransfer ? (
              // Action sur transfert existant
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{selectedTransfer.patientName}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedTransfer.fromService} → {selectedTransfer.toService}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Commentaire sur l'action..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Confirmer</Button>
                </div>
              </>
            ) : (
              // Nouveau transfert
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Rechercher patient..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="normal">Normale</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service actuel</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service de destination</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motif du transfert</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Raison du transfert..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Demander Transfert</Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
