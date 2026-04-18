"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react"

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    date: "2024-01-22",
    time: "09:00",
    patient: "Marie Dubois",
    doctor: "Dr. Martin",
    type: "Consultation",
    status: "Confirmé",
    duration: 30,
  },
  {
    id: 2,
    date: "2024-01-22",
    time: "10:30",
    patient: "Jean Dupont",
    doctor: "Dr. Leroy",
    type: "Suivi",
    status: "Confirmé",
    duration: 45,
  },
  {
    id: 3,
    date: "2024-01-23",
    time: "14:00",
    patient: "Sophie Bernard",
    doctor: "Dr. Moreau",
    type: "Consultation",
    status: "En attente",
    duration: 30,
  },
  {
    id: 4,
    date: "2024-01-24",
    time: "11:00",
    patient: "Pierre Rousseau",
    doctor: "Dr. Petit",
    type: "Urgence",
    status: "Urgent",
    duration: 60,
  },
]

const statusColors = {
  Confirmé: "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  Annulé: "bg-red-100 text-red-800",
  Urgent: "bg-red-100 text-red-800",
  Terminé: "bg-gray-100 text-gray-800",
}

export default function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Get appointments for selected date
  const selectedDateAppointments = mockAppointments.filter((apt) => apt.date === selectedDate)

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split("T")[0]
      const appointmentsCount = mockAppointments.filter((apt) => apt.date === dateStr).length
      const isCurrentMonth = current.getMonth() === month
      const isToday = dateStr === new Date().toISOString().split("T")[0]
      const isSelected = dateStr === selectedDate

      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        appointmentsCount,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const days = generateCalendarDays()
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`
                    p-2 text-sm rounded-lg transition-colors relative
                    ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                    ${day.isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                    ${day.isSelected && !day.isToday ? "bg-secondary" : ""}
                    ${day.isCurrentMonth ? "hover:bg-muted" : ""}
                  `}
                >
                  {day.day}
                  {day.appointmentsCount > 0 && (
                    <div className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Appointments */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>
                {new Date(selectedDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Aucun rendez-vous ce jour</p>
              ) : (
                selectedDateAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = `/appointments/${appointment.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{appointment.time}</span>
                        <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{appointment.patient}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {appointment.doctor} • {appointment.type} • {appointment.duration}min
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
