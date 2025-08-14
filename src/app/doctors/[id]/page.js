import DashboardLayout from "../../../components/dashboard-layout"
import DoctorDetails from "../../../components/doctor-details"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function DoctorDetailsPage({ params }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/doctors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails du Médecin</h1>
              <p className="text-muted-foreground">Informations complètes du médecin</p>
            </div>
          </div>
          <Button asChild>
            <a href={`/doctors/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </a>
          </Button>
        </div>

        {/* Doctor Details */}
        <DoctorDetails doctorId={params.id} />
      </div>
    </DashboardLayout>
  )
}
