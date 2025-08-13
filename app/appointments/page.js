import DashboardLayout from "../../components/dashboard-layout"
import AppointmentsCalendar from "../../components/appointments-calendar"
import AppointmentsList from "../../components/appointments-list"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Plus } from "lucide-react"

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Rendez-vous</h1>
            <p className="text-muted-foreground">Planifier et gérer les consultations</p>
          </div>
          <Button asChild>
            <a href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau RDV
            </a>
          </Button>
        </div>

        {/* Appointments Views */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <AppointmentsCalendar />
          </TabsContent>

          <TabsContent value="list">
            <AppointmentsList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
