import DashboardLayout from "../../../components/dashboard-layout"
import PatientDetails from "../../../components/patient-details"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function PatientDetailsPage({ params }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/patients">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails du Patient</h1>
              <p className="text-muted-foreground">Informations complètes du patient</p>
            </div>
          </div>
          <Button asChild>
            <a href={`/patients/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </a>
          </Button>
        </div>

        {/* Patient Details */}
        <PatientDetails patientId={params.id} />
      </div>
    </DashboardLayout>
  )
}
