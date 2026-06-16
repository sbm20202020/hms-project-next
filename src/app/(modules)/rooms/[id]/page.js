import DashboardLayout from "../../../../components/dashboard-layout"
import RoomDetails from "../../../../components/room-details"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function RoomDetailsPage({ params }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/rooms">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails de la Chambre</h1>
              <p className="text-muted-foreground">Informations complètes de la chambre</p>
            </div>
          </div>
          <Button asChild>
            <a href={`/rooms/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </a>
          </Button>
        </div>

        {/* Room Details */}
        <RoomDetails roomId={params.id} />
      </div>
    </DashboardLayout>
  )
}
