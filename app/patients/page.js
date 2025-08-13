"use client"

import { useState } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import PatientsList from "../../components/patients-list"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import FormModal from "../../components/ui/form-modal"
import PatientForm from "../../components/patient-form"

export default function PatientsPage() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)

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

        {/* Patients List */}
        <PatientsList />

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
