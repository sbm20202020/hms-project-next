"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import {
  FileText,
  Download,
  Eye,
  Filter,
  Plus,
  BarChart3,
  Users,
  Activity,
  DollarSign,
  Clock,
  Mail,
  Settings,
} from "lucide-react"

export default function RapportsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  const reportStats = [
    {
      title: "Rapports Générés",
      value: "156",
      change: "+12%",
      icon: FileText,
      color: "blue",
      period: "ce mois",
    },
    {
      title: "Téléchargements",
      value: "89",
      change: "+8%",
      icon: Download,
      color: "green",
      period: "cette semaine",
    },
    {
      title: "Rapports Automatisés",
      value: "24",
      change: "+3",
      icon: Clock,
      color: "purple",
      period: "actifs",
    },
    {
      title: "Modèles Disponibles",
      value: "12",
      change: "+2",
      icon: Settings,
      color: "orange",
      period: "nouveaux",
    },
  ]

  const reportTemplates = [
    {
      id: 1,
      name: "Rapport d'Activité Quotidien",
      description: "Synthèse complète de l'activité journalière",
      category: "Opérationnel",
      frequency: "Quotidien",
      lastGenerated: "Aujourd'hui 08:00",
      status: "Actif",
      icon: Activity,
      color: "blue",
      sections: ["Consultations", "Admissions", "Sorties", "Urgences", "Occupancy"],
    },
    {
      id: 2,
      name: "Analyse Financière Mensuelle",
      description: "Revenus, dépenses et indicateurs financiers",
      category: "Financier",
      frequency: "Mensuel",
      lastGenerated: "01/02/2024",
      status: "Actif",
      icon: DollarSign,
      color: "green",
      sections: ["Revenus", "Dépenses", "Bénéfices", "Ratios", "Prévisions"],
    },
    {
      id: 3,
      name: "Statistiques Patients",
      description: "Analyse démographique et médicale des patients",
      category: "Médical",
      frequency: "Hebdomadaire",
      lastGenerated: "28/01/2024",
      status: "Actif",
      icon: Users,
      color: "purple",
      sections: ["Démographie", "Pathologies", "Traitements", "Satisfaction"],
    },
    {
      id: 4,
      name: "Performance des Services",
      description: "Évaluation de l'efficacité par service",
      category: "Qualité",
      frequency: "Mensuel",
      lastGenerated: "30/01/2024",
      status: "Actif",
      icon: BarChart3,
      color: "orange",
      sections: ["Temps d'attente", "Satisfaction", "Productivité", "Qualité"],
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Activité Quotidienne - 01/02/2024",
      type: "Opérationnel",
      generatedDate: "01/02/2024 08:00",
      size: "2.1 MB",
      format: "PDF",
      status: "Prêt",
      downloads: 15,
    },
    {
      id: 2,
      name: "Analyse Financière - Janvier 2024",
      type: "Financier",
      generatedDate: "31/01/2024 23:59",
      size: "3.4 MB",
      format: "Excel",
      status: "Prêt",
      downloads: 8,
    },
    {
      id: 3,
      name: "Statistiques Patients - Semaine 4",
      type: "Médical",
      generatedDate: "28/01/2024 18:00",
      size: "1.8 MB",
      format: "PDF",
      status: "Prêt",
      downloads: 12,
    },
  ]

  const handleGenerateReport = (formData) => {
    console.log("Génération rapport:", formData)
    setShowGenerateModal(false)
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
    }
    return colors[color] || colors.blue
  }

  const getStatColorClasses = (color) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50",
      green: "text-green-600 bg-green-50",
      purple: "text-purple-600 bg-purple-50",
      orange: "text-orange-600 bg-orange-50",
    }
    return colors[color] || colors.blue
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Centre de Rapports
            </h1>
            <p className="text-gray-600 mt-1">Génération et gestion des rapports hospitaliers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover:shadow-md transition-all bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button
              onClick={() => setShowGenerateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Rapport
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${getStatColorClasses(stat.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "templates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Modèles de Rapports
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "recent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rapports Récents
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(template.color)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        {template.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Catégorie:</span>
                        <span className="ml-2 font-medium">{template.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Fréquence:</span>
                        <span className="ml-2 font-medium">{template.frequency}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Dernière génération: {template.lastGenerated}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:shadow-md transition-all bg-transparent"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Générer
                      </Button>
                      <Button variant="outline" size="sm" className="hover:shadow-md transition-all bg-transparent">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="hover:shadow-md transition-all bg-transparent">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="space-y-4">
            {recentReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Type: {report.type}</span>
                          <span>•</span>
                          <span>Généré: {report.generatedDate}</span>
                          <span>•</span>
                          <span>Taille: {report.size}</span>
                          <span>•</span>
                          <span>{report.downloads} téléchargements</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        {report.status}
                      </span>
                      <Button variant="outline" size="sm" className="hover:shadow-md transition-all bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        Aperçu
                      </Button>
                      <Button variant="outline" size="sm" className="hover:shadow-md transition-all bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm" className="hover:shadow-md transition-all bg-transparent">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Generate Report Modal */}
        <Modal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          title="Générer un Nouveau Rapport"
          size="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleGenerateReport(Object.fromEntries(formData))
            }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Type de rapport</label>
                <select
                  name="reportType"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="daily">Rapport d'Activité Quotidien</option>
                  <option value="financial">Analyse Financière</option>
                  <option value="patients">Statistiques Patients</option>
                  <option value="performance">Performance des Services</option>
                  <option value="custom">Rapport Personnalisé</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date de début</label>
                  <Input name="startDate" type="date" required className="focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de fin</label>
                  <Input name="endDate" type="date" required className="focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Format de sortie</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" defaultChecked className="mr-2 text-blue-600" />
                    <span className="text-sm">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="mr-2 text-blue-600" />
                    <span className="text-sm">Excel</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="mr-2 text-blue-600" />
                    <span className="text-sm">CSV</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowGenerateModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le Rapport
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
