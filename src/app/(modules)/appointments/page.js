"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../../components/dashboard-layout"
import AdvancedTable from "../../../components/ui/advanced-table"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Plus, Eye, Edit, Calendar, Clock, User, UserCheck } from "lucide-react"
// import { db } from "../../lib/database"

const statusColors = {
  Confirmé: "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  Annulé: "bg-red-100 text-red-800",
  Urgent: "bg-red-100 text-red-800",
  Terminé: "bg-gray-100 text-gray-800",
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      // await db.initializeData()
      // const appointmentsData = db.getTable("appointments")
      const appointmentsData = []
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "date",
      header: "Date & Heure",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {new Date(value).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {row.heure}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "patientNom",
      header: "Patient",
      sortable: true,
      filterable: true,
      filterLabel: "Nom du patient",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">ID: {row.patientId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "doctorNom",
      header: "Médecin",
      sortable: true,
      filterable: true,
      filterLabel: "Médecin traitant",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.specialite}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      filterable: true,
      filterLabel: "Type de rendez-vous",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.duree} minutes</p>
        </div>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Statut du rendez-vous",
      render: (value) => <Badge className={statusColors[value]}>{value}</Badge>,
    },
    {
      key: "notes",
      header: "Notes",
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground truncate">{value || "Aucune note"}</p>
        </div>
      ),
    },
  ]

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        window.location.href = `/appointments/${row.id}`
      },
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        window.location.href = `/appointments/${row.id}/edit`
      },
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des rendez-vous...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <AdvancedTable
              title="Liste des Rendez-vous"
              data={appointments}
              columns={columns}
              actions={actions}
              searchable={true}
              filterable={true}
              sortable={true}
              groupable={true}
              exportable={true}
              pageSize={10}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vue Calendrier</h3>
              <p className="text-muted-foreground">La vue calendrier sera bientôt disponible</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
