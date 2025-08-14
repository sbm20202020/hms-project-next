"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { TrendingUp, PieChart, BarChart3, Calendar, Filter, Download, Eye, Search } from "lucide-react"

export default function RevenusPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const revenueData = [
    {
      service: "Consultations Générales",
      monthlyRevenue: 18500,
      transactions: 247,
      avgPerTransaction: 75,
      growth: 12.5,
      details: [
        { date: "2024-01-15", patient: "Martin Dubois", amount: 75, type: "Consultation" },
        { date: "2024-01-15", patient: "Sophie Laurent", amount: 75, type: "Consultation" },
        { date: "2024-01-14", patient: "Pierre Moreau", amount: 75, type: "Consultation" },
      ],
    },
    {
      service: "Laboratoire",
      monthlyRevenue: 12300,
      transactions: 156,
      avgPerTransaction: 78.8,
      growth: 8.3,
      details: [
        { date: "2024-01-15", patient: "Marie Durand", amount: 120, type: "Analyse sanguine" },
        { date: "2024-01-15", patient: "Jean Petit", amount: 85, type: "Urine" },
        { date: "2024-01-14", patient: "Claire Rousseau", amount: 95, type: "Biochimie" },
      ],
    },
    {
      service: "Imagerie Médicale",
      monthlyRevenue: 8900,
      transactions: 89,
      avgPerTransaction: 100,
      growth: 15.2,
      details: [
        { date: "2024-01-15", patient: "Paul Girard", amount: 150, type: "Radiographie" },
        { date: "2024-01-15", patient: "Anne Moreau", amount: 200, type: "Échographie" },
        { date: "2024-01-14", patient: "Luc Bernard", amount: 120, type: "Scanner" },
      ],
    },
    {
      service: "Soins Infirmiers",
      monthlyRevenue: 4200,
      transactions: 168,
      avgPerTransaction: 25,
      growth: 5.7,
      details: [
        { date: "2024-01-15", patient: "Emma Leroy", amount: 25, type: "Pansement" },
        { date: "2024-01-15", patient: "Hugo Martin", amount: 30, type: "Injection" },
        { date: "2024-01-14", patient: "Léa Dubois", amount: 20, type: "Prise de tension" },
      ],
    },
  ]

  const handleViewDetails = (service) => {
    setSelectedService(service)
    setShowDetailModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyse des Revenus</h1>
            <p className="text-gray-600">Suivi détaillé des revenus par service</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Période et recherche */}
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
                  placeholder="Rechercher un service..."
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
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Revenus Totaux</p>
                  <p className="text-2xl font-bold text-green-600">43,900€</p>
                  <p className="text-xs text-green-500">+10.2% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">660</p>
                  <p className="text-xs text-blue-500">+8.5% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Ticket Moyen</p>
                  <p className="text-2xl font-bold text-purple-600">66.5€</p>
                  <p className="text-xs text-purple-500">+1.8% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Croissance</p>
                  <p className="text-2xl font-bold text-orange-600">+10.2%</p>
                  <p className="text-xs text-orange-500">vs mois dernier</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau détaillé des revenus */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Service</th>
                    <th className="text-right p-3">Revenus Mensuels</th>
                    <th className="text-right p-3">Transactions</th>
                    <th className="text-right p-3">Ticket Moyen</th>
                    <th className="text-right p-3">Croissance</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData
                    .filter((service) => service.service.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((service, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{service.service}</td>
                        <td className="p-3 text-right font-bold text-green-600">
                          {service.monthlyRevenue.toLocaleString()}€
                        </td>
                        <td className="p-3 text-right">{service.transactions}</td>
                        <td className="p-3 text-right">{service.avgPerTransaction.toFixed(1)}€</td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${service.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                            {service.growth > 0 ? "+" : ""}
                            {service.growth}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(service)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de détails */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Détails - ${selectedService?.service}`}
          size="lg"
        >
          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedService.monthlyRevenue.toLocaleString()}€
                  </div>
                  <div className="text-sm text-gray-600">Revenus Mensuels</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedService.transactions}</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedService.avgPerTransaction.toFixed(1)}€
                  </div>
                  <div className="text-sm text-gray-600">Ticket Moyen</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Transactions Récentes</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedService.details.map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.patient}</div>
                        <div className="text-sm text-gray-600">{transaction.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{transaction.amount}€</div>
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                  Fermer
                </Button>
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les Détails
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
