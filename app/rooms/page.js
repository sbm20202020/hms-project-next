import DashboardLayout from "../../components/dashboard-layout"
import RoomsGrid from "../../components/rooms-grid"
import RoomsStats from "../../components/rooms-stats"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export default function RoomsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Chambres</h1>
            <p className="text-muted-foreground">Gérer les chambres et leur occupation</p>
          </div>
          <Button asChild>
            <a href="/rooms/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Chambre
            </a>
          </Button>
        </div>

        {/* Room Statistics */}
        <RoomsStats />

        {/* Rooms Grid */}
        <RoomsGrid />
      </div>
    </DashboardLayout>
  )
}
