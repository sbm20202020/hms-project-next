"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Search, ArrowRight, Clock, CheckCircle } from "lucide-react"

export default function ReceptionPage() {
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showOrientationModal, setShowOrientationModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const patientsEnAttente = [
    { id: 1, nom: "Dupont", prenom: "Marie", heure: "09:30", statut: "En attente", service: "Consultation" },
    { id: 2, nom: "Martin", prenom: "Pierre", heure: "09:45", statut: "Orienté", service: "Laboratoire" },
    { id: 3, nom: "Bernard", prenom: "Sophie", heure: "10:00", statut: "En attente", service: "Imagerie" },
    { id: 4, nom: "Durand", prenom: "Jean", heure: "10:15", statut: "En cours", service: "Consultation" },
  ]

  const handleNewPatient = (formData) => {
    console.log("Nouveau patient:", formData)
    setShowNewPatientModal(false)
  }

  const handleSearchPatient = (searchTerm) => {
    console.log("Recherche:", searchTerm)
    setShowSearchModal(false)
  }

  const handleOrientation = (patientId, service) => {
    console.log("Orientation patient", patientId, "vers", service)
    setShowOrientationModal(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Réception</h1>
            <p className="text-gray-600">Gestion de l'accueil et création des dossiers patients</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Aujourd'hui</p>
            <p className="text-2xl font-bold text-cyan-600">{new Date().toLocaleDateString("fr-FR")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Patients Aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">4</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orientés</p>
                  <p className="text-2xl font-bold text-green-600">18</p>
                </div>
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowNewPatientModal(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-cyan-600" />
                Nouveau Patient
              </CardTitle>
              <CardDescription>Créer un nouveau dossier patient</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Créer Dossier</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowSearchModal(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-600" />
                Recherche Patient
              </CardTitle>
              <CardDescription>Rechercher un patient existant</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Rechercher
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowOrientationModal(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-emerald-600" />
                Orientation
              </CardTitle>
              <CardDescription>Orienter le patient vers un service</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Orienter</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patients en Attente</CardTitle>
            <CardDescription>Liste des patients présents à la réception</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientsEnAttente.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                      <span className="text-cyan-600 font-semibold">{patient.nom.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {patient.nom} {patient.prenom}
                      </p>
                      <p className="text-sm text-gray-500">Arrivé à {patient.heure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        patient.statut === "En attente"
                          ? "secondary"
                          : patient.statut === "Orienté"
                            ? "default"
                            : "outline"
                      }
                    >
                      {patient.statut}
                    </Badge>
                    <span className="text-sm text-gray-600">{patient.service}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setShowOrientationModal(true)
                      }}
                    >
                      Orienter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Modal
          isOpen={showNewPatientModal}
          onClose={() => setShowNewPatientModal(false)}
          title="Nouveau Patient"
          size="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleNewPatient(Object.fromEntries(formData))
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <Input name="nom" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <Input name="prenom" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <Input name="dateNaissance" type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input name="telephone" type="tel" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <Input name="adresse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de patient</label>
                <select name="typePatient" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="nouveau">Nouveau</option>
                  <option value="ancien">Ancien</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
                <select name="urgence" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="normale">Normale</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Créer Dossier
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewPatientModal(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="Rechercher un Patient">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleSearchPatient(formData.get("recherche"))
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <Input name="recherche" placeholder="Nom, prénom, téléphone ou numéro de dossier" autoFocus />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Rechercher
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowSearchModal(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={showOrientationModal} onClose={() => setShowOrientationModal(false)} title="Orientation Patient">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleOrientation(selectedPatient?.id, formData.get("service"))
            }}
            className="space-y-4"
          >
            {selectedPatient && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {selectedPatient.nom} {selectedPatient.prenom}
                </p>
                <p className="text-sm text-gray-600">Arrivé à {selectedPatient.heure}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service de destination</label>
              <select name="service" className="w-full p-2 border border-gray-300 rounded-md" required>
                <option value="">Sélectionner un service</option>
                <option value="consultation">Consultation Médicale</option>
                <option value="infirmerie">Infirmerie</option>
                <option value="laboratoire">Laboratoire</option>
                <option value="imagerie">Imagerie</option>
                <option value="caisse">Caisse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select name="priorite" className="w-full p-2 border border-gray-300 rounded-md">
                <option value="normale">Normale</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Orienter
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowOrientationModal(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
