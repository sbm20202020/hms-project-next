import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Bed, CheckCircle, AlertCircle, Wrench } from "lucide-react"

const stats = [
  {
    title: "Total Chambres",
    value: "120",
    icon: Bed,
    color: "text-blue-600",
  },
  {
    title: "Chambres Libres",
    value: "23",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Chambres Occupées",
    value: "89",
    icon: AlertCircle,
    color: "text-orange-600",
  },
  {
    title: "En Maintenance",
    value: "8",
    icon: Wrench,
    color: "text-red-600",
  },
]

export default function RoomsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
