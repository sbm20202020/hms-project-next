"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Mock data for dropdowns
const mockPatients = [
  { id: 1, name: "Marie Dubois", phone: "01 23 45 67 89" },
  { id: 2, name: "Jean Dupont", phone: "01 98 76 54 32" },
  { id: 3, name: "Sophie Bernard", phone: "01 11 22 33 44" },
  { id: 4, name: "Pierre Rousseau", phone: "01 55 66 77 88" },
]

const mockDoctors = [
  { id: 1, name: "Dr. Martin", specialite: "Cardiologie" },
  { id: 2, name: "Dr. Leroy", specialite: "Pédiatrie" },
  { id: 3, name: "Dr. Moreau", specialite: "Orthopédie" },
  { id: 4, name: "Dr. Petit", specialite: "Neurologie" },
]

const appointmentTypes = ["Consultation", "Suivi", "Urgence", "Contrôle", "Première visite"]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export default function AppointmentForm({ appointment = null, isEdit = false }) {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || "",
    doctorId: appointment?.doctorId || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    type: appointment?.type || "",
    duration: appointment?.duration || "30",
    status: appointment?.status || "En attente",
    notes: appointment?.notes || "",
    motif: appointment?.motif || "",
    urgence: appointment?.urgence || false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // In a real app, this would make an API call
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get available time slots (in a real app, this would check doctor availability)
  const getAvailableTimeSlots = () => {
    return timeSlots // Simplified - would filter based on doctor and date
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations principales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Médecin *</Label>
            <Select value={formData.doctorId} onValueChange={(value) => handleChange("doctorId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name} - {doctor.specialite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Heure *</Label>
            <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une heure" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTimeSlots().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de consultation *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes) *</Label>
            <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="90">1h30</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Confirmé">Confirmé</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Détails supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Détails Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motif">Motif de consultation</Label>
            <Input
              id="motif"
              value={formData.motif}
              onChange={(e) => handleChange("motif", e.target.value)}
              placeholder="Raison de la visite..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="urgence"
              checked={formData.urgence}
              onChange={(e) => handleChange("urgence", e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="urgence">Marquer comme urgent</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <a href="/appointments">Annuler</a>
        </Button>
        <Button type="submit">{isEdit ? "Mettre à jour" : "Créer le rendez-vous"}</Button>
      </div>
    </form>
  )
}
