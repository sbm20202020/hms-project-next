"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"

const roomTypes = ["Standard", "VIP", "Soins Intensifs", "Double", "Maternité", "Pédiatrie"]

const availableEquipments = [
  "Wifi",
  "TV",
  "Climatisation",
  "Réfrigérateur",
  "Balcon",
  "Salle de bain privée",
  "Monitoring",
  "Oxygène",
  "Défibrillateur",
  "Lit électrique",
  "Fauteuil accompagnant",
  "Coffre-fort",
  "Téléphone",
  "Radio",
]

export default function RoomForm({ room = null, isEdit = false }) {
  const [formData, setFormData] = useState({
    numero: room?.numero || "",
    etage: room?.etage || "",
    type: room?.type || "",
    capacite: room?.capacite || "1",
    prix: room?.prix || "",
    superficie: room?.superficie || "",
    description: room?.description || "",
    equipements: room?.equipements || [],
    statut: room?.statut || "Libre",
    notes: room?.notes || "",
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

  const handleEquipmentChange = (equipment, checked) => {
    setFormData((prev) => ({
      ...prev,
      equipements: checked ? [...prev.equipements, equipment] : prev.equipements.filter((eq) => eq !== equipment),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de Base</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Numéro de Chambre *</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              placeholder="ex: 101"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etage">Étage *</Label>
            <Select
              value={formData.etage.toString()}
              onValueChange={(value) => handleChange("etage", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'étage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Étage 1</SelectItem>
                <SelectItem value="2">Étage 2</SelectItem>
                <SelectItem value="3">Étage 3</SelectItem>
                <SelectItem value="4">Étage 4</SelectItem>
                <SelectItem value="5">Étage 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type de Chambre *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacite">Capacité (nombre de lits) *</Label>
            <Select
              value={formData.capacite.toString()}
              onValueChange={(value) => handleChange("capacite", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Capacité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 lit</SelectItem>
                <SelectItem value="2">2 lits</SelectItem>
                <SelectItem value="3">3 lits</SelectItem>
                <SelectItem value="4">4 lits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prix">Prix par jour (€) *</Label>
            <Input
              id="prix"
              type="number"
              value={formData.prix}
              onChange={(e) => handleChange("prix", e.target.value)}
              placeholder="ex: 150"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="superficie">Superficie (m²)</Label>
            <Input
              id="superficie"
              type="number"
              value={formData.superficie}
              onChange={(e) => handleChange("superficie", e.target.value)}
              placeholder="ex: 25"
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
                  <SelectItem value="Libre">Libre</SelectItem>
                  <SelectItem value="Occupée">Occupée</SelectItem>
                  <SelectItem value="En Maintenance">En Maintenance</SelectItem>
                  <SelectItem value="Nettoyage">Nettoyage</SelectItem>
                  <SelectItem value="Réservée">Réservée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Équipements */}
      <Card>
        <CardHeader>
          <CardTitle>Équipements et Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableEquipments.map((equipment) => (
              <div key={equipment} className="flex items-center space-x-2">
                <Checkbox
                  id={equipment}
                  checked={formData.equipements.includes(equipment)}
                  onCheckedChange={(checked) => handleEquipmentChange(equipment, checked)}
                />
                <Label htmlFor={equipment} className="text-sm">
                  {equipment}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description et notes */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description de la chambre..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <a href="/rooms">Annuler</a>
        </Button>
        <Button type="submit">{isEdit ? "Mettre à jour" : "Créer la chambre"}</Button>
      </div>
    </form>
  )
}
