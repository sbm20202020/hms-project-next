"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  Search,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react"

export default function ReceptionPage() {
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showOrientationModal, setShowOrientationModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [notification, setNotification] = useState(null)
  const [filterStatus, setFilterStatus] = useState("tous")
  const [patientSearchTerm, setPatientSearchTerm] = useState("")

  const [patientsEnAttente, setPatientsEnAttente] = useState([])
  const [dossierPatient, setDossierPatient] = useState([])

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch("/api/patients")
      const data = await response.json()
      setPatientsEnAttente(data)
    }

    const fetchDossiers = async () => {
      const response = await fetch("/api/dossiers")
      const data = await response.json()
      setDossierPatient(data)
    }
    fetchPatients()
    fetchDossiers()
  }, [])

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleNewPatient = (formData) => {
    const newPatient = {
      id: Date.now(),
      nom: formData.nom,
      prenom: formData.prenom,
      heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      statut: "En attente",
      service: "Réception",
      priorite: formData.urgence || "normale",
      telephone: formData.telephone,
      age: formData.dateNaissance ? new Date().getFullYear() - new Date(formData.dateNaissance).getFullYear() : null,
      motif: formData.motif || "Non spécifié",
      typePatient: formData.typePatient || "prive",
      convention: formData.convention || null,
    }

    setPatientsEnAttente((prev) => [...prev, newPatient])
    setShowNewPatientModal(false)
    showNotification(`Dossier créé pour ${newPatient.prenom} ${newPatient.nom}`)
  }

  const handleSearchPatient = async (searchTerm) => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      const results = patientsEnAttente.filter(
        (patient) =>
          patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.telephone.includes(searchTerm),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const handleOrientation = (patientId, service, priorite) => {
    setPatientsEnAttente((prev) =>
      prev.map((patient) =>
        patient.id === patientId ? { ...patient, statut: "Orienté", service, priorite } : patient,
      ),
    )
    setShowOrientationModal(false)
    setSelectedPatient(null)
    showNotification(`Patient orienté vers ${service}`)
  }

  const filteredDossierPatients = dossierPatient.filter((dossierPatient) => {
    if (filterStatus === "tous") return true
    return dossierPatient.statut.toLowerCase().includes(filterStatus.toLowerCase())
  })

  const filteredPatientsForSearch = patientsEnAttente.filter((patient) => {
    if (!patientSearchTerm) return []
    const searchLower = patientSearchTerm.toLowerCase()
    return (
      patient.nom.toLowerCase().includes(searchLower) ||
      patient.prenom.toLowerCase().includes(searchLower) ||
      patient.telephone.includes(patientSearchTerm) ||
      patient.id.toString().includes(patientSearchTerm)
    )
    
  })

  const stats = {
    total: patientsEnAttente.length,
    enAttente: patientsEnAttente.filter((p) => p.statut === "En attente").length,
    orientes: patientsEnAttente.filter((p) => p.statut === "Orienté").length,
    termines: patientsEnAttente.filter((p) => p.statut === "Terminé").length,
    urgents: patientsEnAttente.filter((p) => p.priorite === "urgente").length,
  }

  const toggleConventionSection = (typePatient) => {
    const conventionSection = document.getElementById('conventionSection')
    if (conventionSection) {
      if (typePatient === 'conventionne') {
        conventionSection.classList.remove('hidden')
      } else {
        conventionSection.classList.add('hidden')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Réception
            </h1>
            <p className="text-gray-600 mt-1">Gestion de l'accueil et création des dossiers patients</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Aujourd'hui</p>
            <p className="text-2xl font-bold text-cyan-600">{new Date().toLocaleDateString("fr-FR")}</p>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-lg border-l-4 ${
              notification.type === "success"
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-red-50 border-red-400 text-red-700"
            } animate-in slide-in-from-top duration-300`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {notification.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">Total Patients</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stats.total}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  <span>+12%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">En Attente</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stats.enAttente}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <span>+5%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">Orientés</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stats.orientes}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  <span>+8%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">Terminés</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stats.termines}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <span>+15%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">Urgents</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stats.urgents}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  <span>-2%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                <UserPlus className="h-6 w-6" />
                Dossier Patient
              </CardTitle>
              <CardDescription>Créer un nouveau dossier patient avec informations complètes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                onClick={() => setShowNewPatientModal(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Créer Dossier
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Search className="h-6 w-6" />
                Recherche Patient
              </CardTitle>
              <CardDescription>Rechercher un patient existant dans la base de données</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 shadow-lg bg-transparent"
                onClick={() => setShowSearchModal(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <ArrowRight className="h-6 w-6" />
                Orientation Rapide
              </CardTitle>
              <CardDescription>Orienter rapidement et immédiatement un patient vers le service adéquat</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
                onClick={() => setShowOrientationModal(true)}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Orienter
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-600" />
                  Patients en Attente
                </CardTitle>
                <CardDescription>Liste des patients présents à la réception</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="attente">En attente</option>
                  <option value="oriente">Orientés</option>
                  <option value="encours">En cours</option>
                  <option value="traite">Traités</option>
                </select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDossierPatients.map((dossierPatient) => (
                <div
                  key={dossierPatient.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        dossierPatient.niveauUrgence === "urgente" ? "bg-red-500" : "bg-cyan-500"
                      }`}
                    >
                      {dossierPatient.patient.nom.charAt(0)}
                      {dossierPatient.patient.prenom.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {dossierPatient.patient.nom} {dossierPatient.patient.prenom}
                        </p>
                        {dossierPatient.patient.priorite === "urgente" && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(dossierPatient.dateCreation).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {dossierPatient.patient.age} ans
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {dossierPatient.patient.telephone}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{dossierPatient.patient.motif}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={dossierPatient.patient.typePatient === "conventionne" ? "default" : "secondary"} className="text-xs">
                          {dossierPatient.patient.typePatient === "conventionne" ? "Conventionné" : "Privé"}
                        </Badge>
                        {dossierPatient.patient.convention && (
                          <Badge variant="outline" className="text-xs">
                            {dossierPatient.patient.convention}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        dossierPatient.statut === "attente"
                          ? "secondary"
                          : dossierPatient.statut === "oriente"
                            ? "default"
                            : dossierPatient.statut === "encours"
                              ? "outline"
                              : "destructive"
                      }
                      className="min-w-[80px] justify-center"
                    >
                      {dossierPatient.statut === "attente" ? "En attente" : dossierPatient.statut === "oriente" ? "Orienté" : dossierPatient.statut === "encours" ? "En cours" : "Traité"}
                    </Badge>
                    <span className="text-sm text-gray-600 min-w-[100px]">{dossierPatient.service?.nom}</span>
                    {dossierPatient.statut === "attente" && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setSelectedPatient(dossierPatient.patient)
                        setShowOrientationModal(true)
                      }}
                    >
                    <ArrowRight className="h-4 w-4 mr-1" />
                      Orienter
                    </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Modal
          isOpen={showNewPatientModal}
          onClose={() => setShowNewPatientModal(false)}
          title="Dossier Patient"
          size="lg"
        >
          <div className="space-y-6">
            {/* Choix du type de dossier */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dossierType"
                  value="nouveau"
                  defaultChecked
                  onChange={(e) => {
                    const existingPatientSection = document.getElementById('existingPatientSection')
                    const newPatientSection = document.getElementById('newPatientSection')
                    if (e.target.value === 'nouveau') {
                      existingPatientSection?.classList.add('hidden')
                      newPatientSection?.classList.remove('hidden')
                    } else {
                      existingPatientSection?.classList.remove('hidden')
                      newPatientSection?.classList.add('hidden')
                    }
                  }}
                  className="text-cyan-600"
                />
                <span className="font-medium">Nouveau Patient</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dossierType"
                  value="existant"
                  onChange={(e) => {
                    const existingPatientSection = document.getElementById('existingPatientSection')
                    const newPatientSection = document.getElementById('newPatientSection')
                    if (e.target.value === 'existant') {
                      existingPatientSection?.classList.remove('hidden')
                      newPatientSection?.classList.add('hidden')
                    } else {
                      existingPatientSection?.classList.add('hidden')
                      newPatientSection?.classList.remove('hidden')
                    }
                  }}
                  className="text-cyan-600"
                />
                <span className="font-medium">Patient Existant</span>
              </label>
            </div>

            {/* Section Patient Existant */}
            <div id="existingPatientSection" className="hidden space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Rechercher un Patient Existant *
                </label>
                <div className="relative">
                  <Input
                    placeholder="Nom, prénom, téléphone ou numéro de dossier..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="w-full pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {patientSearchTerm && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md mt-1">
                    {filteredPatientsForSearch.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          selectedPatient?.id === patient.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {patient.nom.charAt(0)}
                            {patient.prenom.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {patient.nom} {patient.prenom}
                            </p>
                            <p className="text-sm text-gray-600">
                              {patient.age} ans • {patient.telephone} • {patient.heure}
                            </p>
                          </div>
                          {selectedPatient?.id === patient.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedPatient.nom.charAt(0)}
                      {selectedPatient.prenom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedPatient.nom} {selectedPatient.prenom}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.age} ans • {selectedPatient.telephone} • {selectedPatient.heure}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={selectedPatient.typePatient === "conventionne" ? "default" : "secondary"} className="text-xs">
                          {selectedPatient.typePatient === "conventionne" ? "Conventionné" : "Privé"}
                        </Badge>
                        {selectedPatient.convention && (
                          <Badge variant="outline" className="text-xs">
                            {selectedPatient.convention}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Niveau d'urgence
                  </label>
                  <select name="urgenceExistant" className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="normale">Normale</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motif de la visite</label>
                  <textarea
                    name="motifExistant"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Décrivez brièvement le motif de la consultation..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  disabled={!selectedPatient}
                  onClick={async () => {
                    if (selectedPatient) {
                      // Collect only data from the existing patient section form fields
                      const container = document.getElementById("existingPatientSection")
                      if (container) {
                        const data = {}
                        const urgenceEl = container.querySelector('[name="urgenceExistant"]')
                        const motifEl = container.querySelector('[name="motifExistant"]')
                        if (urgenceEl) data.urgence = urgenceEl.value
                        if (motifEl) data.motif = motifEl.value
                        console.log("Form data (existant):", data)

                        const newDossier = {
                          patientId: selectedPatient.id,
                          dateCreation: new Date(),
                          niveauUrgence: data.urgence,
                          motifDeVisite: data.motif,
                          patient: selectedPatient,
                          service: {}
                        }
                        // await fetch("/api/dossiers", {
                        //   method: "POST",
                        //   headers: {
                        //     "Content-Type": "application/json",
                        //   },
                        //   body: JSON.stringify(newDossier),
                        // })  
                        // Todo: Ajouter le dossier à la liste des dossiers en attente
                        console.log("newDossier------------", newDossier)
                        // console.log("selectedPatient------------", selectedPatient)
                        setDossierPatient((prev) => [...prev, newDossier])
                        setShowNewPatientModal(false)
                        setSelectedPatient(null)
                        setPatientSearchTerm("")
                        showNotification(`Dossier créé pour ${newDossier?.patient?.prenom} ${newDossier?.patient?.nom}`)
                      }
                    }
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer le Dossier
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewPatientModal(false)}>
                  Annuler
                </Button>
              </div>
            </div>

            {/* Section Nouveau Patient */}
            <form id="newPatientSection" onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleNewPatient(Object.fromEntries(formData))
            }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Nom *
                </label>
                <Input name="nom" required className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Prénom *
                </label>
                <Input name="prenom" required className="border-gray-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date de naissance
                </label>
                <Input name="dateNaissance" type="date" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Téléphone *
                </label>
                <Input name="telephone" type="tel" required className="border-gray-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Adresse complète
              </label>
              <Input name="adresse" className="border-gray-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motif de la visite</label>
              <textarea
                name="motif"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Décrivez brièvement le motif de la consultation..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de patient</label>
                <select 
                  name="typePatient" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    // Reset convention if switching to private
                    if (e.target.value === "prive") {
                      const form = e.target.form
                      if (form && form.convention) {
                        form.convention.value = ""
                      }
                    }
                    toggleConventionSection(e.target.value)
                  }}
                >
                  <option value="prive">Patient privé</option>
                  <option value="conventionne">Patient conventionné</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Niveau d'urgence
                </label>
                <select name="urgence" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="normale">Normale</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div id="conventionSection" className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Convention *
              </label>
              <select name="convention" className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Sélectionner une convention</option>
                <optgroup label="Entreprises">
                  <option value="cnss">CNSS - Caisse Nationale de Sécurité Sociale</option>
                  <option value="cnrps">CNRPS - Caisse Nationale de Retraite et de Prévoyance Sociale</option>
                  <option value="cnas">CNAS - Caisse Nationale des Assurances Sociales</option>
                  <option value="cnam">CNAM - Caisse Nationale d'Assurance Maladie</option>
                </optgroup>
                <optgroup label="Sociétés Privées">
                  <option value="sotra">SOTRA - Société de Transport d'Abidjan</option>
                  <option value="sodeci">SODECI - Société de Distribution d'Eau de Côte d'Ivoire</option>
                  <option value="cienergies">CIE - Compagnie Ivoirienne d'Électricité</option>
                  <option value="portabidjan">Port Autonome d'Abidjan</option>
                  <option value="aeroport">Aéroport International Félix Houphouët-Boigny</option>
                </optgroup>
                <optgroup label="Associations & ONG">
                  <option value="croixrouge">Croix-Rouge Ivoirienne</option>
                  <option value="medecinsmonde">Médecins du Monde</option>
                  <option value="msf">MSF - Médecins Sans Frontières</option>
                  <option value="unicef">UNICEF</option>
                  <option value="oms">OMS - Organisation Mondiale de la Santé</option>
                </optgroup>
                <optgroup label="Institutions Publiques">
                  <option value="armee">Armée de Côte d'Ivoire</option>
                  <option value="police">Police Nationale</option>
                  <option value="gendarmerie">Gendarmerie Nationale</option>
                  <option value="douane">Douane Ivoirienne</option>
                  <option value="impots">Direction Générale des Impôts</option>
                </optgroup>
                <optgroup label="Autres">
                  <option value="autre">Autre convention</option>
                </optgroup>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Créer le Dossier
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewPatientModal(false)}>
                Annuler
              </Button>
            </div>
          </form>
          </div>
        </Modal>

        <Modal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          title="Rechercher un Patient"
          size="lg"
        >
          <div className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleSearchPatient(formData.get("recherche"))
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Critères de recherche
                </label>
                <Input
                  name="recherche"
                  placeholder="Nom, prénom, téléphone ou numéro de dossier"
                  autoFocus
                  className="border-gray-300"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSearching}>
                  {isSearching ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {isSearching ? "Recherche..." : "Rechercher"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSearchModal(false)}>
                  Annuler
                </Button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Résultats de recherche</h3>
                <div className="space-y-2">
                  {searchResults.map((patient) => (
                    <div key={patient.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {patient.nom} {patient.prenom}
                        </p>
                        <p className="text-sm text-gray-600">{patient.telephone}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setShowSearchModal(false)
                          setShowOrientationModal(true)
                        }}
                      >
                        Sélectionner
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          isOpen={showOrientationModal}
          onClose={() => setShowOrientationModal(false)}
          title="Orientation Patient"
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleOrientation(selectedPatient?.id, formData.get("service"), formData.get("priorite"))
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Sélectionner un Patient *
              </label>
              <div className="relative">
                <Input
                  placeholder="Rechercher un patient..."
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                  className="w-full pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {patientSearchTerm && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md mt-1">
                  {filteredPatientsForSearch.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedPatient?.id === patient.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {patient.nom.charAt(0)}
                          {patient.prenom.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {patient.nom} {patient.prenom}
                          </p>
                          <p className="text-sm text-gray-600">
                            {patient.age} ans • {patient.telephone} • {patient.heure}
                          </p>
                        </div>
                        {selectedPatient?.id === patient.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedPatient.nom.charAt(0)}
                    {selectedPatient.prenom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedPatient.nom} {selectedPatient.prenom}
                    </p>
                    <p className="text-sm text-gray-600">Arrivé à {selectedPatient.heure}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ArrowRight className="h-4 w-4 inline mr-1" />
                Service de destination *
              </label>
              <select name="service" className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Sélectionner un service</option>
                <option value="Consultation Médicale">🩺 Consultation Médicale</option>
                <option value="Infirmerie">💉 Infirmerie</option>
                <option value="Laboratoire">🧪 Laboratoire</option>
                <option value="Imagerie">📷 Imagerie Médicale</option>
                <option value="Caisse">💳 Caisse</option>
                <option value="Pharmacie">💊 Pharmacie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Niveau de priorité
              </label>
              <select name="priorite" className="w-full p-3 border border-gray-300 rounded-md">
                <option value="normale">🟢 Normale</option>
                <option value="urgente">🔴 Urgente</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                disabled={!selectedPatient}
                onClick={() => {
                  console.log("selectedPatient", selectedPatient)
                  setPatientsEnAttente((prev) =>
                    prev.map((patient) =>
                      patient.id === selectedPatient.id ? { ...patient, statut: "Orienté" } : patient,
                    ),
                  )
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Orienter le Patient
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
