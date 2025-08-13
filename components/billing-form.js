"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Trash2, Plus } from "lucide-react"

// Mock data for dropdowns
const mockPatients = [
  { id: 1, name: "Marie Dubois", phone: "01 23 45 67 89" },
  { id: 2, name: "Jean Dupont", phone: "01 98 76 54 32" },
  { id: 3, name: "Sophie Bernard", phone: "01 11 22 33 44" },
  { id: 4, name: "Pierre Rousseau", phone: "01 55 66 77 88" },
]

const mockDoctors = [
  { id: 1, name: "Dr. Martin", specialite: "Cardiologie" },
  { id: 2, name: "Dr. Leroy", specialite: "Pédiatrie" },
  { id: 3, name: "Dr. Moreau", specialite: "Orthopédie" },
  { id: 4, name: "Dr. Petit", specialite: "Neurologie" },
]

const serviceTypes = [
  { name: "Consultation", prix: 80 },
  { name: "Consultation spécialisée", prix: 120 },
  { name: "Radiographie", prix: 150 },
  { name: "IRM", prix: 400 },
  { name: "Scanner", prix: 300 },
  { name: "Analyses sanguines", prix: 50 },
  { name: "Échographie", prix: 100 },
  { name: "Chambre Standard", prix: 150 },
  { name: "Chambre VIP", prix: 300 },
  { name: "Soins intensifs", prix: 500 },
  { name: "Chirurgie mineure", prix: 800 },
  { name: "Chirurgie majeure", prix: 2000 },
  { name: "Médicaments", prix: 0 },
]

export default function BillingForm({ billing = null, isEdit = false }) {
  const [formData, setFormData] = useState({
    patientId: billing?.patientId || "",
    doctorId: billing?.doctorId || "",
    dateFacture: billing?.dateFacture || new Date().toISOString().split("T")[0],
    dateEcheance: billing?.dateEcheance || "",
    statut: billing?.statut || "Brouillon",
    notes: billing?.notes || "",
    services: billing?.services || [{ nom: "", quantite: 1, prixUnitaire: 0, total: 0 }],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // In a real app, this would make an API call
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services]
    newServices[index][field] = value

    // Recalculate total for this service
    if (field === "quantite" || field === "prixUnitaire") {
      newServices[index].total = newServices[index].quantite * newServices[index].prixUnitaire
    }

    // If service name changed, update price
    if (field === "nom") {
      const serviceType = serviceTypes.find((s) => s.name === value)
      if (serviceType) {
        newServices[index].prixUnitaire = serviceType.prix
        newServices[index].total = newServices[index].quantite * serviceType.prix
      }
    }

    setFormData((prev) => ({ ...prev, services: newServices }))
  }

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { nom: "", quantite: 1, prixUnitaire: 0, total: 0 }],
    }))
  }

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const calculateTotal = () => {
    return formData.services.reduce((sum, service) => sum + service.total, 0)
  }

  // Calculate default due date (30 days from invoice date)
  const calculateDueDate = (invoiceDate) => {
    const date = new Date(invoiceDate)
    date.setDate(date.getDate() + 30)
    return date.toISOString().split("T")[0]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Médecin *</Label>
            <Select value={formData.doctorId} onValueChange={(value) => handleChange("doctorId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name} - {doctor.specialite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFacture">Date de Facture *</Label>
            <Input
              id="dateFacture"
              type="date"
              value={formData.dateFacture}
              onChange={(e) => {
                handleChange("dateFacture", e.target.value)
                // Auto-calculate due date
                if (!formData.dateEcheance) {
                  handleChange("dateEcheance", calculateDueDate(e.target.value))
                }
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateEcheance">Date d'Échéance *</Label>
            <Input
              id="dateEcheance"
              type="date"
              value={formData.dateEcheance}
              onChange={(e) => handleChange("dateEcheance", e.target.value)}
              required
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => handleChange("statut", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="En Attente">En Attente</SelectItem>
                  <SelectItem value="Payée">Payée</SelectItem>
                  <SelectItem value="Partiellement Payée">Partiellement Payée</SelectItem>
                  <SelectItem value="En Retard">En Retard</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services et tarifs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services et Tarifs</CardTitle>
            <Button type="button" onClick={addService} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.services.map((service, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <Label>Service *</Label>
                  <Select value={service.nom} onValueChange={(value) => handleServiceChange(index, "nom", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((serviceType) => (
                        <SelectItem key={serviceType.name} value={serviceType.name}>
                          {serviceType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={service.quantite}
                    onChange={(e) => handleServiceChange(index, "quantite", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prix Unitaire (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={service.prixUnitaire}
                    onChange={(e) => handleServiceChange(index, "prixUnitaire", Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total (€)</Label>
                  <Input value={service.total.toFixed(2)} disabled />
                </div>

                <div className="flex items-end">
                  {formData.services.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeService(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end p-4 bg-muted rounded-lg">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total de la facture</p>
                <p className="text-2xl font-bold">{calculateTotal().toFixed(2)}€</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notes supplémentaires pour la facture..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <a href="/billing">Annuler</a>
        </Button>
        <Button type="submit" variant="outline">
          Enregistrer comme brouillon
        </Button>
        <Button type="submit">{isEdit ? "Mettre à jour" : "Créer la facture"}</Button>
      </div>
    </form>
  )
}
