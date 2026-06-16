"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdvancedTable from "@/components/ui/advanced-table"
import Modal from "@/components/ui/modal"
import { CreditCard, Euro, FileText, CheckCircle, AlertCircle, Eye } from "lucide-react"

export default function CaissePage() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    fetchFactures()
  }, [])

  const fetchFactures = async () => {
    try {
      const response = await fetch("/api/factures")
      const data = await response.json()
      setFactures(data)
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error)
    } finally {
      setLoading(false)
    }
  }

  const todayStats = {
    totalInvoices: factures.length,
    pendingValidation: factures.filter((inv) => inv.statut === "En attente").length,
    validated: factures.filter((inv) => inv.statut === "Validée").length,
    paid: factures.filter((inv) => inv.statut === "Payée").length,
    totalAmount: factures.reduce((sum, inv) => sum + inv.montantTotal, 0),
    paidAmount: factures.filter((inv) => inv.statut === "Payée").reduce((sum, inv) => sum + inv.montantTotal, 0),
  }

  const columns = [
    {
      key: "numeroFacture",
      header: "N° Facture",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{new Date(row.dateFacture).toLocaleDateString("fr-FR")}</div>
        </div>
      ),
    },
    {
      key: "patientNom",
      header: "Patient",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Nom du patient",
    },
    {
      key: "typeAssurance",
      header: "Assurance",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Type d'assurance",
      render: (value) => <Badge variant={value === "CNSS" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "statut",
      header: "Statut",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Statut de la facture",
      render: (value) => {
        const colors = {
          "En attente": "bg-orange-100 text-orange-800",
          Validée: "bg-blue-100 text-blue-800",
          Payée: "bg-green-100 text-green-800",
        }
        return <Badge className={colors[value]}>{value}</Badge>
      },
    },
    {
      key: "montantTotal",
      header: "Montant",
      sortable: true,
      render: (value) => <div className="font-semibold text-right">{value.toLocaleString("fr-FR")} FCFA</div>,
    },
    {
      key: "methodePaiement",
      header: "Paiement",
      filterable: true,
      filterLabel: "Méthode de paiement",
      render: (value) => value || "Non payé",
    },
  ]

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        setSelectedInvoice(row)
        setShowInvoiceModal(true)
      },
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row) => {
        if (row.statut === "En attente") {
          setSelectedInvoice(row)
          setShowValidationModal(true)
        } else if (row.statut === "Validée") {
          setSelectedInvoice(row)
          setShowPaymentModal(true)
        }
      },
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des factures...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Caisse</h1>
            <p className="text-gray-600">Validation et encaissement des factures</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowNewInvoiceModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Facture
            </Button>
            <Button onClick={() => setShowDirectPaymentModal(true)}>
              <CreditCard className="w-4 h-4 mr-2" />
              Paiement Direct
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Factures</p>
                  <p className="text-2xl font-bold">{todayStats.totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">À Valider</p>
                  <p className="text-2xl font-bold">{todayStats.pendingValidation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Validées</p>
                  <p className="text-2xl font-bold">{todayStats.validated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Encaissé</p>
                  <p className="text-2xl font-bold">{todayStats.paidAmount.toLocaleString("fr-FR")} FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AdvancedTable
          title="Gestion des Factures"
          data={factures}
          columns={columns}
          actions={actions}
          searchable={true}
          filterable={true}
          sortable={true}
          groupable={true}
          exportable={true}
          pageSize={10}
        />

        {/* ... existing modals ... */}
        <Modal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          title="Validation de Facture"
          size="lg"
        >
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-lg">{selectedInvoice.patientNom}</h4>
                <p className="text-sm text-gray-600">Facture: {selectedInvoice.numeroFacture}</p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedInvoice.dateFacture).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Services facturés :</h5>
                {selectedInvoice.services?.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{service.nom}</span>
                    </div>
                    <div className="font-medium">{service.prix.toLocaleString("fr-FR")} FCFA</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total à valider :</span>
                  <span className="text-xl font-bold text-blue-600">
                    {selectedInvoice.montantTotal.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowValidationModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => setShowValidationModal(false)} className="flex-1">
                  Valider la Facture
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* ... other existing modals ... */}
      </div>
    </DashboardLayout>
  )
}
