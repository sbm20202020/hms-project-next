"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { FileText, Users, UserPlus, Stethoscope, Receipt, Clock, TestTube, Scan } from "lucide-react"
import FormModal from "./ui/form-modal"
import PatientForm from "./patient-form"
import Link from "next/link"

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-auto p-4 justify-start ${action.color} transition-all duration-200 hover:shadow-md`}
                    onClick={action.onClick}
                    asChild={!action.onClick}
                  >
                    {action.onClick ? (
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                          <Icon className={`h-5 w-5 ${action.iconColor}`} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    ) : (
                      <Link href={action.href} className="flex items-center space-x-3 w-full">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                          <Icon className={`h-5 w-5 ${action.iconColor}`} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </Link>
                    )}
                  </Button>
                )
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
            <div className="space-y-2">
              {completeActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-muted/50 transition-all duration-200"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                )
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
