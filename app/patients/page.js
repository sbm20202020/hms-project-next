"use client"

import { useState } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import AdvancedTable from "../../components/ui/advanced-table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Plus, Eye, Edit, Phone, Mail } from "lucide-react"
import FormModal from "../../components/ui/form-modal"
import PatientForm from "../../components/patient-form"

const mockPatients = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Marie",
    nomComplet: "Marie Dubois",
    age: 45,
    sexe: "F",
    telephone: "01 23 45 67 89",
    email: "marie.dubois@email.com",
    status: "Actif",
    dernierVisite: "2024-01-15",
    medecin: "Dr. Martin",
    assurance: "CNSS",
    ville: "Abidjan",
    service: "Cardiologie",
  },
  {
    id: 2,
    nom: "Dupont",
    prenom: "Jean",
    nomComplet: "Jean Dupont",
    age: 32,
    sexe: "M",
    telephone: "01 98 76 54 32",
    email: "jean.dupont@email.com",
    status: "Hospitalisé",
    dernierVisite: "2024-01-20",
    medecin: "Dr. Leroy",
    assurance: "Privé",
    ville: "Bouaké",
    service: "Pédiatrie",
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Sophie",
    nomComplet: "Sophie Bernard",
    age: 28,
    sexe: "F",
    telephone: "01 11 22 33 44",
    email: "sophie.bernard@email.com",
    status: "Actif",
    dernierVisite: "2024-01-18",
    medecin: "Dr. Moreau",
    assurance: "CNSS",
    ville: "Yamoussoukro",
    service: "Orthopédie",
  },
  {
    id: 4,
    nom: "Rousseau",
    prenom: "Pierre",
    nomComplet: "Pierre Rousseau",
    age: 67,
    sexe: "M",
    telephone: "01 55 66 77 88",
    email: "pierre.rousseau@email.com",
    status: "Sorti",
    dernierVisite: "2024-01-10",
    medecin: "Dr. Petit",
    assurance: "Privé",
    ville: "San-Pédro",
    service: "Neurologie",
  },
  {
    id: 5,
    nom: "Kouassi",
    prenom: "Aya",
    nomComplet: "Aya Kouassi",
    age: 35,
    sexe: "F",
    telephone: "05 12 34 56 78",
    email: "aya.kouassi@email.com",
    status: "Actif",
    dernierVisite: "2024-01-22",
    medecin: "Dr. Martin",
    assurance: "CNSS",
    ville: "Abidjan",
    service: "Gynécologie",
  },
]

const statusColors = {
  Actif: "bg-green-100 text-green-800",
  Hospitalisé: "bg-blue-100 text-blue-800",
  Sorti: "bg-gray-100 text-gray-800",
  Urgent: "bg-red-100 text-red-800",
}

export default function PatientsPage() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)

  const columns = [
    {
      key: "nomComplet",
      header: "Patient",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">
            {row.age} ans • {row.sexe === "M" ? "Masculin" : "Féminin"}
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
      key: "status",
      header: "Statut",
      sortable: true,
      filterable: true,
      groupable: true,
      render: (value) => <Badge className={statusColors[value]}>{value}</Badge>,
    },
    {
      key: "service",
      header: "Service",
      sortable: true,
      filterable: true,
      groupable: true,
    },
    {
      key: "medecin",
      header: "Médecin",
      sortable: true,
      filterable: true,
      groupable: true,
    },
    {
      key: "assurance",
      header: "Assurance",
      sortable: true,
      filterable: true,
      groupable: true,
      render: (value) => <Badge variant={value === "CNSS" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "ville",
      header: "Ville",
      sortable: true,
      filterable: true,
      groupable: true,
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
        // Navigate to patient details
        window.location.href = `/patients/${row.id}`
      },
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        // Open edit modal or navigate to edit page
        console.log("Edit patient:", row)
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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
          data={mockPatients}
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
          <PatientForm onSuccess={() => setIsNewPatientModalOpen(false)} />
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
