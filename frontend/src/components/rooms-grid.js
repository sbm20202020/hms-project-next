"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Search, Eye, Edit, Bed, Users, Wifi, Tv, Car } from "lucide-react"

// Mock rooms data
const mockRooms = [
  {
    id: 101,
    numero: "101",
    etage: 1,
    type: "Standard",
    statut: "Libre",
    capacite: 1,
    patient: null,
    prix: 150,
    equipements: ["Wifi", "TV", "Climatisation"],
    dateLiberation: null,
  },
  {
    id: 102,
    numero: "102",
    etage: 1,
    type: "Standard",
    statut: "Occupée",
    capacite: 1,
    patient: "Marie Dubois",
    prix: 150,
    equipements: ["Wifi", "TV"],
    dateLiberation: "2024-01-25",
  },
  {
    id: 201,
    numero: "201",
    etage: 2,
    type: "VIP",
    statut: "Libre",
    capacite: 1,
    patient: null,
    prix: 300,
    equipements: ["Wifi", "TV", "Climatisation", "Réfrigérateur", "Balcon"],
    dateLiberation: null,
  },
  {
    id: 202,
    numero: "202",
    etage: 2,
    type: "VIP",
    statut: "Occupée",
    capacite: 1,
    patient: "Jean Dupont",
    prix: 300,
    equipements: ["Wifi", "TV", "Climatisation", "Réfrigérateur"],
    dateLiberation: "2024-01-28",
  },
  {
    id: 301,
    numero: "301",
    etage: 3,
    type: "Soins Intensifs",
    statut: "Occupée",
    capacite: 1,
    patient: "Sophie Bernard",
    prix: 500,
    equipements: ["Monitoring", "Oxygène", "Défibrillateur"],
    dateLiberation: "2024-01-30",
  },
  {
    id: 302,
    numero: "302",
    etage: 3,
    type: "Soins Intensifs",
    statut: "En Maintenance",
    capacite: 1,
    patient: null,
    prix: 500,
    equipements: ["Monitoring", "Oxygène"],
    dateLiberation: null,
  },
  {
    id: 103,
    numero: "103",
    etage: 1,
    type: "Double",
    statut: "Partiellement Occupée",
    capacite: 2,
    patient: "Pierre Rousseau",
    prix: 200,
    equipements: ["Wifi", "TV", "Climatisation"],
    dateLiberation: null,
  },
  {
    id: 104,
    numero: "104",
    etage: 1,
    type: "Standard",
    statut: "Nettoyage",
    capacite: 1,
    patient: null,
    prix: 150,
    equipements: ["Wifi", "TV"],
    dateLiberation: null,
  },
]

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

const equipmentIcons = {
  Wifi: Wifi,
  TV: Tv,
  Parking: Car,
  Climatisation: "❄️",
  Réfrigérateur: "🧊",
  Balcon: "🏠",
  Monitoring: "📊",
  Oxygène: "🫁",
  Défibrillateur: "⚡",
}

export default function RoomsGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [etageFilter, setEtageFilter] = useState("all")

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch =
      room.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.patient && room.patient.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || room.statut === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter
    const matchesEtage = etageFilter === "all" || room.etage.toString() === etageFilter

    return matchesSearch && matchesStatus && matchesType && matchesEtage
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle>Chambres de l'Hôpital</CardTitle>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une chambre..."
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
                <SelectItem value="Libre">Libre</SelectItem>
                <SelectItem value="Occupée">Occupée</SelectItem>
                <SelectItem value="En Maintenance">En Maintenance</SelectItem>
                <SelectItem value="Nettoyage">Nettoyage</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Soins Intensifs">Soins Intensifs</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
              </SelectContent>
            </Select>
            <Select value={etageFilter} onValueChange={setEtageFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Étage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="1">Étage 1</SelectItem>
                <SelectItem value="2">Étage 2</SelectItem>
                <SelectItem value="3">Étage 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                room.statut === "Libre"
                  ? "border-green-200 hover:border-green-300"
                  : room.statut === "Occupée"
                    ? "border-red-200 hover:border-red-300"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span className="font-bold text-lg">Chambre {room.numero}</span>
                  </div>
                  <Badge className={statusColors[room.statut]}>{room.statut}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={typeColors[room.type]}>{room.type}</Badge>
                  <span className="text-sm text-muted-foreground">Étage {room.etage}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capacité: {room.capacite}</span>
                  </div>
                  <span className="font-medium text-primary">{room.prix}€/jour</span>
                </div>

                {room.patient && (
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Patient: {room.patient}</p>
                    {room.dateLiberation && (
                      <p className="text-xs text-muted-foreground">
                        Libération prévue: {new Date(room.dateLiberation).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Équipements:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipements.slice(0, 3).map((equipement) => (
                      <Badge key={equipement} variant="outline" className="text-xs">
                        {equipement}
                      </Badge>
                    ))}
                    {room.equipements.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.equipements.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <a href={`/rooms/${room.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <a href={`/rooms/${room.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
