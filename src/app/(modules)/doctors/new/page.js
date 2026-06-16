import DashboardLayout from "../../../../components/dashboard-layout"
import DoctorForm from "../../../../components/doctor-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function NewDoctorPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/doctors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouveau Médecin</h1>
            <p className="text-muted-foreground">Ajouter un nouveau médecin au personnel</p>
          </div>
        </div>

        {/* Doctor Form */}
        <DoctorForm />
      </div>
    </DashboardLayout>
  )
}
