import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, UserCheck, Calendar, Bed, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Médecins Actifs",
    value: "89",
    change: "+3%",
    changeType: "positive",
    icon: UserCheck,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Rendez-vous Aujourd'hui",
    value: "156",
    change: "+8%",
    changeType: "positive",
    icon: Calendar,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Chambres Disponibles",
    value: "23",
    change: "-5%",
    changeType: "negative",
    icon: Bed,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown

        return (
          <Card
            key={stat.title}
            className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground font-display">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold font-display text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{stat.change}</span>
                </div>
                <span className="text-xs text-muted-foreground">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
