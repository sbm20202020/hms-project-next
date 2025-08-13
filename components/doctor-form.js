"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const specialites = [
  "Cardiologie",
  "Pédiatrie",
  "Orthopédie",
  "Neurologie",
  "Généraliste",
  "Dermatologie",
  "Gynécologie",
  "Ophtalmologie",
  "ORL",
  "Psychiatrie",
  "Radiologie",
  "Anesthésie",
  "Chirurgie",
  "Urgences",
]

export default function DoctorForm({ doctor = null, isEdit = false, onSuccess }) {
  const [formData, setFormData] = useState({
    prenom: doctor?.prenom || "",
    nom: doctor?.nom || "",
    specialite: doctor?.specialite || "",
    numeroOrdre: doctor?.numeroOrdre || "",
    telephone: doctor?.telephone || "",
    email: doctor?.email || "",
    adresse: doctor?.adresse || "",
    ville: doctor?.ville || "",
    codePostal: doctor?.codePostal || "",
    dateNaissance: doctor?.dateNaissance || "",
    dateEmbauche: doctor?.dateEmbauche || "",
    diplomes: doctor?.diplomes || "",
    experience: doctor?.experience || "",
    langues: doctor?.langues || "",
    horairesLundi: doctor?.horairesLundi || "",
    horairesMardi: doctor?.horairesMardi || "",
    horairesMercredi: doctor?.horairesMercredi || "",
    horairesJeudi: doctor?.horairesJeudi || "",
    horairesVendredi: doctor?.horairesVendredi || "",
    horairesSamedi: doctor?.horairesSamedi || "",
    horairesDimanche: doctor?.horairesDimanche || "",
    tarif: doctor?.tarif || "",
    notes: doctor?.notes || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // In a real app, this would make an API call
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input id="nom" value={formData.nom} onChange={(e) => handleChange("nom", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de Naissance</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité *</Label>
            <Select value={formData.specialite} onValueChange={(value) => handleChange("specialite", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialites.map((specialite) => (
                  <SelectItem key={specialite} value={specialite}>
                    {specialite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroOrdre">Numéro d'Ordre *</Label>
            <Input
              id="numeroOrdre"
              value={formData.numeroOrdre}
              onChange={(e) => handleChange("numeroOrdre", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateEmbauche">Date d'Embauche</Label>
            <Input
              id="dateEmbauche"
              type="date"
              value={formData.dateEmbauche}
              onChange={(e) => handleChange("dateEmbauche", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Années d'Expérience</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              placeholder="ex: 10 ans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tarif">Tarif de Consultation (€)</Label>
            <Input
              id="tarif"
              type="number"
              value={formData.tarif}
              onChange={(e) => handleChange("tarif", e.target.value)}
              placeholder="ex: 50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="langues">Langues Parlées</Label>
            <Input
              id="langues"
              value={formData.langues}
              onChange={(e) => handleChange("langues", e.target.value)}
              placeholder="ex: Français, Anglais, Espagnol"
            />
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input id="adresse" value={formData.adresse} onChange={(e) => handleChange("adresse", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codePostal">Code Postal</Label>
            <Input
              id="codePostal"
              value={formData.codePostal}
              onChange={(e) => handleChange("codePostal", e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" value={formData.ville} onChange={(e) => handleChange("ville", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Horaires */}
      <Card>
        <CardHeader>
          <CardTitle>Horaires de Travail</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horairesLundi">Lundi</Label>
            <Input
              id="horairesLundi"
              value={formData.horairesLundi}
              onChange={(e) => handleChange("horairesLundi", e.target.value)}
              placeholder="ex: 8h-18h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesMardi">Mardi</Label>
            <Input
              id="horairesMardi"
              value={formData.horairesMardi}
              onChange={(e) => handleChange("horairesMardi", e.target.value)}
              placeholder="ex: 8h-18h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesMercredi">Mercredi</Label>
            <Input
              id="horairesMercredi"
              value={formData.horairesMercredi}
              onChange={(e) => handleChange("horairesMercredi", e.target.value)}
              placeholder="ex: 8h-18h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesJeudi">Jeudi</Label>
            <Input
              id="horairesJeudi"
              value={formData.horairesJeudi}
              onChange={(e) => handleChange("horairesJeudi", e.target.value)}
              placeholder="ex: 8h-18h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesVendredi">Vendredi</Label>
            <Input
              id="horairesVendredi"
              value={formData.horairesVendredi}
              onChange={(e) => handleChange("horairesVendredi", e.target.value)}
              placeholder="ex: 8h-18h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesSamedi">Samedi</Label>
            <Input
              id="horairesSamedi"
              value={formData.horairesSamedi}
              onChange={(e) => handleChange("horairesSamedi", e.target.value)}
              placeholder="ex: 9h-13h"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horairesDimanche">Dimanche</Label>
            <Input
              id="horairesDimanche"
              value={formData.horairesDimanche}
              onChange={(e) => handleChange("horairesDimanche", e.target.value)}
              placeholder="Fermé"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations complémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Complémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diplomes">Diplômes et Certifications</Label>
            <Textarea
              id="diplomes"
              value={formData.diplomes}
              onChange={(e) => handleChange("diplomes", e.target.value)}
              placeholder="Lister les diplômes et certifications..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Informations supplémentaires..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="submit">{isEdit ? "Mettre à jour" : "Enregistrer"}</Button>
      </div>
    </form>
  )
}
