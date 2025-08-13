import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Euro, TrendingUp, Clock, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Revenus du Mois",
    value: "45 280€",
    change: "+12%",
    changeType: "positive",
    icon: Euro,
  },
  {
    title: "Factures Payées",
    value: "156",
    change: "+8%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "En Attente",
    value: "23",
    change: "-5%",
    changeType: "negative",
    icon: Clock,
  },
  {
    title: "En Retard",
    value: "7",
    change: "+2",
    changeType: "negative",
    icon: AlertTriangle,
  },
]

export default function BillingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
