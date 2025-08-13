"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import {
  TrendingUp,
  TrendingDown,
  Euro,
  FileText,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  Download,
} from "lucide-react"

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showReportModal, setShowReportModal] = useState(false)

  const financialStats = {
    totalRevenue: 45680.5,
    totalExpenses: 28340.75,
    netProfit: 17339.75,
    pendingPayments: 8950.25,
    cashFlow: 12450.0,
    monthlyGrowth: 8.5,
  }

  const revenueByService = [
    { service: "Consultations", amount: 18500.0, percentage: 40.5, color: "bg-blue-500" },
    { service: "Laboratoire", amount: 12300.0, percentage: 26.9, color: "bg-green-500" },
    { service: "Imagerie", amount: 8900.0, percentage: 19.5, color: "bg-purple-500" },
    { service: "Infirmerie", amount: 4200.0, percentage: 9.2, color: "bg-orange-500" },
    { service: "Autres", amount: 1780.5, percentage: 3.9, color: "bg-gray-500" },
  ]

  const monthlyData = [
    { month: "Jan", revenue: 42000, expenses: 25000 },
    { month: "Fév", revenue: 38000, expenses: 23000 },
    { month: "Mar", revenue: 45000, expenses: 28000 },
    { month: "Avr", revenue: 41000, expenses: 26000 },
    { month: "Mai", revenue: 48000, expenses: 29000 },
    { month: "Juin", revenue: 45680, expenses: 28340 },
  ]

  const expenseCategories = [
    { category: "Salaires", amount: 15200.0, percentage: 53.6 },
    { category: "Équipements", amount: 4800.0, percentage: 16.9 },
    { category: "Médicaments", amount: 3200.0, percentage: 11.3 },
    { category: "Maintenance", amount: 2100.0, percentage: 7.4 },
    { category: "Autres", amount: 3040.75, percentage: 10.8 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance & Comptabilité</h1>
            <p className="text-gray-600">Suivi financier et analyse comptable</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReportModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Générer Rapport
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Période de sélection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Période :</span>
              <div className="flex gap-2">
                {[
                  { key: "week", label: "Cette semaine" },
                  { key: "month", label: "Ce mois" },
                  { key: "quarter", label: "Ce trimestre" },
                  { key: "year", label: "Cette année" },
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

        {/* Indicateurs financiers principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-xl font-bold text-green-600">{financialStats.totalRevenue.toLocaleString()}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Dépenses</p>
                  <p className="text-xl font-bold text-red-600">{financialStats.totalExpenses.toLocaleString()}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Bénéfice Net</p>
                  <p className="text-xl font-bold text-blue-600">{financialStats.netProfit.toLocaleString()}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-xl font-bold text-orange-600">
                    {financialStats.pendingPayments.toLocaleString()}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Trésorerie</p>
                  <p className="text-xl font-bold text-purple-600">{financialStats.cashFlow.toLocaleString()}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-600">Croissance</p>
                  <p className="text-xl font-bold text-cyan-600">+{financialStats.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenus par service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Revenus par Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByService.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.service}</span>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                      <div className="text-lg font-bold">{item.amount.toLocaleString()}€</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Évolution Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{month.month}</span>
                      <div className="text-right">
                        <div className="text-sm text-green-600">+{month.revenue.toLocaleString()}€</div>
                        <div className="text-sm text-red-600">-{month.expenses.toLocaleString()}€</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(month.revenue / 50000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Catégories de dépenses */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {expenseCategories.map((expense, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{expense.amount.toLocaleString()}€</div>
                  <div className="text-sm text-gray-600">{expense.category}</div>
                  <div className="text-xs text-gray-500">{expense.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de génération de rapport */}
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Générer un Rapport Financier"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de rapport</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Rapport mensuel</option>
                <option>Rapport trimestriel</option>
                <option>Rapport annuel</option>
                <option>Rapport personnalisé</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de fin</label>
                <Input type="date" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sections à inclure</label>
              <div className="space-y-2">
                {[
                  "Revenus par service",
                  "Analyse des dépenses",
                  "Évolution mensuelle",
                  "Indicateurs de performance",
                  "Prévisions",
                ].map((section, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowReportModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={() => setShowReportModal(false)} className="flex-1">
                Générer le Rapport
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
