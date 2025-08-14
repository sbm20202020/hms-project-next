"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdvancedTable from "@/components/ui/advanced-table"
import Modal from "@/components/ui/modal"
import { Plus, Eye, Edit, Activity, Heart, Thermometer } from "lucide-react"

export default function InfirmeriePage() {
  const [soins, setSoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [showVitalSigns, setShowVitalSigns] = useState(false)
  const [showCareModal, setShowCareModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)

  useEffect(() => {
    fetchSoins()
  }, [])

  const fetchSoins = async () => {
    try {
      const response = await fetch("/api/soins")
      const data = await response.json()
      setSoins(data)
    } catch (error) {
      console.error("Erreur lors du chargement des soins:", error)
    } finally {
      setLoading(false)
    }
  }

  const [vitalSigns, setVitalSigns] = useState({
    tension: "",
    temperature: "",
    pouls: "",
    respiration: "",
    saturation: "",
    poids: "",
    taille: "",
  })

  const soinsTypes = [
    { id: 1, nom: "Pansement simple", prix: 5000, code: "PAN001" },
    { id: 2, nom: "Injection intramusculaire", prix: 3000, code: "INJ001" },
    { id: 3, nom: "Prélèvement sanguin", prix: 4000, code: "PRE001" },
    { id: 4, nom: "Perfusion", prix: 8000, code: "PER001" },
    { id: 5, nom: "Pansement complexe", prix: 10000, code: "PAN002" },
  ]

  const [selectedCares, setSelectedCares] = useState([])

  const columns = [
    {
      key: "patientNom",
      header: "Patient",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Nom du patient",
    },
    {
      key: "dateHeure",
      header: "Date & Heure",
      sortable: true,
      render: (value) => new Date(value).toLocaleString("fr-FR"),
    },
    {
      key: "infirmier",
      header: "Infirmier",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Infirmier responsable",
    },
    {
      key: "signesVitaux",
      header: "Signes Vitaux",
      render: (value) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Heart className="h-3 w-3 text-red-500" />
            <span className="text-sm">{value.tension}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-3 w-3 text-blue-500" />
            <span className="text-sm">{value.temperature}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-3 w-3 text-green-500" />
            <span className="text-sm">{value.saturation}%</span>
          </div>
        </div>
      ),
    },
    {
      key: "soinsEffectues",
      header: "Soins Effectués",
      render: (value) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((soin, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {soin}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2} autres
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      sortable: true,
      filterable: true,
      groupable: true,
      filterLabel: "Statut du soin",
      render: (value) => {
        const colors = {
          Terminé: "bg-green-100 text-green-800",
          "En cours": "bg-blue-100 text-blue-800",
          "En attente": "bg-orange-100 text-orange-800",
        }
        return <Badge className={colors[value]}>{value}</Badge>
      },
    },
    {
      key: "observations",
      header: "Observations",
      render: (value) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground" title={value}>
          {value}
        </div>
      ),
    },
  ]

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        console.log("Voir détails:", row)
      },
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        console.log("Modifier soin:", row)
      },
    },
  ]

  const handleVitalSignsSubmit = (e) => {
    e.preventDefault()
    console.log("Signes vitaux enregistrés:", vitalSigns)
    setShowVitalSigns(false)
    setVitalSigns({
      tension: "",
      temperature: "",
      pouls: "",
      respiration: "",
      saturation: "",
      poids: "",
      taille: "",
    })
  }

  const handleCareToggle = (care) => {
    setSelectedCares((prev) => {
      const exists = prev.find((c) => c.id === care.id)
      if (exists) {
        return prev.filter((c) => c.id !== care.id)
      } else {
        return [...prev, care]
      }
    })
  }

  const calculateTotal = () => {
    return selectedCares.reduce((total, care) => total + care.prix, 0)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des soins...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Infirmerie</h1>
            <p className="text-gray-600">Prise des signes vitaux et soins infirmiers</p>
          </div>
          <Button onClick={() => setShowPatientSearch(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Soin
          </Button>
        </div>

        {selectedPatient && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Patient sélectionné: {selectedPatient.prenom} {selectedPatient.nom}
                </h3>
                <p className="text-blue-700">
                  N° {selectedPatient.numero} • {selectedPatient.convention} • Service: {selectedPatient.service}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedPatient(null)}
                className="text-blue-600 border-blue-300"
              >
                Changer
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowVitalSigns(true)}
            disabled={!selectedPatient}
            className="h-20 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
          >
            <div className="text-center">
              <div className="text-lg font-semibold">Signes Vitaux</div>
              <div className="text-sm opacity-90">Enregistrer les constantes</div>
            </div>
          </Button>

          <Button
            onClick={() => setShowCareModal(true)}
            disabled={!selectedPatient}
            className="h-20 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
          >
            <div className="text-center">
              <div className="text-lg font-semibold">Soins Infirmiers</div>
              <div className="text-sm opacity-90">Effectuer les soins</div>
            </div>
          </Button>

          <Button
            onClick={() => setShowBillingModal(true)}
            disabled={!selectedPatient || selectedCares.length === 0}
            className="h-20 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300"
          >
            <div className="text-center">
              <div className="text-lg font-semibold">Valider & Facturer</div>
              <div className="text-sm opacity-90">Finaliser les actes</div>
            </div>
          </Button>
        </div>

        <AdvancedTable
          title="Historique des Soins"
          data={soins}
          columns={columns}
          actions={actions}
          searchable={true}
          filterable={true}
          sortable={true}
          groupable={true}
          exportable={true}
          pageSize={10}
        />

        {/* ... existing modals ... */}
        <Modal
          isOpen={showVitalSigns}
          onClose={() => setShowVitalSigns(false)}
          title="Enregistrer les Signes Vitaux"
          size="lg"
        >
          <form onSubmit={handleVitalSignsSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tension Artérielle (mmHg)</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={vitalSigns.tension}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, tension: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="37.0"
                  value={vitalSigns.temperature}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pouls (bpm)</label>
                <input
                  type="number"
                  placeholder="72"
                  value={vitalSigns.pouls}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, pouls: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saturation O2 (%)</label>
                <input
                  type="number"
                  placeholder="98"
                  value={vitalSigns.saturation}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, saturation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowVitalSigns(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Enregistrer
              </Button>
            </div>
          </form>
        </Modal>

        {/* ... other existing modals ... */}
      </div>
    </DashboardLayout>
  )
}
