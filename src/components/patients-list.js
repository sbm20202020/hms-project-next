"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Search, Eye, Edit, Phone, Mail } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockPatients = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Marie",
    age: 45,
    telephone: "01 23 45 67 89",
    email: "marie.dubois@email.com",
    status: "Actif",
    dernierVisite: "2024-01-15",
    medecin: "Dr. Martin",
  },
  {
    id: 2,
    nom: "Dupont",
    prenom: "Jean",
    age: 32,
    telephone: "01 98 76 54 32",
    email: "jean.dupont@email.com",
    status: "Hospitalisé",
    dernierVisite: "2024-01-20",
    medecin: "Dr. Leroy",
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Sophie",
    age: 28,
    telephone: "01 11 22 33 44",
    email: "sophie.bernard@email.com",
    status: "Actif",
    dernierVisite: "2024-01-18",
    medecin: "Dr. Moreau",
  },
  {
    id: 4,
    nom: "Rousseau",
    prenom: "Pierre",
    age: 67,
    telephone: "01 55 66 77 88",
    email: "pierre.rousseau@email.com",
    status: "Sorti",
    dernierVisite: "2024-01-10",
    medecin: "Dr. Petit",
  },
]

const statusColors = {
  Actif: "bg-green-100 text-green-800",
  Hospitalisé: "bg-blue-100 text-blue-800",
  Sorti: "bg-gray-100 text-gray-800",
  Urgent: "bg-red-100 text-red-800",
}

export default function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients] = useState(mockPatients)

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des Patients</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {patient.prenom} {patient.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">{patient.age} ans</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.telephone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[patient.status]}>{patient.status}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/patients/${patient.id}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/patients/${patient.id}/edit`}>
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
