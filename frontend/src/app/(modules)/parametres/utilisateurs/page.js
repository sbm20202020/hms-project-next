"use client"

import { useState } from "react"
import DashboardLayout from "../../../../components/dashboard-layout"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import Modal from "../../../../components/ui/modal"
import { Users, UserPlus, Search, Edit, Trash2, Shield, UserCheck, UserX, Mail, Phone, Calendar } from "lucide-react"

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Données simulées des utilisateurs
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: "Dr. Martin Dubois",
      email: "martin.dubois@hopital.com",
      telephone: "+33 1 23 45 67 89",
      role: "Médecin",
      statut: "Actif",
      derniere_connexion: "2025-01-13 14:30",
      date_creation: "2024-01-15",
      permissions: ["consultation", "prescription", "dossier_medical"],
    },
    {
      id: 2,
      nom: "Sophie Laurent",
      email: "sophie.laurent@hopital.com",
      telephone: "+33 1 23 45 67 90",
      role: "Infirmière",
      statut: "Actif",
      derniere_connexion: "2025-01-13 16:15",
      date_creation: "2024-02-20",
      permissions: ["soins", "signes_vitaux", "dossier_patient"],
    },
    {
      id: 3,
      nom: "Jean Moreau",
      email: "jean.moreau@hopital.com",
      telephone: "+33 1 23 45 67 91",
      role: "Réceptionniste",
      statut: "Inactif",
      derniere_connexion: "2025-01-10 09:45",
      date_creation: "2024-03-10",
      permissions: ["accueil", "rendez_vous", "facturation"],
    },
    {
      id: 4,
      nom: "Marie Petit",
      email: "marie.petit@hopital.com",
      telephone: "+33 1 23 45 67 92",
      role: "Administrateur",
      statut: "Actif",
      derniere_connexion: "2025-01-13 17:00",
      date_creation: "2024-01-01",
      permissions: ["administration", "gestion_users", "parametres", "rapports"],
    },
  ])

  const roles = ["Médecin", "Infirmière", "Réceptionniste", "Administrateur", "Technicien", "Pharmacien"]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.statut === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      date_creation: new Date().toISOString().split("T")[0],
      derniere_connexion: "Jamais connecté",
      permissions: [],
    }
    setUsers([...users, newUser])
    setShowCreateModal(false)
  }

  const handleEditUser = (userData) => {
    setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...userData } : user)))
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const getStatusBadge = (statut) => {
    return statut === "Actif" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <UserCheck className="w-3 h-3 mr-1" />
        Actif
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <UserX className="w-3 h-3 mr-1" />
        Inactif
      </Badge>
    )
  }

  const getRoleBadge = (role) => {
    const colors = {
      Médecin: "bg-blue-100 text-blue-800",
      Infirmière: "bg-purple-100 text-purple-800",
      Réceptionniste: "bg-orange-100 text-orange-800",
      Administrateur: "bg-red-100 text-red-800",
      Technicien: "bg-green-100 text-green-800",
      Pharmacien: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={colors[role] || "bg-gray-100 text-gray-800"}>{role}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs et leurs accès</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-green-900">
                    {users.filter((u) => u.statut === "Actif").length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Rôles Différents</p>
                  <p className="text-2xl font-bold text-orange-900">{new Set(users.map((u) => u.role)).size}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Connexions Aujourd'hui</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {users.filter((u) => u.derniere_connexion.includes("2025-01-13")).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Utilisateur</th>
                    <th className="text-left p-4 font-semibold">Contact</th>
                    <th className="text-left p-4 font-semibold">Rôle</th>
                    <th className="text-left p-4 font-semibold">Statut</th>
                    <th className="text-left p-4 font-semibold">Dernière Connexion</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                            {user.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.nom}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {user.telephone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4">{getStatusBadge(user.statut)}</td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{user.derniere_connexion}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowEditModal(true)
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal Création Utilisateur */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Créer un Nouvel Utilisateur"
          size="lg"
        >
          <UserForm onSubmit={handleCreateUser} onCancel={() => setShowCreateModal(false)} roles={roles} />
        </Modal>

        {/* Modal Modification Utilisateur */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier l'Utilisateur" size="lg">
          <UserForm
            user={selectedUser}
            onSubmit={handleEditUser}
            onCancel={() => setShowEditModal(false)}
            roles={roles}
            isEdit={true}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

// Composant formulaire utilisateur
function UserForm({ user, onSubmit, onCancel, roles, isEdit = false }) {
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    role: user?.role || "",
    statut: user?.statut || "Actif",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom Complet *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle *</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mot_de_passe">Mot de Passe *</Label>
            <Input
              id="mot_de_passe"
              type="password"
              value={formData.mot_de_passe}
              onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
              required={!isEdit}
            />
          </div>
          <div>
            <Label htmlFor="confirmer_mot_de_passe">Confirmer le Mot de Passe *</Label>
            <Input
              id="confirmer_mot_de_passe"
              type="password"
              value={formData.confirmer_mot_de_passe}
              onChange={(e) => setFormData({ ...formData, confirmer_mot_de_passe: e.target.value })}
              required={!isEdit}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {isEdit ? "Modifier" : "Créer"} l'Utilisateur
        </Button>
      </div>
    </form>
  )
}
