"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Search, Eye, Edit, Phone, Mail, Stethoscope, Clock } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockDoctors = [
  {
    id: 1,
    nom: "Martin",
    prenom: "Dr. Pierre",
    specialite: "Cardiologie",
    telephone: "01 23 45 67 89",
    email: "p.martin@hopital.com",
    status: "Actif",
    numeroOrdre: "12345678",
    experience: "15 ans",
    horaires: "Lun-Ven 8h-18h",
    patients: 45,
  },
  {
    id: 2,
    nom: "Leroy",
    prenom: "Dr. Marie",
    specialite: "Pédiatrie",
    telephone: "01 98 76 54 32",
    email: "m.leroy@hopital.com",
    status: "Actif",
    numeroOrdre: "87654321",
    experience: "12 ans",
    horaires: "Lun-Ven 9h-17h",
    patients: 38,
  },
  {
    id: 3,
    nom: "Moreau",
    prenom: "Dr. Jean",
    specialite: "Orthopédie",
    telephone: "01 11 22 33 44",
    email: "j.moreau@hopital.com",
    status: "En congé",
    numeroOrdre: "11223344",
    experience: "20 ans",
    horaires: "Mar-Sam 10h-19h",
    patients: 52,
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Dr. Sophie",
    specialite: "Neurologie",
    telephone: "01 55 66 77 88",
    email: "s.petit@hopital.com",
    status: "Actif",
    numeroOrdre: "44332211",
    experience: "8 ans",
    horaires: "Lun-Jeu 8h-16h",
    patients: 29,
  },
]

const statusColors = {
  Actif: "bg-green-100 text-green-800",
  "En congé": "bg-yellow-100 text-yellow-800",
  Inactif: "bg-gray-100 text-gray-800",
  Urgence: "bg-red-100 text-red-800",
}

const specialiteColors = {
  Cardiologie: "bg-red-50 text-red-700",
  Pédiatrie: "bg-blue-50 text-blue-700",
  Orthopédie: "bg-green-50 text-green-700",
  Neurologie: "bg-purple-50 text-purple-700",
  Généraliste: "bg-gray-50 text-gray-700",
}

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [doctors] = useState(mockDoctors)

  const filteredDoctors = doctors.filter(
    (doctor) =>
      `${doctor.prenom} ${doctor.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des Médecins</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un médecin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {doctor.prenom} {doctor.nom}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Stethoscope className="h-3 w-3 text-muted-foreground" />
                    <Badge className={specialiteColors[doctor.specialite] || "bg-gray-50 text-gray-700"}>
                      {doctor.specialite}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.telephone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm">{doctor.horaires}</span>
                    <p className="text-xs text-muted-foreground">{doctor.patients} patients</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[doctor.status]}>{doctor.status}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/doctors/${doctor.id}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/doctors/${doctor.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
