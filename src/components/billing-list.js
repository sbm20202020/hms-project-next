"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Search, Eye, Edit, Download, User, Calendar, Euro } from "lucide-react"

// Mock billing data
const mockBillings = [
  {
    id: "FAC-2024-001",
    numeroFacture: "FAC-2024-001",
    patient: "Marie Dubois",
    patientId: 1,
    dateFacture: "2024-01-20",
    dateEcheance: "2024-02-20",
    montantTotal: 1250.0,
    montantPaye: 1250.0,
    statut: "Payée",
    services: ["Consultation", "Radiographie", "Chambre Standard"],
    medecin: "Dr. Martin",
  },
  {
    id: "FAC-2024-002",
    numeroFacture: "FAC-2024-002",
    patient: "Jean Dupont",
    patientId: 2,
    dateFacture: "2024-01-22",
    dateEcheance: "2024-02-22",
    montantTotal: 850.0,
    montantPaye: 0.0,
    statut: "En Attente",
    services: ["Consultation", "Analyses"],
    medecin: "Dr. Leroy",
  },
  {
    id: "FAC-2024-003",
    numeroFacture: "FAC-2024-003",
    patient: "Sophie Bernard",
    patientId: 3,
    dateFacture: "2024-01-15",
    dateEcheance: "2024-02-15",
    montantTotal: 2100.0,
    montantPaye: 1000.0,
    statut: "Partiellement Payée",
    services: ["Chirurgie", "Chambre VIP", "Médicaments"],
    medecin: "Dr. Moreau",
  },
  {
    id: "FAC-2024-004",
    numeroFacture: "FAC-2024-004",
    patient: "Pierre Rousseau",
    patientId: 4,
    dateFacture: "2024-01-10",
    dateEcheance: "2024-02-10",
    montantTotal: 750.0,
    montantPaye: 0.0,
    statut: "En Retard",
    services: ["Consultation", "IRM"],
    medecin: "Dr. Petit",
  },
  {
    id: "FAC-2024-005",
    numeroFacture: "FAC-2024-005",
    patient: "Claire Moreau",
    patientId: 5,
    dateFacture: "2024-01-25",
    dateEcheance: "2024-02-25",
    montantTotal: 450.0,
    montantPaye: 0.0,
    statut: "Brouillon",
    services: ["Consultation"],
    medecin: "Dr. Martin",
  },
]

const statusColors = {
  Payée: "bg-green-100 text-green-800",
  "En Attente": "bg-yellow-100 text-yellow-800",
  "Partiellement Payée": "bg-blue-100 text-blue-800",
  "En Retard": "bg-red-100 text-red-800",
  Brouillon: "bg-gray-100 text-gray-800",
  Annulée: "bg-gray-100 text-gray-800",
}

export default function BillingList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredBillings = mockBillings.filter((billing) => {
    const matchesSearch =
      billing.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.medecin.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || billing.statut === statusFilter

    const today = new Date()
    const billDate = new Date(billing.dateFacture)
    let matchesDate = true

    if (dateFilter === "thisMonth") {
      matchesDate = billDate.getMonth() === today.getMonth() && billDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === "lastMonth") {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      matchesDate = billDate.getMonth() === lastMonth.getMonth() && billDate.getFullYear() === lastMonth.getFullYear()
    } else if (dateFilter === "overdue") {
      const dueDate = new Date(billing.dateEcheance)
      matchesDate = dueDate < today && billing.statut !== "Payée"
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle>Liste des Factures</CardTitle>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Payée">Payée</SelectItem>
                <SelectItem value="En Attente">En Attente</SelectItem>
                <SelectItem value="Partiellement Payée">Partiellement Payée</SelectItem>
                <SelectItem value="En Retard">En Retard</SelectItem>
                <SelectItem value="Brouillon">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="thisMonth">Ce mois</SelectItem>
                <SelectItem value="lastMonth">Mois dernier</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBillings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune facture trouvée</p>
          ) : (
            filteredBillings
              .sort((a, b) => new Date(b.dateFacture) - new Date(a.dateFacture))
              .map((billing) => (
                <div
                  key={billing.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="flex items-center space-x-3">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{billing.numeroFacture}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(billing.dateFacture).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{billing.patient}</p>
                        <p className="text-sm text-muted-foreground">{billing.medecin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">Échéance</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(billing.dateEcheance).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{billing.montantTotal.toFixed(2)}€</p>
                      {billing.montantPaye > 0 && billing.montantPaye < billing.montantTotal && (
                        <p className="text-sm text-muted-foreground">Payé: {billing.montantPaye.toFixed(2)}€</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {billing.services.slice(0, 2).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {billing.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{billing.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={statusColors[billing.statut]}>{billing.statut}</Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/billing/${billing.id}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/billing/${billing.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
