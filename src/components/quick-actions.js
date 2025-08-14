"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { FileText, Users, UserPlus, Stethoscope, Receipt, Clock, TestTube, Scan } from "lucide-react"
import FormModal from "./ui/form-modal"
import PatientForm from "./patient-form"
import Link from "next/link"
import Tooltip from "./ui/tooltip"

export default function QuickActions() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false)
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false)

  const quickActions = [
    {
      title: "Patient Rapide",
      description: "Enregistrement rapide (nom, sexe, motif)",
      icon: UserPlus,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      onClick: () => setIsNewPatientModalOpen(true),
    },
    {
      title: "RDV Express",
      description: "Planifier rapidement un rendez-vous",
      icon: Clock,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600",
      onClick: () => setIsNewAppointmentModalOpen(true),
    },
    {
      title: "Admission Urgente",
      description: "Enregistrer un patient en urgence",
      icon: Stethoscope,
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      iconColor: "text-red-600",
      href: "/reception/urgent",
    },
    {
      title: "Paiement Rapide",
      description: "Encaisser un paiement",
      icon: Receipt,
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600",
      onClick: () => {
        /* Modal paiement */
      },
    },
  ]

  const completeActions = [
    {
      title: "Patient Complet",
      description: "Dossier patient avec tous les détails",
      icon: Users,
      href: "/patients/new",
    },
    {
      title: "Médecin Complet",
      description: "Profil médecin avec spécialités et horaires",
      icon: Stethoscope,
      href: "/doctors/new",
    },
    {
      title: "Consultation Complète",
      description: "Nouvelle consultation avec examens",
      icon: FileText,
      href: "/consultations/new",
    },
    {
      title: "Examen Laboratoire",
      description: "Prescrire des analyses complètes",
      icon: TestTube,
      href: "/laboratory/new",
    },
    {
      title: "Imagerie Médicale",
      description: "Programmer examens radiologiques",
      icon: Scan,
      href: "/imaging/new",
    },
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Actions Rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Actions Rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-4 justify-items-center">
              {quickActions.map((action) => {
                const Icon = action.icon
                const tip = `${action.title} — ${action.description}`
                const Btn = (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-12 w-12 p-0 rounded-full ${action.color} transition-all duration-200 hover:shadow-md flex items-center justify-center`}
                    onClick={action.onClick}
                    asChild={!action.onClick}
                    aria-label={action.title}
                  >
                    {action.onClick ? (
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    ) : (
                      <Link href={action.href} className="flex items-center justify-center h-full w-full">
                        <Icon className={`h-5 w-5 ${action.iconColor}`} />
                      </Link>
                    )}
                  </Button>
                )
                return <Tooltip key={action.title} text={tip}>{Btn}</Tooltip>
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions Complètes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Création Complète</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-4 justify-items-center">
              {completeActions.map((action) => {
                const Icon = action.icon
                const tip = `${action.title} — ${action.description}`
                const Btn = (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-12 w-12 p-2 rounded-full ${action.color} transition-all duration-200 hover:shadow-md flex items-center justify-center`}
                    onClick={action.onClick}
                    asChild={!action.onClick}
                    aria-label={action.title}
                  >
                    {action.onClick ? (
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    ) : (
                      <Link href={action.href} className="flex items-center justify-center h-full w-full">
                        <Icon className={`h-5 w-5 ${action.iconColor}`} />
                      </Link>
                    )}
                  </Button>
                )
                return <Tooltip key={action.title} text={tip}>{Btn}</Tooltip>
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modales pour actions rapides */}
      <FormModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        title="Patient Rapide"
        description="Enregistrement rapide avec informations essentielles"
      >
        <PatientForm quickMode={true} onSuccess={() => setIsNewPatientModalOpen(false)} />
      </FormModal>

      {/* TODO: Ajouter les modales pour RDV Express et autres actions rapides */}
    </>
  )
}
