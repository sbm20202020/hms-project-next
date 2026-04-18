"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Bed, Users, Home, Calendar, User, Clock, Settings } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockRoomDetails = {
  id: 102,
  numero: "102",
  etage: 1,
  type: "Standard",
  statut: "Occupée",
  capacite: 1,
  prix: 150,
  superficie: 25,
  description:
    "Chambre standard avec vue sur le jardin, équipée de tout le confort nécessaire pour un séjour agréable.",
  equipements: ["Wifi", "TV", "Climatisation", "Salle de bain privée", "Lit électrique"],
  notes: "Chambre récemment rénovée",
  patient: {
    id: 1,
    nom: "Dubois",
    prenom: "Marie",
    dateAdmission: "2024-01-20",
    dateLiberation: "2024-01-25",
    medecin: "Dr. Martin",
  },
  historique: [
    {
      id: 1,
      patient: "Jean Dupont",
      dateDebut: "2024-01-10",
      dateFin: "2024-01-18",
      duree: 8,
      medecin: "Dr. Leroy",
    },
    {
      id: 2,
      patient: "Sophie Bernard",
      dateDebut: "2024-01-01",
      dateFin: "2024-01-08",
      duree: 7,
      medecin: "Dr. Moreau",
    },
  ],
  maintenance: [
    {
      id: 1,
      date: "2024-01-15",
      type: "Nettoyage approfondi",
      technicien: "Service Entretien",
      statut: "Terminé",
    },
    {
      id: 2,
      date: "2023-12-20",
      type: "Réparation climatisation",
      technicien: "Technicien HVAC",
      statut: "Terminé",
    },
  ],
}

const statusColors = {
  Libre: "bg-green-100 text-green-800",
  Occupée: "bg-red-100 text-red-800",
  "Partiellement Occupée": "bg-yellow-100 text-yellow-800",
  "En Maintenance": "bg-gray-100 text-gray-800",
  Nettoyage: "bg-blue-100 text-blue-800",
  Réservée: "bg-purple-100 text-purple-800",
}

const typeColors = {
  Standard: "bg-blue-50 text-blue-700",
  VIP: "bg-purple-50 text-purple-700",
  "Soins Intensifs": "bg-red-50 text-red-700",
  Double: "bg-green-50 text-green-700",
  Maternité: "bg-pink-50 text-pink-700",
}

export default function RoomDetails({ roomId }) {
  const [room, setRoom] = useState(null)

  useEffect(() => {
    // In a real app, fetch room data from API
    setRoom(mockRoomDetails)
  }, [roomId])

  if (!room) {
    return <div>Chargement...</div>
  }

  const handleStatusChange = (newStatus) => {
    // In a real app, this would make an API call
    setRoom((prev) => ({ ...prev, statut: newStatus }))
  }

  return (
    <div className="space-y-6">
      {/* Room Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Bed className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Chambre {room.numero}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={typeColors[room.type]}>{room.type}</Badge>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Étage {room.etage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{room.capacite} lit(s)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{room.prix}€</p>
                <p className="text-sm text-muted-foreground">par jour</p>
              </div>
              <Badge className={statusColors[room.statut]}>{room.statut}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {room.statut !== "En Maintenance" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.statut === "Libre" && (
                <>
                  <Button onClick={() => handleStatusChange("Réservée")} size="sm">
                    Réserver
                  </Button>
                  <Button onClick={() => handleStatusChange("Nettoyage")} variant="outline" size="sm">
                    Programmer nettoyage
                  </Button>
                </>
              )}
              {room.statut === "Occupée" && (
                <Button onClick={() => handleStatusChange("Libre")} size="sm">
                  Libérer la chambre
                </Button>
              )}
              <Button onClick={() => handleStatusChange("En Maintenance")} variant="destructive" size="sm">
                Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Patient */}
      {room.patient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Actuel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">
                  {room.patient.prenom} {room.patient.nom}
                </p>
                <p className="text-sm text-muted-foreground">Médecin: {room.patient.medecin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission</p>
                <p>{new Date(room.patient.dateAdmission).toLocaleDateString("fr-FR")}</p>
                <p className="text-sm text-muted-foreground mt-2">Libération prévue</p>
                <p>{new Date(room.patient.dateLiberation).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
              <a href={`/dashboard/patients/${room.patient.id}`}>Voir le dossier patient</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Room Details Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de la Chambre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Superficie</p>
                  <p>{room.superficie} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{room.description}</p>
                </div>
                {room.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{room.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card>
              <CardHeader>
                <CardTitle>Équipements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {room.equipements.map((equipement) => (
                    <Badge key={equipement} variant="outline">
                      {equipement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Historique d'Occupation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.historique.map((sejour) => (
                  <div key={sejour.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{sejour.patient}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{sejour.duree} jours</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Du</p>
                        <p>{new Date(sejour.dateDebut).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Au</p>
                        <p>{new Date(sejour.dateFin).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Médecin: {sejour.medecin}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Historique de Maintenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.maintenance.map((intervention) => (
                  <div key={intervention.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{intervention.type}</span>
                      <Badge
                        className={
                          intervention.statut === "Terminé"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {intervention.statut}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p>{new Date(intervention.date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Technicien</p>
                        <p>{intervention.technicien}</p>
                      </div>
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
