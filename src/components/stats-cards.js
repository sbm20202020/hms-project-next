import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, UserCheck, Calendar, Bed, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"
import { SkeletonChargementStats } from "./ui/skeleton-chargement"
import { useEffect } from "react"
import { DossierService, patientService } from "@/services/dossierService"
import { getPreviousMonth } from "@/utils/helpers"
import { Folder } from "lucide-react"

export default function StatsCards() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const moisPasse = getPreviousMonth(new Date())
        const moisCurrent = new Date().getMonth()

        const [patients, dossiersThisMonth, dossierPastMonth, dossiersCount] = await Promise.all([
          patientService.getAll(),
          DossierService.getByMonth(moisCurrent),
          DossierService.getByMonth(moisPasse),
          DossierService.count(),
        ])

        const patientsCount = patients.length

        const patientsMoisPasse = patients.filter(patient => {
          const moisPasse = new Date().getMonth() - 1
          const dateCreation = new Date(patient.dateCreation)
          const moisCreation = dateCreation.getMonth()
          return moisCreation === moisPasse
        })

        const patientsMoisCurrent = patients.filter(patient => {
          const moisCurrent = new Date().getMonth()
          const dateCreation = new Date(patient.dateCreation)
          const moisCreation = dateCreation.getMonth()
          return moisCreation === moisCurrent
        })

        const tauxDeVariationPatients = (patientsMoisCurrent.length - patientsMoisPasse.length) / patientsMoisPasse.length * 100
        const tauxDeVariationDossiers = (dossiersThisMonth.length - dossierPastMonth.length) / dossierPastMonth.length * 100
        
        const changeTypePatients = tauxDeVariationPatients > 0 ? "positive" : "negative"
        const changeTypeDossiers = tauxDeVariationDossiers > 0 ? "positive" : "negative"

        setStats([...stats,
          {
            title: "Total Patients",
            value: patientsCount,
            change: `${tauxDeVariationPatients.toFixed(2)}%`,
            changeType: changeTypePatients,
            icon: Users,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Total Dossiers",
            value: dossiersCount,
            change: `${tauxDeVariationDossiers.toFixed(2)}%`,
            changeType: changeTypeDossiers,
            icon: Folder,
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-emerald-50",
          }
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false) // ✅ Maintenant, c'est appelé après tous les fetch
      }
      // const totalPatients = await DossierService.patientService.getAll()
      // console.log("totalPatients",totalPatients)
      // // const totalMedecins = DossierService.medecinService.getAll()
      // // const totalRendezVous = DossierService.rendezVousService.getAll()
      // // const totalChambres = DossierService.chambreService.getAll()
      // setStats([

      // {
      //   title: "Médecins Actifs",
      //   value: "89",
      //   change: "+3%",
      //   changeType: "positive",
      //   icon: UserCheck,
      //   color: "from-emerald-500 to-green-600",
      //   bgColor: "bg-emerald-50",
      // },
      // {
      //   title: "Rendez-vous Aujourd'hui",
      //   value: "156",
      //   change: "+8%",
      //   changeType: "positive",
      //   icon: Calendar,
      //   color: "from-purple-500 to-violet-600",
      //   bgColor: "bg-purple-50",
      // },
      // {
      //   title: "Chambres Disponibles",
      //   value: "23",
      //   change: "-5%",
      //   changeType: "negative",
      //   icon: Bed,
      //   color: "from-orange-500 to-amber-600",
      //   bgColor: "bg-orange-50",
      // },
      // ])
      // setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return <SkeletonChargementStats />
  }


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
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stat.changeType === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
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
