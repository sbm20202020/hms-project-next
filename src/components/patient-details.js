"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Calendar, Phone, Mail, MapPin, AlertTriangle, FileText, Clock } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockPatientDetails = [
  {
    id: 1,
    prenom: "Marie",
    nom: "Dupont",
    nomComplet: "Marie Dupont",
    dateNaissance: "1980-05-15",
    age: 44,
    sexe: "F",
    telephone: "0123456789",
    email: "marie.dupont@email.com",
    adresse: "123 Rue de la Paix",
    ville: "Abidjan",
    codePostal: "22501",
    numeroSecu: "1234567890123",
    typePatient: "insured",
    convention: "cnss",
    contactUrgence: "Jean Dupont",
    telephoneUrgence: "0987654321",
    allergies: "Pénicilline",
    antecedents: "Hypertension",
    traitements: "Amlodipine 5mg",
    dateCreation: "2024-01-15T10:00:00Z",
    statut: "Actif",
    service: "Cardiologie",
    medecinTraitant: "Dr. Martin",
    derniereVisite: "2024-01-20T14:30:00Z",
  },
  {
    id: 2,
    prenom: "Pierre",
    nom: "Martin",
    nomComplet: "Pierre Martin",
    dateNaissance: "1975-12-03",
    age: 49,
    sexe: "M",
    telephone: "0123456790",
    email: "pierre.martin@email.com",
    adresse: "456 Avenue des Fleurs",
    ville: "Yamoussoukro",
    codePostal: "22502",
    numeroSecu: "9876543210987",
    typePatient: "Privé",
    convention: null,
    contactUrgence: "Sophie Martin",
    telephoneUrgence: "0123456791",
    allergies: "Aucune",
    antecedents: "Diabète type 2",
    traitements: "Metformine 500mg",
    dateCreation: "2024-01-10T09:00:00Z",
    statut: "Actif",
    service: "Endocrinologie",
    medecinTraitant: "Dr. Bernard",
    derniereVisite: "2024-01-18T11:00:00Z",
  },
]

const mockConsultations = [
  {
    id: 1,
    date: "2024-01-15",
    medecin: "Dr. Martin",
    type: "Consultation générale",
    diagnostic: "Contrôle diabète",
    notes: "Glycémie stable, continuer traitement actuel",
  },
  {
    id: 2,
    date: "2023-12-10",
    medecin: "Dr. Leroy",
    type: "Consultation spécialisée",
    diagnostic: "Suivi cardiologique",
    notes: "Tension artérielle bien contrôlée",
  },
]

export default function PatientDetails({ patientId }) {
  console.log("patientId", patientId)
  const [patient, setPatient] = useState(null)
  const [consultations, setConsultations] = useState([])

  useEffect(() => {
    // In a real app, fetch patient data from API
    const patient = mockPatientDetails.find((patient) => patient.id === Number(patientId))
    setPatient(patient)
    setConsultations(mockConsultations)
  }, [patientId])

  if (!patient) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  {patient.prenom[0]}
                  {patient.nom[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {patient.prenom} {patient.nom}
                </h2>
                <p className="text-muted-foreground">
                  {patient.age} ans • {patient.sexe === "F" ? "Féminin" : "Masculin"}
                </p>
                <p className="text-sm text-muted-foreground">Médecin traitant: {patient.medecinTraitant}</p>
              </div>
            </div>
            <Badge className={patient.status === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {patient.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="medical">Médical</TabsTrigger>
          <TabsTrigger value="consultations">Dossiers</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.telephone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{patient.adresse}</p>
                    <p>
                      {patient.codePostal} {patient.ville}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations administratives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Informations Administratives</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p>{new Date(patient.dateNaissance).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de Sécurité Sociale</p>
                  <p>{patient.numeroSecu}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact d'urgence</p>
                  <p>{patient.contactUrgence}</p>
                  <p className="text-sm text-muted-foreground">{patient.telephoneUrgence}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Allergies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.allergies || "Aucune allergie connue"}</p>
              </CardContent>
            </Card>

            {/* Antécédents */}
            <Card>
              <CardHeader>
                <CardTitle>Antécédents Médicaux</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.antecedents || "Aucun antécédent connu"}</p>
              </CardContent>
            </Card>

            {/* Traitements */}
            <Card>
              <CardHeader>
                <CardTitle>Traitements en Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.traitements || "Aucun traitement en cours"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Historique des Consultations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{new Date(consultation.date).toLocaleDateString("fr-FR")}</span>
                        <Badge variant="outline">{consultation.type}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{consultation.medecin}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Diagnostic: {consultation.diagnostic}</p>
                      <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
