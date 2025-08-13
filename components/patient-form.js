"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function PatientForm({ patient = null, isEdit = false, onSuccess }) {
  const [formData, setFormData] = useState({
    prenom: patient?.prenom || "",
    nom: patient?.nom || "",
    dateNaissance: patient?.dateNaissance || "",
    sexe: patient?.sexe || "",
    telephone: patient?.telephone || "",
    email: patient?.email || "",
    adresse: patient?.adresse || "",
    ville: patient?.ville || "",
    codePostal: patient?.codePostal || "",
    numeroSecu: patient?.numeroSecu || "",
    contactUrgence: patient?.contactUrgence || "",
    telephoneUrgence: patient?.telephoneUrgence || "",
    allergies: patient?.allergies || "",
    antecedents: patient?.antecedents || "",
    traitements: patient?.traitements || "",
  })

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    // In a real app, this would make an API call
    if (onSuccess) {
      onSuccess()
    }
  }

  useEffect(() => {
    if (typeof onSuccess === "function") {
      // Store the submit handler for the parent to access
      window.patientFormSubmit = handleSubmit
    }
  }, [formData, onSuccess])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
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
            <Label htmlFor="dateNaissance">Date de Naissance *</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe *</Label>
            <Select value={formData.sexe} onValueChange={(value) => handleChange("sexe", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroSecu">Numéro de Sécurité Sociale</Label>
            <Input
              id="numeroSecu"
              value={formData.numeroSecu}
              onChange={(e) => handleChange("numeroSecu", e.target.value)}
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

      {/* Contact d'urgence */}
      <Card>
        <CardHeader>
          <CardTitle>Contact d'Urgence</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactUrgence">Nom du Contact</Label>
            <Input
              id="contactUrgence"
              value={formData.contactUrgence}
              onChange={(e) => handleChange("contactUrgence", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephoneUrgence">Téléphone d'Urgence</Label>
            <Input
              id="telephoneUrgence"
              value={formData.telephoneUrgence}
              onChange={(e) => handleChange("telephoneUrgence", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations médicales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Médicales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Lister les allergies connues..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="antecedents">Antécédents Médicaux</Label>
            <Textarea
              id="antecedents"
              value={formData.antecedents}
              onChange={(e) => handleChange("antecedents", e.target.value)}
              placeholder="Historique médical..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="traitements">Traitements en Cours</Label>
            <Textarea
              id="traitements"
              value={formData.traitements}
              onChange={(e) => handleChange("traitements", e.target.value)}
              placeholder="Médicaments et traitements actuels..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
