import DashboardLayout from "../../../components/dashboard-layout"
import PatientForm from "../../../components/patient-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function NewPatientPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouveau Patient</h1>
            <p className="text-muted-foreground">Enregistrer un nouveau patient</p>
          </div>
        </div>

        {/* Patient Form */}
        <PatientForm />
      </div>
    </DashboardLayout>
  )
}
