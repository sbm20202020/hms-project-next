"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FormModal from "@/components/ui/form-modal"
import { TrendingDown, Plus, Edit, Calendar, Filter, Search, AlertTriangle } from "lucide-react"

export default function DepensesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const expenseCategories = [
    {
      id: 1,
      category: "Salaires et Charges",
      monthlyBudget: 16000,
      actualSpent: 15200,
      percentage: 95,
      status: "normal",
      transactions: [
        { date: "2024-01-31", description: "Salaires médecins", amount: 8500, type: "Récurrent" },
        { date: "2024-01-31", description: "Salaires infirmiers", amount: 4200, type: "Récurrent" },
        { date: "2024-01-31", description: "Charges sociales", amount: 2500, type: "Récurrent" },
      ],
    },
    {
      id: 2,
      category: "Équipements Médicaux",
      monthlyBudget: 5000,
      actualSpent: 4800,
      percentage: 96,
      status: "normal",
      transactions: [
        { date: "2024-01-15", description: "Maintenance scanner", amount: 1200, type: "Maintenance" },
        { date: "2024-01-10", description: "Équipement laboratoire", amount: 2800, type: "Achat" },
        { date: "2024-01-05", description: "Consommables", amount: 800, type: "Consommables" },
      ],
    },
    {
      id: 3,
      category: "Médicaments et Fournitures",
      monthlyBudget: 3000,
      actualSpent: 3200,
      percentage: 107,
      status: "warning",
      transactions: [
        { date: "2024-01-20", description: "Médicaments urgence", amount: 1500, type: "Achat" },
        { date: "2024-01-15", description: "Fournitures médicales", amount: 900, type: "Achat" },
        { date: "2024-01-10", description: "Produits d'hygiène", amount: 800, type: "Achat" },
      ],
    },
    {
      id: 4,
      category: "Maintenance et Réparations",
      monthlyBudget: 2500,
      actualSpent: 2100,
      percentage: 84,
      status: "normal",
      transactions: [
        { date: "2024-01-25", description: "Réparation climatisation", amount: 800, type: "Réparation" },
        { date: "2024-01-20", description: "Maintenance préventive", amount: 600, type: "Maintenance" },
        { date: "2024-01-15", description: "Nettoyage spécialisé", amount: 700, type: "Service" },
      ],
    },
  ]

  const handleAddExpense = (formData) => {
    console.log("Nouvelle dépense:", formData)
    setShowAddModal(false)
  }

  const handleEditExpense = (formData) => {
    console.log("Modification dépense:", formData)
    setShowEditModal(false)
    setSelectedExpense(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "warning":
        return "text-orange-600 bg-orange-50"
      case "danger":
        return "text-red-600 bg-red-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Dépenses</h1>
            <p className="text-gray-600">Suivi et contrôle des dépenses par catégorie</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Dépense
            </Button>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Période :</span>
                <div className="flex gap-2">
                  {[
                    { key: "week", label: "Semaine" },
                    { key: "month", label: "Mois" },
                    { key: "quarter", label: "Trimestre" },
                    { key: "year", label: "Année" },
                  ].map((period) => (
                    <Button
                      key={period.key}
                      variant={selectedPeriod === period.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.key)}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Dépenses Totales</p>
                  <p className="text-2xl font-bold text-red-600">25,300€</p>
                  <p className="text-xs text-red-500">+3.2% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Budget Dépassé</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                  <p className="text-xs text-orange-500">catégorie</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Budget Restant</p>
                  <p className="text-2xl font-bold text-blue-600">1,200€</p>
                  <p className="text-xs text-blue-500">ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Utilisation Budget</p>
                  <p className="text-2xl font-bold text-purple-600">95.5%</p>
                  <p className="text-xs text-purple-500">moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des dépenses par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Dépenses par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories
                .filter((category) => category.category.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{category.category}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            Budget: {category.monthlyBudget.toLocaleString()}€
                          </span>
                          <span className="text-sm text-gray-600">
                            Dépensé: {category.actualSpent.toLocaleString()}€
                          </span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(category.status)}`}>
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedExpense(category)
                            setShowEditModal(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full ${
                          category.percentage > 100
                            ? "bg-red-500"
                            : category.percentage > 90
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      ></div>
                    </div>

                    {/* Transactions récentes */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Transactions récentes:</h4>
                      {category.transactions.slice(0, 3).map((transaction, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-medium">{transaction.description}</span>
                            <span className="text-gray-500 ml-2">({transaction.type})</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">{transaction.amount.toLocaleString()}€</div>
                            <div className="text-gray-500">{transaction.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal d'ajout de dépense */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvelle Dépense"
          onSubmit={handleAddExpense}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select name="category" className="w-full p-2 border border-gray-300 rounded-lg" required>
                <option value="">Sélectionner une catégorie</option>
                <option value="salaires">Salaires et Charges</option>
                <option value="equipements">Équipements Médicaux</option>
                <option value="medicaments">Médicaments et Fournitures</option>
                <option value="maintenance">Maintenance et Réparations</option>
                <option value="autres">Autres</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input name="description" placeholder="Description de la dépense" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Montant (€)</label>
                <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input name="date" type="date" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select name="type" className="w-full p-2 border border-gray-300 rounded-lg" required>
                <option value="">Sélectionner un type</option>
                <option value="recurrent">Récurrent</option>
                <option value="achat">Achat</option>
                <option value="maintenance">Maintenance</option>
                <option value="reparation">Réparation</option>
                <option value="service">Service</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fournisseur</label>
              <Input name="supplier" placeholder="Nom du fournisseur" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Notes additionnelles..."
              ></textarea>
            </div>
          </div>
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
