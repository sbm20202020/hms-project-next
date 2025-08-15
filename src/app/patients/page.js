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
  const [patients, setPatients] = useState([
    // {
    //   id: 1,
    //   prenom: "Marie",
    //   nom: "Dupont",
    //   nomComplet: "Marie Dupont",
    //   dateNaissance: "1980-05-15",
    //   age: 44,
    //   sexe: "F",
    //   telephone: "0123456789",
    //   email: "marie.dupont@email.com",
    //   adresse: "123 Rue de la Paix",
    //   ville: "Abidjan",
    //   codePostal: "22501",
    //   numeroSecu: "1234567890123",
    //   typePatient: "Conventionné",
    //   convention: "cnss",
    //   contactUrgence: "Jean Dupont",
    //   telephoneUrgence: "0987654321",
    //   allergies: "Pénicilline",
    //   antecedents: "Hypertension",
    //   traitements: "Amlodipine 5mg",
    //   dateCreation: "2024-01-15T10:00:00Z",
    //   statut: "Actif",
    //   service: "Cardiologie",
    //   medecinTraitant: "Dr. Martin",
    //   derniereVisite: "2024-01-20T14:30:00Z",
    // },
    // {
    //   id: 2,
    //   prenom: "Pierre",
    //   nom: "Martin",
    //   nomComplet: "Pierre Martin",
    //   dateNaissance: "1975-12-03",
    //   age: 49,
    //   sexe: "M",
    //   telephone: "0123456790",
    //   email: "pierre.martin@email.com",
    //   adresse: "456 Avenue des Fleurs",
    //   ville: "Yamoussoukro",
    //   codePostal: "22502",
    //   numeroSecu: "9876543210987",
    //   typePatient: "Privé",
    //   convention: null,
    //   contactUrgence: "Sophie Martin",
    //   telephoneUrgence: "0123456791",
    //   allergies: "Aucune",
    //   antecedents: "Diabète type 2",
    //   traitements: "Metformine 500mg",
    //   dateCreation: "2024-01-10T09:00:00Z",
    //   statut: "Actif",
    //   service: "Endocrinologie",
    //   medecinTraitant: "Dr. Bernard",
    //   derniereVisite: "2024-01-18T11:00:00Z",
    // },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/patients")
      const patientsData = res.ok ? await res.json() : []
      
      // Only load from API if we don't have existing patients
      if (patientsData.length > 0) {
        // Transform data to match table format
        const transformedPatients = patientsData.map((patient) => ({
          ...patient,
          nomComplet: `${patient.prenom} ${patient.nom}`,
          age: new Date().getFullYear() - new Date(patient.dateNaissance).getFullYear(),
          dernierVisite: patient.derniereVisite || patient.dateCreation,
        }))
        setPatients(transformedPatients)
      }
      // Keep existing example data if API returns empty
    } catch (error) {
      console.error("Erreur lors du chargement des patients:", error)
      // Keep existing example data on error
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
            {row.age} ans • {row.sexe === "M" ? "Masculin" : row.sexe === "F" ? "Féminin" : "Autre"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {row.ville} • {row.codePostal}
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
          {row.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{row.email}</span>
            </div>
          )}
          {row.contactUrgence && (
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">{row.contactUrgence}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "typePatient",
      header: "Type & Convention",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Type de patient",
      render: (value, row) => {
        let label = "";
        let badgeVariant = "secondary";
        if (value === "insured") {
          label = "Conventionné";
          badgeVariant = "default";
        } else if (value === "private") {
          label = "Privé";
          badgeVariant = "secondary";
        } else {
          label = value;
        }
        return (
          <div className="space-y-1">
            <Badge variant={badgeVariant} className="text-xs">
              {label}
            </Badge>
            {row.convention && (
              <div className="text-xs text-muted-foreground">
                {row.convention.toUpperCase()}
              </div>
            )}
          </div>
        );
      },
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
      header: "Service & Médecin",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Service médical",
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{value}</div>
          {row.medecinTraitant && (
            <div className="text-xs text-muted-foreground">
              {row.medecinTraitant}
            </div>
          )}
        </div>
      ),
    },
    // {
    //   key: "assurance",
    //   header: "Assurance",
    //   sortable: true,
    //   filterable: true,
    //   groupable: true,
    //   filterLabel: "Type d'assurance",
    //   render: (value) => <Badge variant={value === "Convention" ? "default" : "secondary"}>{value}</Badge>,
    // },
    {
      key: "dernierVisite",
      header: "Dernière Visite",
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString("fr-FR")}
          <div className="text-xs text-muted-foreground">
            {new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      ),
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
