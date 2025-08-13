"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { FileText, User, Calendar, Euro, CreditCard, History, Plus } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockBillingDetails = {
  id: "FAC-2024-002",
  numeroFacture: "FAC-2024-002",
  dateFacture: "2024-01-22",
  dateEcheance: "2024-02-22",
  statut: "En Attente",
  montantTotal: 850.0,
  montantPaye: 0.0,
  montantRestant: 850.0,
  notes: "Facture pour consultation et analyses de routine",
  patient: {
    id: 2,
    nom: "Dupont",
    prenom: "Jean",
    telephone: "01 98 76 54 32",
    email: "jean.dupont@email.com",
    adresse: "456 Avenue des Champs, 75008 Paris",
  },
  medecin: {
    id: 2,
    nom: "Leroy",
    prenom: "Dr. Marie",
    specialite: "Pédiatrie",
  },
  services: [
    {
      id: 1,
      nom: "Consultation spécialisée",
      quantite: 1,
      prixUnitaire: 120.0,
      total: 120.0,
    },
    {
      id: 2,
      nom: "Analyses sanguines",
      quantite: 1,
      prixUnitaire: 50.0,
      total: 50.0,
    },
    {
      id: 3,
      nom: "Radiographie",
      quantite: 2,
      prixUnitaire: 150.0,
      total: 300.0,
    },
    {
      id: 4,
      nom: "Échographie",
      quantite: 1,
      prixUnitaire: 100.0,
      total: 100.0,
    },
    {
      id: 5,
      nom: "Médicaments",
      quantite: 1,
      prixUnitaire: 280.0,
      total: 280.0,
    },
  ],
  paiements: [
    // No payments yet for this example
  ],
  createdAt: "2024-01-22T09:30:00",
  updatedAt: "2024-01-22T09:30:00",
}

const statusColors = {
  Payée: "bg-green-100 text-green-800",
  "En Attente": "bg-yellow-100 text-yellow-800",
  "Partiellement Payée": "bg-blue-100 text-blue-800",
  "En Retard": "bg-red-100 text-red-800",
  Brouillon: "bg-gray-100 text-gray-800",
  Annulée: "bg-gray-100 text-gray-800",
}

export default function BillingDetails({ billingId }) {
  const [billing, setBilling] = useState(null)
  const [newPayment, setNewPayment] = useState({
    montant: "",
    methodePaiement: "",
    datePayement: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  })

  useEffect(() => {
    // In a real app, fetch billing data from API
    setBilling(mockBillingDetails)
  }, [billingId])

  if (!billing) {
    return <div>Chargement...</div>
  }

  const handleStatusChange = (newStatus) => {
    // In a real app, this would make an API call
    setBilling((prev) => ({ ...prev, statut: newStatus }))
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    // In a real app, this would make an API call
    const payment = {
      id: Date.now(),
      ...newPayment,
      montant: Number.parseFloat(newPayment.montant),
    }

    setBilling((prev) => {
      const newMontantPaye = prev.montantPaye + payment.montant
      const newMontantRestant = prev.montantTotal - newMontantPaye
      let newStatut = prev.statut

      if (newMontantRestant <= 0) {
        newStatut = "Payée"
      } else if (newMontantPaye > 0) {
        newStatut = "Partiellement Payée"
      }

      return {
        ...prev,
        paiements: [...prev.paiements, payment],
        montantPaye: newMontantPaye,
        montantRestant: newMontantRestant,
        statut: newStatut,
      }
    })

    // Reset form
    setNewPayment({
      montant: "",
      methodePaiement: "",
      datePayement: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Billing Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{billing.numeroFacture}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(billing.dateFacture).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {billing.patient.prenom} {billing.patient.nom}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{billing.montantTotal.toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">Restant: {billing.montantRestant.toFixed(2)}€</p>
              </div>
              <Badge className={statusColors[billing.statut]}>{billing.statut}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {billing.statut !== "Payée" && billing.statut !== "Annulée" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {billing.statut === "Brouillon" && (
                <Button onClick={() => handleStatusChange("En Attente")} size="sm">
                  Envoyer la facture
                </Button>
              )}
              {billing.montantRestant > 0 && (
                <Button onClick={() => handleStatusChange("Payée")} size="sm">
                  Marquer comme payée
                </Button>
              )}
              <Button onClick={() => handleStatusChange("Annulée")} variant="destructive" size="sm">
                Annuler la facture
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Details Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations Patient</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">
                    {billing.patient.prenom} {billing.patient.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">{billing.patient.telephone}</p>
                  <p className="text-sm text-muted-foreground">{billing.patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="text-sm">{billing.patient.adresse}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/patients/${billing.patient.id}`}>Voir le dossier patient</a>
                </Button>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de Facturation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de facture</p>
                    <p>{new Date(billing.dateFacture).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'échéance</p>
                    <p>{new Date(billing.dateEcheance).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Médecin</p>
                  <p>
                    {billing.medecin.prenom} {billing.medecin.nom} - {billing.medecin.specialite}
                  </p>
                </div>
                {billing.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{billing.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Euro className="h-5 w-5" />
                <span>Services Facturés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
                  <div>Service</div>
                  <div className="text-center">Quantité</div>
                  <div className="text-right">Prix Unitaire</div>
                  <div className="text-right">Total</div>
                </div>
                {billing.services.map((service) => (
                  <div key={service.id} className="grid grid-cols-4 gap-4 py-2">
                    <div className="font-medium">{service.nom}</div>
                    <div className="text-center">{service.quantite}</div>
                    <div className="text-right">{service.prixUnitaire.toFixed(2)}€</div>
                    <div className="text-right font-medium">{service.total.toFixed(2)}€</div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-lg font-bold">Total: {billing.montantTotal.toFixed(2)}€</p>
                      {billing.montantPaye > 0 && (
                        <p className="text-sm text-muted-foreground">Payé: {billing.montantPaye.toFixed(2)}€</p>
                      )}
                      {billing.montantRestant > 0 && (
                        <p className="text-sm font-medium text-red-600">
                          Restant: {billing.montantRestant.toFixed(2)}€
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Add Payment Form */}
          {billing.montantRestant > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Ajouter un Paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montant">Montant (€) *</Label>
                    <Input
                      id="montant"
                      type="number"
                      step="0.01"
                      max={billing.montantRestant}
                      value={newPayment.montant}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, montant: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="methodePaiement">Méthode de Paiement *</Label>
                    <Select
                      value={newPayment.methodePaiement}
                      onValueChange={(value) => setNewPayment((prev) => ({ ...prev, methodePaiement: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                        <SelectItem value="Virement">Virement</SelectItem>
                        <SelectItem value="Assurance">Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="datePayement">Date de Paiement *</Label>
                    <Input
                      id="datePayement"
                      type="date"
                      value={newPayment.datePayement}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, datePayement: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input
                      id="reference"
                      value={newPayment.reference}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, reference: e.target.value }))}
                      placeholder="Numéro de chèque, transaction..."
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Ajouter le paiement</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Historique des Paiements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billing.paiements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Aucun paiement enregistré</p>
              ) : (
                <div className="space-y-4">
                  {billing.paiements.map((paiement) => (
                    <div key={paiement.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{paiement.montant.toFixed(2)}€</span>
                        <Badge variant="outline">{paiement.methodePaiement}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p>{new Date(paiement.datePayement).toLocaleDateString("fr-FR")}</p>
                        </div>
                        {paiement.reference && (
                          <div>
                            <p className="text-muted-foreground">Référence</p>
                            <p>{paiement.reference}</p>
                          </div>
                        )}
                      </div>
                      {paiement.notes && <p className="text-sm text-muted-foreground mt-2">{paiement.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Historique de la Facture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Facture créée</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(billing.createdAt).toLocaleDateString("fr-FR")} à{" "}
                      {new Date(billing.createdAt).toLocaleTimeString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Facture créée pour {billing.patient.prenom} {billing.patient.nom}
                  </p>
                </div>
                {billing.updatedAt !== billing.createdAt && (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Facture modifiée</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(billing.updatedAt).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(billing.updatedAt).toLocaleTimeString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Dernière modification de la facture</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
