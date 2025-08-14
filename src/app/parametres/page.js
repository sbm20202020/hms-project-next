"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import {
  Building2,
  Users,
  Shield,
  Database,
  Bell,
  CreditCard,
  Clock,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react"

export default function ParametresPage() {
  const [activeSection, setActiveSection] = useState("general")
  const [activeSubSection, setActiveSubSection] = useState("info") // Added sub-section state
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // Added selected user state

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Marie Dubois",
      email: "marie.dubois@hms.fr",
      role: "Médecin",
      service: "Cardiologie",
      status: "Actif",
      lastLogin: "2025-01-13 14:30",
      permissions: ["consultation", "prescription", "dossier_medical"],
    },
    {
      id: 2,
      name: "Infirmière Sophie Martin",
      email: "sophie.martin@hms.fr",
      role: "Infirmière",
      service: "Urgences",
      status: "Actif",
      lastLogin: "2025-01-13 13:45",
      permissions: ["soins", "dossier_medical", "signes_vitaux"],
    },
    {
      id: 3,
      name: "Admin Jean Dupont",
      email: "admin@hms.fr",
      role: "Administrateur",
      service: "Administration",
      status: "Actif",
      lastLogin: "2025-01-13 15:20",
      permissions: ["all"],
    },
    {
      id: 4,
      name: "Réceptionniste Claire Moreau",
      email: "claire.moreau@hms.fr",
      role: "Réceptionniste",
      service: "Accueil",
      status: "Inactif",
      lastLogin: "2025-01-12 17:00",
      permissions: ["reception", "rendez_vous"],
    },
  ])

  const settingSections = [
    {
      id: "general",
      name: "Informations Générales",
      icon: Building2,
      color: "blue",
      description: "Configuration de base de l'établissement",
      subSections: [
        { id: "info", name: "Informations", icon: Building2 },
        { id: "horaires", name: "Horaires", icon: Clock },
        { id: "contact", name: "Contact", icon: Phone },
      ],
    },
    {
      id: "users",
      name: "Gestion Utilisateurs",
      icon: Users,
      color: "green",
      description: "Comptes utilisateurs et permissions",
      subSections: [
        { id: "liste", name: "Liste Utilisateurs", icon: Users },
        { id: "roles", name: "Rôles", icon: Shield },
        { id: "permissions", name: "Permissions", icon: Eye },
        { id: "sessions", name: "Sessions", icon: Clock },
      ],
    },
    {
      id: "security",
      name: "Sécurité",
      icon: Shield,
      color: "red",
      description: "Paramètres de sécurité et authentification",
      subSections: [
        { id: "auth", name: "Authentification", icon: Shield },
        { id: "logs", name: "Journaux", icon: Database },
        { id: "backup", name: "Sauvegardes", icon: Download },
      ],
    },
    {
      id: "system",
      name: "Système",
      icon: Database,
      color: "purple",
      description: "Configuration système et maintenance",
      subSections: [
        { id: "database", name: "Base de données", icon: Database },
        { id: "maintenance", name: "Maintenance", icon: RefreshCw },
        { id: "monitoring", name: "Monitoring", icon: Eye },
      ],
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      color: "orange",
      description: "Alertes et notifications automatiques",
      subSections: [
        { id: "email", name: "Email", icon: Mail },
        { id: "sms", name: "SMS", icon: Phone },
        { id: "alerts", name: "Alertes", icon: Bell },
      ],
    },
    {
      id: "billing",
      name: "Facturation",
      icon: CreditCard,
      color: "cyan",
      description: "Tarifs et paramètres de facturation",
      subSections: [
        { id: "tarifs", name: "Tarifs", icon: CreditCard },
        { id: "taxes", name: "Taxes", icon: CreditCard },
        { id: "modes", name: "Modes de paiement", icon: CreditCard },
      ],
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      red: "bg-red-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      cyan: "bg-cyan-500 text-white",
    }
    return colors[color] || colors.blue
  }

  const handleSaveSettings = (formData) => {
    console.log("Sauvegarde paramètres:", formData)
    setShowModal(false)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Informations de l'Établissement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l'hôpital</label>
              <Input defaultValue="Centre Médical HMS" className="focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Code établissement</label>
              <Input defaultValue="HMS-001" className="focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input defaultValue="+33 1 23 45 67 89" className="pl-10 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input defaultValue="contact@hms-medical.fr" className="pl-10 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                defaultValue="123 Avenue de la Santé, 75001 Paris"
                className="pl-10 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de lits</label>
              <Input type="number" defaultValue="150" className="focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Services</label>
              <Input type="number" defaultValue="12" className="focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Personnel médical</label>
              <Input type="number" defaultValue="85" className="focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Horaires d'Ouverture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { day: "Lundi - Vendredi", hours: "08:00 - 18:00" },
              { day: "Samedi", hours: "09:00 - 17:00" },
              { day: "Dimanche", hours: "10:00 - 16:00" },
              { day: "Urgences", hours: "24h/24 - 7j/7" },
            ].map((schedule, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{schedule.day}</span>
                <span className="text-blue-600">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUserSettings = () => {
    const currentSection = settingSections.find((s) => s.id === "users")
    const subSections = currentSection?.subSections || []

    return (
      <div className="space-y-6">
        {/* Sub-navigation */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {subSections.map((subSection) => {
                const Icon = subSection.icon
                return (
                  <button
                    key={subSection.id}
                    onClick={() => setActiveSubSection(subSection.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSubSection === subSection.id
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {subSection.name}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content based on sub-section */}
        {activeSubSection === "liste" && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Liste des Utilisateurs
                </CardTitle>
                <Button
                  className="bg-gradient-to-r from-green-600 to-green-700"
                  onClick={() => {
                    setModalType("add-user")
                    setShowModal(true)
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter((u) => u.status === "Actif").length}
                  </div>
                  <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                  <div className="text-sm text-gray-600">Total utilisateurs</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter((u) => u.lastLogin.includes("2025-01-13")).length}
                  </div>
                  <div className="text-sm text-gray-600">Connexions aujourd'hui</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {users.filter((u) => u.status === "Inactif").length}
                  </div>
                  <div className="text-sm text-gray-600">Comptes inactifs</div>
                </div>
              </div>

              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 ${
                          user.status === "Actif" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{user.role}</div>
                        <div className="text-xs text-gray-500">{user.service}</div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Actif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setModalType("edit-user")
                            setShowModal(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setModalType("permissions")
                            setShowModal(true)
                          }}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSubSection === "roles" && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Gestion des Rôles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Administrateur", users: 1, color: "red", permissions: "Accès complet" },
                  { name: "Médecin", users: 8, color: "blue", permissions: "Consultation, Prescription" },
                  { name: "Infirmière", users: 12, color: "green", permissions: "Soins, Signes vitaux" },
                  { name: "Réceptionniste", users: 3, color: "orange", permissions: "Accueil, RDV" },
                  { name: "Laborantin", users: 2, color: "purple", permissions: "Examens, Résultats" },
                  { name: "Caissier", users: 2, color: "cyan", permissions: "Facturation, Paiements" },
                ].map((role, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 border-${role.color}-500 bg-${role.color}-50`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{role.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${role.color}-100 text-${role.color}-700`}>
                        {role.users} utilisateur{role.users > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.permissions}</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Configurer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSubSection === "permissions" && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Matrice des Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Module</th>
                      <th className="text-center p-3">Admin</th>
                      <th className="text-center p-3">Médecin</th>
                      <th className="text-center p-3">Infirmière</th>
                      <th className="text-center p-3">Réceptionniste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { module: "Patients", admin: true, medecin: true, infirmiere: true, receptionniste: true },
                      { module: "Consultations", admin: true, medecin: true, infirmiere: false, receptionniste: false },
                      { module: "Prescriptions", admin: true, medecin: true, infirmiere: false, receptionniste: false },
                      { module: "Facturation", admin: true, medecin: false, infirmiere: false, receptionniste: true },
                      { module: "Rapports", admin: true, medecin: true, infirmiere: false, receptionniste: false },
                      { module: "Paramètres", admin: true, medecin: false, infirmiere: false, receptionniste: false },
                    ].map((perm, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{perm.module}</td>
                        <td className="p-3 text-center">
                          <div
                            className={`w-4 h-4 rounded-full mx-auto ${perm.admin ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                        </td>
                        <td className="p-3 text-center">
                          <div
                            className={`w-4 h-4 rounded-full mx-auto ${perm.medecin ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                        </td>
                        <td className="p-3 text-center">
                          <div
                            className={`w-4 h-4 rounded-full mx-auto ${perm.infirmiere ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                        </td>
                        <td className="p-3 text-center">
                          <div
                            className={`w-4 h-4 rounded-full mx-auto ${perm.receptionniste ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSubSection === "sessions" && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Sessions Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users
                  .filter((u) => u.status === "Actif")
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">Dernière activité: {user.lastLogin}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{user.service}</span>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
                          Déconnecter
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Paramètres de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Durée de session (minutes)</label>
              <Input type="number" defaultValue="60" className="focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tentatives de connexion max</label>
              <Input type="number" defaultValue="3" className="focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe administrateur</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                defaultValue="admin123"
                className="pr-10 focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Authentification à deux facteurs</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Journalisation des connexions</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Configuration Système
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Base de données</span>
                <span className="text-green-600 text-sm">Connectée</span>
              </div>
              <div className="text-sm text-gray-600">PostgreSQL 14.2</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Serveur</span>
                <span className="text-green-600 text-sm">En ligne</span>
              </div>
              <div className="text-sm text-gray-600">Ubuntu 22.04 LTS</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start hover:shadow-md transition-all bg-transparent">
              <Download className="mr-2 w-4 h-4" />
              Sauvegarder la Base de Données
            </Button>
            <Button variant="outline" className="w-full justify-start hover:shadow-md transition-all bg-transparent">
              <Upload className="mr-2 w-4 h-4" />
              Restaurer une Sauvegarde
            </Button>
            <Button variant="outline" className="w-full justify-start hover:shadow-md transition-all bg-transparent">
              <RefreshCw className="mr-2 w-4 h-4" />
              Maintenance Système
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Configuration des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input defaultValue="contact@hms-medical.fr" className="focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMS</label>
              <Input defaultValue="+33 1 23 45 67 89" className="focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Alertes</label>
              <Input defaultValue="urgence@hms.fr" className="focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fréquence des alertes</label>
              <Input type="number" defaultValue="15" className="focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-600" />
            Configuration de Facturation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tarifs</label>
              <Input type="number" defaultValue="100" className="focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taxes</label>
              <Input type="number" defaultValue="20" className="focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modes de paiement</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings()
      case "users":
        return renderUserSettings()
      case "security":
        return renderSecuritySettings()
      case "system":
        return renderSystemSettings()
      case "notifications":
        return renderNotificationsSettings()
      case "billing":
        return renderBillingSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Paramètres Système
            </h1>
            <p className="text-gray-600 mt-1">Configuration et administration du système HMS</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {settingSections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id)
                          if (section.subSections && section.subSections.length > 0) {
                            setActiveSubSection(section.subSections[0].id)
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            activeSection === section.id ? getColorClasses(section.color) : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.name}</div>
                          <div className="text-xs text-gray-500">{section.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>

        {/* Enhanced Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            modalType === "add-user"
              ? "Nouvel Utilisateur"
              : modalType === "edit-user"
                ? `Modifier ${selectedUser?.name}`
                : modalType === "permissions"
                  ? `Permissions - ${selectedUser?.name}`
                  : "Configuration"
          }
          size="lg"
        >
          <div className="space-y-4">
            {modalType === "add-user" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <Input placeholder="Dr. Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="jean.dupont@hms.fr" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rôle</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Médecin</option>
                      <option>Infirmière</option>
                      <option>Réceptionniste</option>
                      <option>Administrateur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Cardiologie</option>
                      <option>Urgences</option>
                      <option>Pédiatrie</option>
                      <option>Administration</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {modalType === "edit-user" && selectedUser && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{selectedUser.role}</div>
                    <div className="text-sm text-gray-600">Rôle</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{selectedUser.service}</div>
                    <div className="text-sm text-gray-600">Service</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{selectedUser.lastLogin}</div>
                  <div className="text-sm text-gray-600">Dernière connexion</div>
                </div>
              </div>
            )}

            {modalType === "permissions" && selectedUser && (
              <div className="space-y-4">
                <p className="text-gray-600">Permissions pour {selectedUser.name}</p>
                <div className="space-y-2">
                  {selectedUser.permissions.map((perm, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="capitalize">{perm.replace("_", " ")}</span>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Fermer
              </Button>
              <Button className="flex-1">{modalType === "add-user" ? "Créer" : "Sauvegarder"}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
