import DashboardLayout from "../../../../components/dashboard-layout"
import RoomForm from "../../../../components/room-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function NewRoomPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouvelle Chambre</h1>
            <p className="text-muted-foreground">Ajouter une nouvelle chambre à l'hôpital</p>
          </div>
        </div>

        {/* Room Form */}
        <RoomForm />
      </div>
    </DashboardLayout>
  )
}
