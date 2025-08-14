import DashboardLayout from "../../../components/dashboard-layout"
import AppointmentDetails from "../../../components/appointment-details"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function AppointmentDetailsPage({ params }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/appointments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails du Rendez-vous</h1>
              <p className="text-muted-foreground">Informations de la consultation</p>
            </div>
          </div>
          <Button asChild>
            <a href={`/appointments/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </a>
          </Button>
        </div>

        {/* Appointment Details */}
        <AppointmentDetails appointmentId={params.id} />
      </div>
    </DashboardLayout>
  )
}
