import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

const activities = [
  {
    id: 1,
    patient: "Marie Dubois",
    action: "Consultation terminée",
    doctor: "Dr. Martin",
    time: "10:30",
    status: "completed",
  },
  {
    id: 2,
    patient: "Jean Dupont",
    action: "Admission en urgence",
    doctor: "Dr. Leroy",
    time: "09:45",
    status: "urgent",
  },
  {
    id: 3,
    patient: "Sophie Bernard",
    action: "Rendez-vous programmé",
    doctor: "Dr. Moreau",
    time: "09:15",
    status: "scheduled",
  },
  {
    id: 4,
    patient: "Pierre Rousseau",
    action: "Sortie d'hôpital",
    doctor: "Dr. Petit",
    time: "08:30",
    status: "discharged",
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800",
  urgent: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  discharged: "bg-gray-100 text-gray-800",
}

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-foreground">{activity.patient}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.doctor} • {activity.time}
                </p>
              </div>
              <Badge className={statusColors[activity.status]}>
                {activity.status === "completed" && "Terminé"}
                {activity.status === "urgent" && "Urgent"}
                {activity.status === "scheduled" && "Programmé"}
                {activity.status === "discharged" && "Sorti"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
