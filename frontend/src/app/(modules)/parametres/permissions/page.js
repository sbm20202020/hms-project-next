"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Switch } from "../../../../components/ui/switch"
import { Shield, Search, Settings, Users, Unlock, Save } from "lucide-react"

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")

  // Données simulées des permissions
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      nom: "consultation",
      libelle: "Consultation Médicale",
      description: "Accès aux consultations et examens médicaux",
      module: "Medical",
      niveau: "Écriture",
      roles_count: 2,
      actif: true,
    },
    {
      id: 2,
      nom: "prescription",
      libelle: "Prescription Médicaments",
      description: "Prescrire et modifier les ordonnances",
      module: "Medical",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 3,
      nom: "dossier_medical",
      libelle: "Dossier Médical",
      description: "Accès complet aux dossiers médicaux patients",
      module: "Medical",
      niveau: "Lecture/Écriture",
      roles_count: 2,
      actif: true,
    },
    {
      id: 4,
      nom: "soins",
      libelle: "Soins Infirmiers",
      description: "Administrer et enregistrer les soins",
      module: "Nursing",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 5,
      nom: "signes_vitaux",
      libelle: "Signes Vitaux",
      description: "Enregistrer les constantes vitales",
      module: "Nursing",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 6,
      nom: "accueil",
      libelle: "Accueil Patients",
      description: "Gérer l'accueil et l'orientation des patients",
      module: "Reception",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 7,
      nom: "rendez_vous",
      libelle: "Rendez-vous",
      description: "Créer et gérer les rendez-vous",
      module: "Reception",
      niveau: "Écriture",
      roles_count: 2,
      actif: true,
    },
    {
      id: 8,
      nom: "facturation",
      libelle: "Facturation",
      description: "Gérer la facturation et les paiements",
      module: "Finance",
      niveau: "Écriture",
      roles_count: 2,
      actif: true,
    },
    {
      id: 9,
      nom: "administration",
      libelle: "Administration",
      description: "Accès aux fonctions d'administration",
      module: "Admin",
      niveau: "Lecture/Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 10,
      nom: "gestion_users",
      libelle: "Gestion Utilisateurs",
      description: "Créer et gérer les comptes utilisateurs",
      module: "Admin",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 11,
      nom: "laboratoire",
      libelle: "Laboratoire",
      description: "Gérer les analyses de laboratoire",
      module: "Laboratory",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
    {
      id: 12,
      nom: "imagerie",
      libelle: "Imagerie Médicale",
      description: "Gérer les examens d'imagerie",
      module: "Imaging",
      niveau: "Écriture",
      roles_count: 1,
      actif: true,
    },
  ])

  const modules = ["Medical", "Nursing", "Reception", "Finance", "Admin", "Laboratory", "Imaging"]

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = selectedModule === "all" || permission.module === selectedModule
    return matchesSearch && matchesModule
  })

  const togglePermission = (permissionId) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === permissionId ? { ...permission, actif: !permission.actif } : permission,
      ),
    )
  }

  const getModuleColor = (module) => {
    const colors = {
      Medical: "bg-blue-100 text-blue-800",
      Nursing: "bg-purple-100 text-purple-800",
      Reception: "bg-orange-100 text-orange-800",
      Finance: "bg-green-100 text-green-800",
      Admin: "bg-red-100 text-red-800",
      Laboratory: "bg-yellow-100 text-yellow-800",
      Imaging: "bg-pink-100 text-pink-800",
    }
    return colors[module] || "bg-gray-100 text-gray-800"
  }

  const getNiveauColor = (niveau) => {
    const colors = {
      Lecture: "bg-gray-100 text-gray-800",
      Écriture: "bg-blue-100 text-blue-800",
      "Lecture/Écriture": "bg-green-100 text-green-800",
    }
    return colors[niveau] || "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Gestion des Permissions</h1>
            <p className="text-gray-600 mt-1">Configurez les permissions système par module</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder les Modifications
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Permissions</p>
                  <p className="text-2xl font-bold text-blue-900">{permissions.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Permissions Actives</p>
                  <p className="text-2xl font-bold text-green-900">{permissions.filter((p) => p.actif).length}</p>
                </div>
                <Unlock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Modules</p>
                  <p className="text-2xl font-bold text-purple-900">{modules.length}</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Rôles Assignés</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {permissions.reduce((sum, p) => sum + p.roles_count, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une permission..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedModule === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModule("all")}
                >
                  Tous les modules
                </Button>
                {modules.map((module) => (
                  <Button
                    key={module}
                    variant={selectedModule === module ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedModule(module)}
                  >
                    {module}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matrice des permissions par module */}
        <div className="space-y-6">
          {modules.map((module) => {
            const modulePermissions = filteredPermissions.filter((p) => p.module === module)
            if (modulePermissions.length === 0) return null

            return (
              <Card key={module} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getModuleColor(module)}`}
                      >
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Module {module}</CardTitle>
                        <CardDescription>
                          {modulePermissions.length} permission{modulePermissions.length !== 1 ? "s" : ""} disponible
                          {modulePermissions.length !== 1 ? "s" : ""}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getModuleColor(module)}>
                      {modulePermissions.filter((p) => p.actif).length} / {modulePermissions.length} actives
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modulePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{permission.libelle}</h4>
                            <Badge className={getNiveauColor(permission.niveau)}>{permission.niveau}</Badge>
                            <Badge variant="outline">
                              {permission.roles_count} rôle{permission.roles_count !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Code: {permission.nom}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{permission.actif ? "Activée" : "Désactivée"}</span>
                            <Switch
                              checked={permission.actif}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
