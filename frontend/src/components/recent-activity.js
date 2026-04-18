import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { CheckCircle, AlertTriangle, CalendarClock, LogOut } from "lucide-react"

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

const statusMeta = {
  completed: {
    label: "Terminé",
    badge: "bg-green-100 text-green-800",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    Icon: CheckCircle,
  },
  urgent: {
    label: "Urgent",
    badge: "bg-red-100 text-red-800",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    Icon: AlertTriangle,
  },
  scheduled: {
    label: "Programmé",
    badge: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    Icon: CalendarClock,
  },
  discharged: {
    label: "Sorti",
    badge: "bg-gray-100 text-gray-800",
    iconBg: "bg-gray-50",
    iconColor: "text-gray-600",
    Icon: LogOut,
  },
}

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const meta = statusMeta[activity.status] || statusMeta.completed
            const { Icon } = meta
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${meta.iconBg} ring-1 ring-border flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${meta.iconColor}`} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-medium text-foreground">{activity.patient}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.doctor} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge className={meta.badge}>{meta.label}</Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
