"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Calendar, Clock, User, UserCheck, FileText, Phone, Mail, AlertTriangle } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockAppointmentDetails = {
  id: 1,
  date: "2024-01-22",
  time: "09:00",
  duration: 30,
  type: "Consultation",
  status: "Confirmé",
  motif: "Contrôle de routine",
  notes: "Patient se plaint de douleurs thoraciques occasionnelles",
  urgence: false,
  patient: {
    id: 1,
    nom: "Dubois",
    prenom: "Marie",
    age: 45,
    telephone: "01 23 45 67 89",
    email: "marie.dubois@email.com",
  },
  doctor: {
    id: 1,
    nom: "Martin",
    prenom: "Dr. Pierre",
    specialite: "Cardiologie",
    telephone: "01 23 45 67 89",
    email: "p.martin@hopital.com",
  },
  createdAt: "2024-01-15T10:30:00",
  updatedAt: "2024-01-20T14:15:00",
}

const statusColors = {
  Confirmé: "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  Annulé: "bg-red-100 text-red-800",
  Urgent: "bg-red-100 text-red-800",
  Terminé: "bg-gray-100 text-gray-800",
}

export default function AppointmentDetails({ appointmentId }) {
  const [appointment, setAppointment] = useState(null)

  useEffect(() => {
    // In a real app, fetch appointment data from API
    setAppointment(mockAppointmentDetails)
  }, [appointmentId])

  if (!appointment) {
    return <div>Chargement...</div>
  }

  const handleStatusChange = (newStatus) => {
    // In a real app, this would make an API call
    setAppointment((prev) => ({ ...prev, status: newStatus }))
  }

  return (
    <div className="space-y-6">
      {/* Appointment Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {appointment.type} - {appointment.patient.prenom} {appointment.patient.nom}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(appointment.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {appointment.time} ({appointment.duration} min)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {appointment.urgence && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              )}
              <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {appointment.status !== "Terminé" && appointment.status !== "Annulé" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {appointment.status === "En attente" && (
                <Button onClick={() => handleStatusChange("Confirmé")} size="sm">
                  Confirmer
                </Button>
              )}
              {appointment.status === "Confirmé" && (
                <Button onClick={() => handleStatusChange("Terminé")} size="sm">
                  Marquer comme terminé
                </Button>
              )}
              <Button onClick={() => handleStatusChange("Annulé")} variant="destructive" size="sm">
                Annuler
              </Button>
              <Button variant="outline" size="sm">
                Reprogrammer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                {appointment.patient.prenom} {appointment.patient.nom}
              </p>
              <p className="text-sm text-muted-foreground">{appointment.patient.age} ans</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patient.telephone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patient.email}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/dashboard/patients/${appointment.patient.id}`}>Voir le dossier patient</a>
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Médecin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">
                {appointment.doctor.prenom} {appointment.doctor.nom}
              </p>
              <p className="text-sm text-muted-foreground">{appointment.doctor.specialite}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.doctor.telephone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.doctor.email}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/doctors/${appointment.doctor.id}`}>Voir le profil médecin</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Détails de la Consultation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointment.motif && (
            <div>
              <p className="text-sm text-muted-foreground">Motif de consultation</p>
              <p>{appointment.motif}</p>
            </div>
          )}
          {appointment.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p>{appointment.notes}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Créé le</p>
              <p>{new Date(appointment.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dernière modification</p>
              <p>{new Date(appointment.updatedAt).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
