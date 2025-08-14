"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import AdvancedTable from "../../components/ui/advanced-table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Plus, Eye, Edit, Phone, Mail, Stethoscope, Clock } from "lucide-react"
import FormModal from "../../components/ui/form-modal"
import DoctorForm from "../../components/doctor-form"
// import { db } from "../../lib/database"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      // await db.initializeData()
      const doctorsData = []
      setDoctors(doctorsData)
    } catch (error) {
      console.error("Error loading doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDoctor = (newDoctor) => {
    const addedDoctor = db.add("doctors", newDoctor)
    setDoctors((prev) => [...prev, addedDoctor])
    setIsNewDoctorModalOpen(false)
  }

  const columns = [
    {
      key: "nom",
      header: "Médecin",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">
            {row.prenom} {row.nom}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <Stethoscope className="h-3 w-3 text-muted-foreground" />
            <Badge className="bg-blue-50 text-blue-700">{row.specialite}</Badge>
          </div>
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Contact",
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{row.telephone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "specialite",
      header: "Spécialité",
      filterable: true,
      filterLabel: "Spécialité médicale",
      sortable: true,
      groupable: true,
    },
    {
      key: "statut",
      header: "Statut",
      filterable: true,
      filterLabel: "Statut du médecin",
      sortable: true,
      render: (value) => (
        <Badge
          className={
            value === "Actif"
              ? "bg-green-100 text-green-800"
              : value === "En congé"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "horaires",
      header: "Horaires & Patients",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm">{row.horaires}</span>
            <p className="text-xs text-muted-foreground">{row.patients} patients</p>
          </div>
        </div>
      ),
    },
    {
      key: "experience",
      header: "Expérience",
      sortable: true,
    },
    {
      key: "numeroOrdre",
      header: "N° Ordre",
      sortable: true,
    },
  ]

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      onClick: (doctor) => (window.location.href = `/doctors/${doctor.id}`),
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: (doctor) => (window.location.href = `/doctors/${doctor.id}/edit`),
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des médecins...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Médecins</h1>
            <p className="text-muted-foreground">Gérer le personnel médical de l'hôpital</p>
          </div>
          <Button onClick={() => setIsNewDoctorModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Médecin
          </Button>
        </div>

        {/* Advanced Table */}
        <AdvancedTable
          title="Liste des Médecins"
          data={doctors}
          columns={columns}
          actions={actions}
          searchable={true}
          filterable={true}
          sortable={true}
          groupable={true}
          exportable={true}
          pageSize={10}
        />

        <FormModal
          isOpen={isNewDoctorModalOpen}
          onClose={() => setIsNewDoctorModalOpen(false)}
          title="Nouveau Médecin"
          description="Ajouter un nouveau médecin au personnel"
        >
          <DoctorForm onSuccess={handleAddDoctor} />
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
