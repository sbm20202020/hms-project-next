"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Search, Eye, Edit, Calendar, Clock, User, UserCheck } from "lucide-react"

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    date: "2024-01-22",
    time: "09:00",
    patient: "Marie Dubois",
    patientPhone: "01 23 45 67 89",
    doctor: "Dr. Martin",
    specialite: "Cardiologie",
    type: "Consultation",
    status: "Confirmé",
    duration: 30,
    notes: "Contrôle de routine",
  },
  {
    id: 2,
    date: "2024-01-22",
    time: "10:30",
    patient: "Jean Dupont",
    patientPhone: "01 98 76 54 32",
    doctor: "Dr. Leroy",
    specialite: "Pédiatrie",
    type: "Suivi",
    status: "Confirmé",
    duration: 45,
    notes: "Suivi post-opératoire",
  },
  {
    id: 3,
    date: "2024-01-23",
    time: "14:00",
    patient: "Sophie Bernard",
    patientPhone: "01 11 22 33 44",
    doctor: "Dr. Moreau",
    specialite: "Orthopédie",
    type: "Consultation",
    status: "En attente",
    duration: 30,
    notes: "Douleur au genou",
  },
  {
    id: 4,
    date: "2024-01-24",
    time: "11:00",
    patient: "Pierre Rousseau",
    patientPhone: "01 55 66 77 88",
    doctor: "Dr. Petit",
    specialite: "Neurologie",
    type: "Urgence",
    status: "Urgent",
    duration: 60,
    notes: "Maux de tête persistants",
  },
  {
    id: 5,
    date: "2024-01-20",
    time: "16:00",
    patient: "Claire Moreau",
    patientPhone: "01 77 88 99 00",
    doctor: "Dr. Martin",
    specialite: "Cardiologie",
    type: "Consultation",
    status: "Terminé",
    duration: 30,
    notes: "Résultats d'examens",
  },
]

const statusColors = {
  Confirmé: "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  Annulé: "bg-red-100 text-red-800",
  Urgent: "bg-red-100 text-red-800",
  Terminé: "bg-gray-100 text-gray-800",
}

export default function AppointmentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    const today = new Date().toISOString().split("T")[0]
    const appointmentDate = appointment.date
    let matchesDate = true

    if (dateFilter === "today") {
      matchesDate = appointmentDate === today
    } else if (dateFilter === "upcoming") {
      matchesDate = appointmentDate >= today
    } else if (dateFilter === "past") {
      matchesDate = appointmentDate < today
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle>Liste des Rendez-vous</CardTitle>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Confirmé">Confirmé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="past">Passés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun rendez-vous trouvé</p>
          ) : (
            filteredAppointments
              .sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`)
                const dateB = new Date(`${b.date} ${b.time}`)
                return dateB - dateA
              })
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(appointment.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.specialite}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.type}</p>
                      <p className="text-sm text-muted-foreground">{appointment.duration} minutes</p>
                      {appointment.notes && <p className="text-xs text-muted-foreground mt-1">{appointment.notes}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/appointments/${appointment.id}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/appointments/${appointment.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
