"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Phone, Mail, MapPin, Stethoscope, Calendar, Clock, Users, Award } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockDoctorDetails = {
  id: 1,
  prenom: "Dr. Pierre",
  nom: "Martin",
  specialite: "Cardiologie",
  numeroOrdre: "12345678",
  telephone: "01 23 45 67 89",
  email: "p.martin@hopital.com",
  adresse: "123 Avenue des Médecins",
  ville: "Paris",
  codePostal: "75008",
  dateNaissance: "1975-05-20",
  dateEmbauche: "2010-09-01",
  experience: "15 ans",
  langues: "Français, Anglais, Espagnol",
  tarif: "80",
  status: "Actif",
  diplomes:
    "Doctorat en Médecine - Université Paris Descartes, Spécialisation en Cardiologie - Hôpital Européen Georges-Pompidou",
  horaires: {
    lundi: "8h-18h",
    mardi: "8h-18h",
    mercredi: "8h-18h",
    jeudi: "8h-18h",
    vendredi: "8h-16h",
    samedi: "9h-13h",
    dimanche: "Fermé",
  },
  statistiques: {
    patients: 45,
    consultations: 156,
    satisfaction: 4.8,
  },
}

const mockRendezVous = [
  {
    id: 1,
    date: "2024-01-22",
    heure: "09:00",
    patient: "Marie Dubois",
    type: "Consultation",
    status: "Confirmé",
  },
  {
    id: 2,
    date: "2024-01-22",
    heure: "10:30",
    patient: "Jean Dupont",
    type: "Suivi",
    status: "Confirmé",
  },
  {
    id: 3,
    date: "2024-01-22",
    heure: "14:00",
    patient: "Sophie Bernard",
    type: "Consultation",
    status: "En attente",
  },
]

export default function DoctorDetails({ doctorId }) {
  const [doctor, setDoctor] = useState(null)
  const [rendezVous, setRendezVous] = useState([])

  useEffect(() => {
    // In a real app, fetch doctor data from API
    setDoctor(mockDoctorDetails)
    setRendezVous(mockRendezVous)
  }, [doctorId])

  if (!doctor) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Doctor Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  {doctor.prenom.split(" ")[1]?.[0] || doctor.prenom[0]}
                  {doctor.nom[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {doctor.prenom} {doctor.nom}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{doctor.specialite}</span>
                </div>
                <p className="text-sm text-muted-foreground">N° Ordre: {doctor.numeroOrdre}</p>
              </div>
            </div>
            <Badge className={doctor.status === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {doctor.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{doctor.statistiques.patients}</p>
                <p className="text-sm text-muted-foreground">Patients actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{doctor.statistiques.consultations}</p>
                <p className="text-sm text-muted-foreground">Consultations ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{doctor.statistiques.satisfaction}/5</p>
                <p className="text-sm text-muted-foreground">Satisfaction patient</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Details Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="rendez-vous">Rendez-vous</TabsTrigger>
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
                  <span>{doctor.telephone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{doctor.adresse}</p>
                    <p>
                      {doctor.codePostal} {doctor.ville}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Professionnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Expérience</p>
                  <p>{doctor.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date d'embauche</p>
                  <p>{new Date(doctor.dateEmbauche).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Langues parlées</p>
                  <p>{doctor.langues}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tarif consultation</p>
                  <p>{doctor.tarif}€</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diplômes */}
          <Card>
            <CardHeader>
              <CardTitle>Diplômes et Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{doctor.diplomes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horaires" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Horaires de Travail</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(doctor.horaires).map(([jour, horaire]) => (
                  <div key={jour} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium capitalize">{jour}</span>
                    <span className={horaire === "Fermé" ? "text-muted-foreground" : "text-foreground"}>{horaire}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rendez-vous" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Rendez-vous du Jour</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rendezVous.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="font-medium">{rdv.heure}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rdv.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{rdv.patient}</p>
                        <p className="text-sm text-muted-foreground">{rdv.type}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        rdv.status === "Confirmé"
                          ? "bg-green-100 text-green-800"
                          : rdv.status === "En attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {rdv.status}
                    </Badge>
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
