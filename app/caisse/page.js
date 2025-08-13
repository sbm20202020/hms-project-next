"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { Search, CreditCard, Euro, Users, FileText, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"

export default function CaissePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)
  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")

  const allInvoices = [
    {
      id: 1,
      patient: "Marie Dubois",
      patientId: "P001",
      date: "2025-01-13",
      time: "09:30",
      acts: [
        { type: "Consultation générale", price: 45.0, validated: false },
        { type: "Prise de tension", price: 10.0, validated: true },
      ],
      total: 55.0,
      status: "pending_validation",
      isConventioned: false,
      doctor: "Dr. Martin",
      service: "Médecine générale",
    },
    {
      id: 2,
      patient: "Jean Martin",
      patientId: "P002",
      date: "2025-01-13",
      time: "10:15",
      acts: [
        { type: "Radiologie thorax", price: 120.0, validated: true },
        { type: "Analyse sang complète", price: 85.0, validated: true },
        { type: "Glycémie", price: 15.0, validated: true },
      ],
      total: 220.0,
      status: "validated",
      isConventioned: true,
      doctor: "Dr. Dubois",
      service: "Radiologie",
    },
    {
      id: 3,
      patient: "Sophie Laurent",
      patientId: "P003",
      date: "2025-01-13",
      time: "11:00",
      acts: [
        { type: "Prise de sang", price: 25.0, validated: true },
        { type: "Hémogramme", price: 30.0, validated: true },
        { type: "Soins infirmiers", price: 20.0, validated: false },
      ],
      total: 75.0,
      status: "pending_validation",
      isConventioned: false,
      doctor: "Inf. Claire",
      service: "Laboratoire",
    },
    {
      id: 4,
      patient: "Pierre Durand",
      patientId: "P004",
      date: "2025-01-13",
      time: "11:30",
      acts: [{ type: "Consultation spécialisée", price: 80.0, validated: true }],
      total: 80.0,
      status: "paid",
      isConventioned: true,
      doctor: "Dr. Leroy",
      service: "Cardiologie",
      paymentMethod: "Carte bancaire",
      paymentTime: "12:15",
    },
    {
      id: 5,
      patient: "Anna Moreau",
      patientId: "P005",
      date: "2025-01-13",
      time: "14:00",
      acts: [
        { type: "Échographie abdominale", price: 95.0, validated: true },
        { type: "Consultation échographie", price: 60.0, validated: true },
      ],
      total: 155.0,
      status: "validated",
      isConventioned: false,
      doctor: "Dr. Bernard",
      service: "Imagerie",
    },
  ]

  const getFilteredInvoices = () => {
    let filtered = allInvoices

    if (activeTab === "pending") {
      filtered = allInvoices.filter((inv) => inv.status === "pending_validation")
    } else if (activeTab === "validated") {
      filtered = allInvoices.filter((inv) => inv.status === "validated")
    } else if (activeTab === "paid") {
      filtered = allInvoices.filter((inv) => inv.status === "paid")
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const todayStats = {
    totalInvoices: allInvoices.length,
    pendingValidation: allInvoices.filter((inv) => inv.status === "pending_validation").length,
    validated: allInvoices.filter((inv) => inv.status === "validated").length,
    paid: allInvoices.filter((inv) => inv.status === "paid").length,
    totalAmount: allInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: allInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0),
  }

  const handleValidateInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowValidationModal(true)
  }

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceModal(true)
  }

  const handleNewInvoice = () => {
    setShowNewInvoiceModal(true)
  }

  const handleDirectPayment = () => {
    setShowDirectPaymentModal(true)
  }

  const validateInvoice = () => {
    console.log("Validating invoice:", selectedInvoice)
    // Update invoice status to validated
    setShowValidationModal(false)
    setSelectedInvoice(null)
  }

  const processPayment = () => {
    console.log("Processing payment for:", selectedInvoice)
    setShowPaymentModal(false)
    setSelectedInvoice(null)
  }

  const createNewInvoice = (formData) => {
    console.log("Creating new invoice:", formData)
    setShowNewInvoiceModal(false)
  }

  const processDirectPayment = (formData) => {
    console.log("Processing direct payment:", formData)
    setShowDirectPaymentModal(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending_validation":
        return (
          <Badge variant="destructive" className="bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        )
      case "validated":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validée
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payée
          </Badge>
        )
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
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
            <Button variant="outline" onClick={handleNewInvoice}>
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Facture
            </Button>
            <Button onClick={handleDirectPayment}>
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
                  <p className="text-2xl font-bold">{todayStats.paidAmount.toFixed(2)}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom ou numéro patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "pending" ? "default" : "outline"}
                  onClick={() => setActiveTab("pending")}
                  size="sm"
                >
                  À Valider ({todayStats.pendingValidation})
                </Button>
                <Button
                  variant={activeTab === "validated" ? "default" : "outline"}
                  onClick={() => setActiveTab("validated")}
                  size="sm"
                >
                  Validées ({todayStats.validated})
                </Button>
                <Button
                  variant={activeTab === "paid" ? "default" : "outline"}
                  onClick={() => setActiveTab("paid")}
                  size="sm"
                >
                  Payées ({todayStats.paid})
                </Button>
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                  size="sm"
                >
                  Toutes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Factures{" "}
              {activeTab === "pending"
                ? "à Valider"
                : activeTab === "validated"
                  ? "Validées"
                  : activeTab === "paid"
                    ? "Payées"
                    : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getFilteredInvoices().map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-lg">{invoice.patient}</div>
                        <div className="text-sm text-gray-600">
                          {invoice.patientId} • {invoice.service} • {invoice.doctor}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.date} à {invoice.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {invoice.acts.length} acte{invoice.acts.length > 1 ? "s" : ""}
                        </div>
                        <div className="font-bold text-xl">{invoice.total.toFixed(2)}€</div>
                        <Badge variant={invoice.isConventioned ? "default" : "secondary"} className="mt-1">
                          {invoice.isConventioned ? "Conventionné" : "Privé"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        {getStatusBadge(invoice.status)}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          {invoice.status === "pending_validation" && (
                            <Button size="sm" variant="default" onClick={() => handleValidateInvoice(invoice)}>
                              Valider
                            </Button>
                          )}
                          {invoice.status === "validated" && (
                            <Button size="sm" variant="default" onClick={() => handlePayInvoice(invoice)}>
                              Encaisser
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Modal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          title="Validation de Facture"
          size="lg"
        >
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-lg">{selectedInvoice.patient}</h4>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.service} • {selectedInvoice.doctor}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedInvoice.date} à {selectedInvoice.time}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Actes à valider :</h5>
                {selectedInvoice.acts.map((act, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {act.validated ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span>{act.type}</span>
                    </div>
                    <div className="font-medium">{act.price.toFixed(2)}€</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total à valider :</span>
                  <span className="text-xl font-bold text-blue-600">{selectedInvoice.total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowValidationModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={validateInvoice} className="flex-1">
                  Valider la Facture
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Encaissement" size="md">
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-lg">{selectedInvoice.patient}</h4>
                <p className="text-sm text-gray-600">{selectedInvoice.service}</p>
                <p className="text-lg font-bold text-green-600">{selectedInvoice.total.toFixed(2)}€</p>
                <Badge variant={selectedInvoice.isConventioned ? "default" : "secondary"} className="mt-2">
                  {selectedInvoice.isConventioned ? "Patient Conventionné CNSS" : "Patient Privé"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Méthode de paiement</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Carte bancaire</option>
                    <option>Espèces</option>
                    <option>Chèque</option>
                    {selectedInvoice.isConventioned && <option>Tiers payant CNSS</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Montant reçu</label>
                  <Input type="number" step="0.01" placeholder="0.00" defaultValue={selectedInvoice.total} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Référence</label>
                  <Input placeholder="Numéro de transaction..." />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={processPayment} className="flex-1">
                  Confirmer l'Encaissement
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          title="Détail de la Facture"
          size="lg"
        >
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-lg">{selectedInvoice.patient}</h4>
                  <p className="text-sm text-gray-600">ID: {selectedInvoice.patientId}</p>
                  <Badge variant={selectedInvoice.isConventioned ? "default" : "secondary"} className="mt-2">
                    {selectedInvoice.isConventioned ? "Conventionné" : "Privé"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.date} à {selectedInvoice.time}
                  </p>
                  <p className="text-sm text-gray-600">{selectedInvoice.service}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.doctor}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Détail des actes :</h5>
                <div className="space-y-2">
                  {selectedInvoice.acts.map((act, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {act.validated ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                        <span>{act.type}</span>
                      </div>
                      <span className="font-medium">{act.price.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total :</span>
                  <span className="text-xl font-bold text-blue-600">{selectedInvoice.total.toFixed(2)}€</span>
                </div>
              </div>

              {selectedInvoice.status === "paid" && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Facture payée</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Payée le {selectedInvoice.date} à {selectedInvoice.paymentTime} par {selectedInvoice.paymentMethod}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showNewInvoiceModal}
          onClose={() => setShowNewInvoiceModal(false)}
          title="Nouvelle Facture"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Sélectionner un patient...</option>
                  <option value="P001">Marie Dubois (P001)</option>
                  <option value="P002">Jean Martin (P002)</option>
                  <option value="P003">Sophie Laurent (P003)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Sélectionner un service...</option>
                  <option value="consultation">Consultation</option>
                  <option value="laboratoire">Laboratoire</option>
                  <option value="imagerie">Imagerie</option>
                  <option value="infirmerie">Infirmerie</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Médecin/Praticien</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Sélectionner...</option>
                <option value="dr-martin">Dr. Martin</option>
                <option value="dr-dubois">Dr. Dubois</option>
                <option value="inf-claire">Inf. Claire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Actes médicaux</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {[
                  { name: "Consultation générale", price: 45 },
                  { name: "Consultation spécialisée", price: 80 },
                  { name: "Prise de tension", price: 10 },
                  { name: "Prise de sang", price: 25 },
                  { name: "Radiologie thorax", price: 120 },
                  { name: "Échographie", price: 95 },
                  { name: "Analyse sang complète", price: 85 },
                ].map((act, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="flex-1">{act.name}</span>
                    <span className="font-medium">{act.price}€</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="conventioned" className="rounded" />
              <label htmlFor="conventioned" className="text-sm">
                Patient conventionné CNSS
              </label>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total estimé :</span>
                <span className="text-xl font-bold text-blue-600">0.00€</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewInvoiceModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={() => createNewInvoice({})} className="flex-1">
                Créer la Facture
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showDirectPaymentModal}
          onClose={() => setShowDirectPaymentModal(false)}
          title="Paiement Direct"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Sélectionner un patient...</option>
                <option value="P001">Marie Dubois (P001)</option>
                <option value="P002">Jean Martin (P002)</option>
                <option value="P003">Sophie Laurent (P003)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Motif du paiement</label>
              <Input placeholder="Ex: Consultation, Médicaments, Frais divers..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Montant</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Méthode de paiement</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Carte bancaire</option>
                <option>Espèces</option>
                <option>Chèque</option>
                <option>Virement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Référence (optionnel)</label>
              <Input placeholder="Numéro de transaction, chèque..." />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="direct-conventioned" className="rounded" />
              <label htmlFor="direct-conventioned" className="text-sm">
                Patient conventionné CNSS
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowDirectPaymentModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={() => processDirectPayment({})} className="flex-1">
                Enregistrer le Paiement
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
