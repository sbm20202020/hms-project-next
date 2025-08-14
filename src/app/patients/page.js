"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import AdvancedTable from "../../components/ui/advanced-table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Plus, Eye, Edit, Phone, Mail } from "lucide-react"
import FormModal from "../../components/ui/form-modal"
import PatientForm from "../../components/patient-form"

const statusColors = {
  Actif: "bg-green-100 text-green-800",
  "En traitement": "bg-blue-100 text-blue-800",
  Hospitalisé: "bg-blue-100 text-blue-800",
  Sorti: "bg-gray-100 text-gray-800",
  Urgent: "bg-red-100 text-red-800",
}

export default function PatientsPage() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/patients")
      const patientsData = res.ok ? await res.json() : []
      // Transform data to match table format
      const transformedPatients = patientsData.map((patient) => ({
        ...patient,
        nomComplet: `${patient.prenom} ${patient.nom}`,
        age: new Date().getFullYear() - new Date(patient.dateNaissance).getFullYear(),
        dernierVisite: patient.derniereVisite || patient.dateCreation,
      }))
      setPatients(transformedPatients)
    } catch (error) {
      console.error("Erreur lors du chargement des patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPatient = (newPatient) => {
    if (!newPatient) {
      console.error("No patient data provided")
      return
    }

    try {
      fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error("Failed to add patient")
          return r.json()
        })
        .then((addedPatient) => {
          const transformedPatient = {
            ...addedPatient,
            nomComplet: `${addedPatient.prenom} ${addedPatient.nom}`,
            age: new Date().getFullYear() - new Date(addedPatient.dateNaissance).getFullYear(),
            dernierVisite: addedPatient.derniereVisite || addedPatient.dateCreation,
          }
          setPatients((prev) => [...prev, transformedPatient])
          setIsNewPatientModalOpen(false)
        })
        .catch((err) => {
          console.error("Error adding patient:", err)
        })
    } catch (error) {
      console.error("Error adding patient:", error)
    }
  }

  const columns = [
    {
      key: "nomComplet",
      header: "Patient",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">
            {row.age} ans • {row.sexe === "Masculin" ? "Masculin" : "Féminin"}
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
            <span className="text-sm">{value}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Statut du patient",
      render: (value) => <Badge className={statusColors[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>,
    },
    {
      key: "service",
      header: "Service",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Service médical",
    },
    {
      key: "medecinTraitant",
      header: "Médecin",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Médecin traitant",
    },
    {
      key: "assurance",
      header: "Assurance",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Type d'assurance",
      render: (value) => <Badge variant={value === "CNSS" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "ville",
      header: "Ville",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Ville de résidence",
    },
    {
      key: "dernierVisite",
      header: "Dernière Visite",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
  ]

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        window.location.href = `/patients/${row.id}`
      },
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        console.log("Edit patient:", row)
      },
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des patients...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Patients</h1>
            <p className="text-muted-foreground">Gérer tous les patients de l'hôpital</p>
          </div>
          <Button onClick={() => setIsNewPatientModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Patient
          </Button>
        </div>

        <AdvancedTable
          title="Liste des Patients"
          data={patients}
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
          isOpen={isNewPatientModalOpen}
          onClose={() => setIsNewPatientModalOpen(false)}
          title="Nouveau Patient"
          description="Enregistrer un nouveau patient dans le système"
        >
          <PatientForm onSuccess={handleAddPatient} />
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
