"use client"

import { useState } from "react"
import DashboardLayout from "../../../components/dashboard-layout"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import Modal from "../../../components/ui/modal"
import { Shield, Plus, Search, Edit, Trash2, Users, Settings, Unlock } from "lucide-react"

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  // Données simulées des rôles
  const [roles, setRoles] = useState([
    {
      id: 1,
      nom: "Médecin",
      description: "Médecin praticien avec accès complet aux dossiers médicaux",
      couleur: "#3B82F6",
      utilisateurs_count: 15,
      permissions: [
        "consultation",
        "prescription",
        "dossier_medical",
        "examens",
        "hospitalisation",
        "chirurgie",
        "urgences",
      ],
      statut: "Actif",
      date_creation: "2024-01-15",
    },
    {
      id: 2,
      nom: "Infirmière",
      description: "Personnel infirmier avec accès aux soins et suivi patients",
      couleur: "#8B5CF6",
      utilisateurs_count: 25,
      permissions: ["soins", "signes_vitaux", "dossier_patient", "medicaments", "planning", "urgences"],
      statut: "Actif",
      date_creation: "2024-01-15",
    },
    {
      id: 3,
      nom: "Réceptionniste",
      description: "Personnel d'accueil et gestion des rendez-vous",
      couleur: "#F59E0B",
      utilisateurs_count: 8,
      permissions: ["accueil", "rendez_vous", "facturation", "patients", "planning"],
      statut: "Actif",
      date_creation: "2024-01-15",
    },
    {
      id: 4,
      nom: "Administrateur",
      description: "Accès complet à toutes les fonctionnalités du système",
      couleur: "#EF4444",
      utilisateurs_count: 3,
      permissions: ["administration", "gestion_users", "parametres", "rapports", "finance", "sauvegarde", "audit"],
      statut: "Actif",
      date_creation: "2024-01-01",
    },
    {
      id: 5,
      nom: "Technicien Laboratoire",
      description: "Technicien spécialisé dans les analyses de laboratoire",
      couleur: "#10B981",
      utilisateurs_count: 6,
      permissions: ["laboratoire", "analyses", "resultats", "equipements", "qualite"],
      statut: "Actif",
      date_creation: "2024-02-01",
    },
  ])

  const filteredRoles = roles.filter(
    (role) =>
      role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateRole = (roleData) => {
    const newRole = {
      id: roles.length + 1,
      ...roleData,
      utilisateurs_count: 0,
      date_creation: new Date().toISOString().split("T")[0],
      statut: "Actif",
    }
    setRoles([...roles, newRole])
    setShowCreateModal(false)
  }

  const handleEditRole = (roleData) => {
    setRoles(roles.map((role) => (role.id === selectedRole.id ? { ...role, ...roleData } : role)))
    setShowEditModal(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = (roleId) => {
    const role = roles.find((r) => r.id === roleId)
    if (role.utilisateurs_count > 0) {
      alert(`Impossible de supprimer ce rôle car ${role.utilisateurs_count} utilisateur(s) l'utilisent encore.`)
      return
    }
    setRoles(roles.filter((role) => role.id !== roleId))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Gestion des Rôles</h1>
            <p className="text-gray-600 mt-1">Créez et gérez les rôles utilisateurs</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rôle
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Rôles</p>
                  <p className="text-2xl font-bold text-blue-900">{roles.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Rôles Actifs</p>
                  <p className="text-2xl font-bold text-green-900">
                    {roles.filter((r) => r.statut === "Actif").length}
                  </p>
                </div>
                <Unlock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Utilisateurs Assignés</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {roles.reduce((sum, role) => sum + role.utilisateurs_count, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Permissions Moyennes</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round(roles.reduce((sum, role) => sum + role.permissions.length, 0) / roles.length)}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <Card
              key={role.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4"
              style={{ borderLeftColor: role.couleur }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: role.couleur }}
                    >
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{role.nom}</CardTitle>
                      <Badge className="mt-1" style={{ backgroundColor: `${role.couleur}20`, color: role.couleur }}>
                        {role.utilisateurs_count} utilisateur{role.utilisateurs_count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role)
                        setShowEditModal(true)
                      }}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                      disabled={role.utilisateurs_count > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{role.description}</CardDescription>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions ({role.permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} autres
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Créé le {role.date_creation}</span>
                    <Badge
                      className={role.statut === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {role.statut}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal Création Rôle */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Créer un Nouveau Rôle"
          size="lg"
        >
          <RoleForm onSubmit={handleCreateRole} onCancel={() => setShowCreateModal(false)} />
        </Modal>

        {/* Modal Modification Rôle */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier le Rôle" size="lg">
          <RoleForm
            role={selectedRole}
            onSubmit={handleEditRole}
            onCancel={() => setShowEditModal(false)}
            isEdit={true}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

// Composant formulaire rôle
function RoleForm({ role, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    nom: role?.nom || "",
    description: role?.description || "",
    couleur: role?.couleur || "#3B82F6",
    permissions: role?.permissions || [],
  })

  const availablePermissions = [
    "consultation",
    "prescription",
    "dossier_medical",
    "examens",
    "hospitalisation",
    "chirurgie",
    "urgences",
    "soins",
    "signes_vitaux",
    "dossier_patient",
    "medicaments",
    "planning",
    "accueil",
    "rendez_vous",
    "facturation",
    "patients",
    "administration",
    "gestion_users",
    "parametres",
    "rapports",
    "finance",
    "sauvegarde",
    "audit",
    "laboratoire",
    "analyses",
    "resultats",
    "equipements",
    "qualite",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const togglePermission = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom du Rôle *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="couleur">Couleur</Label>
          <Input
            id="couleur"
            type="color"
            value={formData.couleur}
            onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Permissions ({formData.permissions.length} sélectionnées)</Label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
          {availablePermissions.map((permission) => (
            <label key={permission} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => togglePermission(permission)}
                className="rounded border-gray-300"
              />
              <span className="text-sm capitalize">{permission.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {isEdit ? "Modifier" : "Créer"} le Rôle
        </Button>
      </div>
    </form>
  )
}
