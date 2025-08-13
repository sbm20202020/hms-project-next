"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { FileText, Download, Calendar, TrendingUp, Eye, Filter, Plus } from "lucide-react"

export default function RapportsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const reportTemplates = [
    {
      id: 1,
      name: "Rapport Mensuel Complet",
      description: "Analyse complète des revenus, dépenses et indicateurs",
      frequency: "Mensuel",
      lastGenerated: "2024-01-31",
      status: "Disponible",
      sections: ["Revenus", "Dépenses", "Bénéfices", "Indicateurs", "Prévisions"],
    },
    {
      id: 2,
      name: "Analyse des Revenus par Service",
      description: "Détail des revenus générés par chaque service médical",
      frequency: "Hebdomadaire",
      lastGenerated: "2024-01-28",
      status: "Disponible",
      sections: ["Consultations", "Laboratoire", "Imagerie", "Infirmerie"],
    },
    {
      id: 3,
      name: "Suivi des Dépenses",
      description: "Contrôle budgétaire et analyse des dépenses",
      frequency: "Mensuel",
      lastGenerated: "2024-01-30",
      status: "Disponible",
      sections: ["Salaires", "Équipements", "Fournitures", "Maintenance"],
    },
    {
      id: 4,
      name: "Tableau de Bord Financier",
      description: "Indicateurs clés de performance financière",
      frequency: "Quotidien",
      lastGenerated: "2024-02-01",
      status: "Disponible",
      sections: ["KPI", "Trésorerie", "Créances", "Ratios"],
    },
  ]

  const generatedReports = [
    {
      id: 1,
      name: "Rapport Mensuel - Janvier 2024",
      type: "Mensuel Complet",
      generatedDate: "2024-01-31",
      period: "Janvier 2024",
      size: "2.4 MB",
      format: "PDF",
      status: "Prêt",
    },
    {
      id: 2,
      name: "Analyse Revenus - Semaine 4",
      type: "Revenus par Service",
      generatedDate: "2024-01-28",
      period: "22-28 Jan 2024",
      size: "1.8 MB",
      format: "PDF",
      status: "Prêt",
    },
    {
      id: 3,
      name: "Suivi Dépenses - Janvier 2024",
      type: "Suivi des Dépenses",
      generatedDate: "2024-01-30",
      period: "Janvier 2024",
      size: "1.2 MB",
      format: "Excel",
      status: "Prêt",
    },
  ]

  const handleGenerateReport = (formData) => {
    console.log("Génération rapport:", formData)
    setShowGenerateModal(false)
  }

  const handlePreviewReport = (report) => {
    setSelectedReport(report)
    setShowPreviewModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rapports Financiers</h1>
            <p className="text-gray-600">Génération et consultation des rapports comptables</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button onClick={() => setShowGenerateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Rapport
            </Button>
          </div>
        </div>

        {/* Statistiques des rapports */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Rapports Générés</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-xs text-blue-500">ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Modèles Actifs</p>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-xs text-green-500">disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Automatisés</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-xs text-purple-500">rapports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Téléchargements</p>
                  <p className="text-2xl font-bold text-orange-600">156</p>
                  <p className="text-xs text-orange-500">ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modèles de rapports */}
          <Card>
            <CardHeader>
              <CardTitle>Modèles de Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{template.status}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>Fréquence: {template.frequency}</span>
                      <span>Dernière génération: {template.lastGenerated}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.sections.map((section, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {section}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <FileText className="w-4 h-4 mr-1" />
                        Générer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rapports générés */}
          <Card>
            <CardHeader>
              <CardTitle>Rapports Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-gray-600">{report.type}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{report.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                      <div>
                        <span className="block">Période: {report.period}</span>
                        <span className="block">Généré: {report.generatedDate}</span>
                      </div>
                      <div>
                        <span className="block">Format: {report.format}</span>
                        <span className="block">Taille: {report.size}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handlePreviewReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Aperçu
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de génération de rapport */}
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type de rapport</label>
                <select name="reportType" className="w-full p-2 border border-gray-300 rounded-lg" required>
                  <option value="">Sélectionner un type</option>
                  <option value="monthly">Rapport Mensuel Complet</option>
                  <option value="revenue">Analyse des Revenus</option>
                  <option value="expenses">Suivi des Dépenses</option>
                  <option value="dashboard">Tableau de Bord</option>
                  <option value="custom">Rapport Personnalisé</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <Input name="startDate" type="date" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <Input name="endDate" type="date" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Format de sortie</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" defaultChecked className="mr-2" />
                    PDF
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="mr-2" />
                    Excel
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="mr-2" />
                    CSV
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sections à inclure</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Revenus par service",
                    "Analyse des dépenses",
                    "Évolution mensuelle",
                    "Indicateurs KPI",
                    "Prévisions",
                    "Comparaisons",
                    "Graphiques",
                    "Recommandations",
                  ].map((section, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" name="sections" value={section} defaultChecked className="mr-2" />
                      <span className="text-sm">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Notes ou instructions spéciales..."
                ></textarea>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowGenerateModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le Rapport
                </Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal d'aperçu */}
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={`Aperçu - ${selectedReport?.name}`}
          size="xl"
        >
          {selectedReport && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Informations du Rapport</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span> {selectedReport.type}
                  </div>
                  <div>
                    <span className="text-gray-600">Période:</span> {selectedReport.period}
                  </div>
                  <div>
                    <span className="text-gray-600">Généré le:</span> {selectedReport.generatedDate}
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span> {selectedReport.format}
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aperçu du rapport disponible</p>
                <p className="text-sm text-gray-500">Le contenu complet sera visible après téléchargement</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPreviewModal(false)} className="flex-1">
                  Fermer
                </Button>
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
