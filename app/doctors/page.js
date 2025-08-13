"use client"

import { useState } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import DoctorsList from "../../components/doctors-list"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import FormModal from "../../components/ui/form-modal"
import DoctorForm from "../../components/doctor-form"

export default function DoctorsPage() {
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false)

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

        {/* Doctors List */}
        <DoctorsList />

        <FormModal
          isOpen={isNewDoctorModalOpen}
          onClose={() => setIsNewDoctorModalOpen(false)}
          title="Nouveau Médecin"
          description="Ajouter un nouveau médecin au personnel"
        >
          <DoctorForm onSuccess={() => setIsNewDoctorModalOpen(false)} />
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
