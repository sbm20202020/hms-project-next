"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Users, AlertCircle, Phone, MapPin, User, Calendar, ChevronDown, ChevronUp } from "lucide-react"

export default function PatientForm({ patient = null, isEdit = false, onSuccess }) {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [formData, setFormData] = useState({
    prenom: patient?.prenom || "",
    nom: patient?.nom || "",
    dateNaissance: patient?.dateNaissance || "",
    sexe: patient?.sexe || "",
    telephone: patient?.telephone || "",
    adresse: patient?.adresse || "",
    ville: patient?.ville || "",
    typePatient: patient?.typePatient || "Privé",
    convention: patient?.convention || "none",
    // Champs optionnels
    email: patient?.email || "",
    codePostal: patient?.codePostal || "",
    numeroSecu: patient?.numeroSecu || "",
    contactUrgence: patient?.contactUrgence || "",
    telephoneUrgence: patient?.telephoneUrgence || "",
    allergies: patient?.allergies || "",
    antecedents: patient?.antecedents || "",
    traitements: patient?.traitements || "",
  })

  const handleSubmit = () => {
    // Validation des champs obligatoires
    if (!formData.prenom || !formData.nom || !formData.dateNaissance || !formData.sexe || !formData.telephone || !formData.adresse) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Préparer les données du patient
    const patientData = {
      prenom: formData.prenom,
      nom: formData.nom,
      dateNaissance: formData.dateNaissance,
      sexe: formData.sexe,
      telephone: formData.telephone,
      adresse: formData.adresse,
      ville: formData.ville,
      typePatient: formData.typePatient === "insured" ? "insured" : "private",
      convention: formData.convention === "none" ? null : formData.convention,
      dateCreation: new Date().toISOString(),
      statut: "Actif",
      service: "Général",
      medecinTraitant: "",
    }

    // Ajouter les champs optionnels s'ils sont remplis
    if (formData.email) patientData.email = formData.email
    if (formData.codePostal) patientData.codePostal = formData.codePostal
    if (formData.numeroSecu) patientData.numeroSecu = formData.numeroSecu
    if (formData.contactUrgence) patientData.contactUrgence = formData.contactUrgence
    if (formData.telephoneUrgence) patientData.telephoneUrgence = formData.telephoneUrgence
    if (formData.allergies) patientData.allergies = formData.allergies
    if (formData.antecedents) patientData.antecedents = formData.antecedents
    if (formData.traitements) patientData.traitements = formData.traitements

    console.log("Form submitted:", patientData)
    if (onSuccess) {
      onSuccess(patientData)
    }
  }

  useEffect(() => {
    if (typeof onSuccess === "function") {
      // Store the submit handler for the parent to access
      window.patientFormSubmit = handleSubmit
    }
  }, [formData, onSuccess, handleSubmit])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleConventionSection = (typePatient) => {
    if (typePatient === "Privé") {
      setFormData(prev => ({ ...prev, convention: "none" }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Informations de base - OBLIGATOIRES */}
      <Card className="border-2 border-cyan-200 bg-cyan-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-700">
            <User className="h-5 w-5" />
            Informations de Base *
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom" className="text-sm font-medium">
              Prénom *
            </Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-sm font-medium">
              Nom *
            </Label>
            <Input 
              id="nom" 
              value={formData.nom} 
              onChange={(e) => handleChange("nom", e.target.value)} 
              required 
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance" className="text-sm font-medium">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date de Naissance *
            </Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              required
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexe" className="text-sm font-medium">
              Sexe *
            </Label>
            <Select value={formData.sexe} onValueChange={(value) => handleChange("sexe", value)}>
              <SelectTrigger className="border-gray-300">
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
            <Label htmlFor="telephone" className="text-sm font-medium">
              <Phone className="h-4 w-4 inline mr-1" />
              Téléphone *
            </Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              required
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse" className="text-sm font-medium">
              <MapPin className="h-4 w-4 inline mr-1" />
              Adresse complète *
            </Label>
            <Input 
              id="adresse" 
              value={formData.adresse} 
              onChange={(e) => handleChange("adresse", e.target.value)} 
              required
              className="border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Type de patient et convention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Type de Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typePatient" className="text-sm font-medium">
                Type de patient
              </Label>
              <Select 
                value={formData.typePatient} 
                onValueChange={(value) => {
                  handleChange("typePatient", value)
                  toggleConventionSection(value)
                }}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Patient privé</SelectItem>
                  <SelectItem value="insured">Patient conventionné</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ville" className="text-sm font-medium">
                Ville
              </Label>
              <Input 
                id="ville" 
                value={formData.ville} 
                onChange={(e) => handleChange("ville", e.target.value)} 
                className="border-gray-300"
              />
            </div>
          </div>

          {formData.typePatient === "insured" && (
            <div className="space-y-2">
              <Label htmlFor="convention" className="text-sm font-medium">
                Convention *
              </Label>
              <Select value={formData.convention} onValueChange={(value) => handleChange("convention", value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Sélectionner une convention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sélectionner une convention</SelectItem>
                  <SelectItem value="cnss">CNSS - Caisse Nationale de Sécurité Sociale</SelectItem>
                  <SelectItem value="cnrps">CNRPS - Caisse Nationale de Retraite et de Prévoyance Sociale</SelectItem>
                  <SelectItem value="cnas">CNAS - Caisse Nationale des Assurances Sociales</SelectItem>
                  <SelectItem value="cnam">CNAM - Caisse Nationale d'Assurance Maladie</SelectItem>
                  <SelectItem value="sotra">SOTRA - Société de Transport d'Abidjan</SelectItem>
                  <SelectItem value="sodeci">SODECI - Société de Distribution d'Eau de Côte d'Ivoire</SelectItem>
                  <SelectItem value="cienergies">CIE - Compagnie Ivoirienne d'Électricité</SelectItem>
                  <SelectItem value="portabidjan">Port Autonome d'Abidjan</SelectItem>
                  <SelectItem value="aeroport">Aéroport International Félix Houphouët-Boigny</SelectItem>
                  <SelectItem value="croixrouge">Croix-Rouge Ivoirienne</SelectItem>
                  <SelectItem value="medecinsmonde">Médecins du Monde</SelectItem>
                  <SelectItem value="msf">MSF - Médecins Sans Frontières</SelectItem>
                  <SelectItem value="unicef">UNICEF</SelectItem>
                  <SelectItem value="oms">OMS - Organisation Mondiale de la Santé</SelectItem>
                  <SelectItem value="armee">Armée de Côte d'Ivoire</SelectItem>
                  <SelectItem value="police">Police Nationale</SelectItem>
                  <SelectItem value="gendarmerie">Gendarmerie Nationale</SelectItem>
                  <SelectItem value="douane">Douane Ivoirienne</SelectItem>
                  <SelectItem value="impots">Direction Générale des Impôts</SelectItem>
                  <SelectItem value="autre">Autre convention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton pour afficher/masquer les champs supplémentaires */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAdditionalFields(!showAdditionalFields)}
          className="flex items-center gap-2"
        >
          {showAdditionalFields ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Masquer les informations supplémentaires
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Ajouter des informations supplémentaires
            </>
          )}
        </Button>
      </div>

      {/* Champs supplémentaires - OPTIONNELS */}
      {showAdditionalFields && (
        <>
          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="h-5 w-5" />
                Contact d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactUrgence" className="text-sm font-medium">
                  Nom du Contact
                </Label>
                <Input
                  id="contactUrgence"
                  value={formData.contactUrgence}
                  onChange={(e) => handleChange("contactUrgence", e.target.value)}
                  className="border-gray-300"
                  placeholder="Nom et prénom du contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephoneUrgence" className="text-sm font-medium">
                  Téléphone d'Urgence
                </Label>
                <Input
                  id="telephoneUrgence"
                  value={formData.telephoneUrgence}
                  onChange={(e) => handleChange("telephoneUrgence", e.target.value)}
                  className="border-gray-300"
                  placeholder="Numéro de téléphone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations médicales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <AlertCircle className="h-5 w-5" />
                Informations Médicales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm font-medium">
                  Allergies
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="Lister les allergies connues..."
                  className="border-gray-300"
                  rows="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="antecedents" className="text-sm font-medium">
                  Antécédents Médicaux
                </Label>
                <Textarea
                  id="antecedents"
                  value={formData.antecedents}
                  onChange={(e) => handleChange("antecedents", e.target.value)}
                  placeholder="Historique médical..."
                  className="border-gray-300"
                  rows="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traitements" className="text-sm font-medium">
                  Traitements en Cours
                </Label>
                <Textarea
                  id="traitements"
                  value={formData.traitements}
                  onChange={(e) => handleChange("traitements", e.target.value)}
                  placeholder="Médicaments et traitements actuels..."
                  className="border-gray-300"
                  rows="2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations complémentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <User className="h-5 w-5" />
                Informations Complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border-gray-300"
                  placeholder="adresse@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal" className="text-sm font-medium">
                  Code Postal
                </Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleChange("codePostal", e.target.value)}
                  className="border-gray-300"
                  placeholder="Code postal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroSecu" className="text-sm font-medium">
                  Numéro de Sécurité Sociale
                </Label>
                <Input
                  id="numeroSecu"
                  value={formData.numeroSecu}
                  onChange={(e) => handleChange("numeroSecu", e.target.value)}
                  className="border-gray-300"
                  placeholder="Numéro de sécurité sociale"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
