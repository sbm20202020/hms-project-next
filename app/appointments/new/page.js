import DashboardLayout from "../../../components/dashboard-layout"
import AppointmentForm from "../../../components/appointment-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function NewAppointmentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/appointments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouveau Rendez-vous</h1>
            <p className="text-muted-foreground">Planifier une nouvelle consultation</p>
          </div>
        </div>

        {/* Appointment Form */}
        <AppointmentForm />
      </div>
    </DashboardLayout>
  )
}
