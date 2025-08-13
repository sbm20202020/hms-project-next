"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/modal"

export default function InfirmeriePage() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [showVitalSigns, setShowVitalSigns] = useState(false)
  const [showCareModal, setShowCareModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const patientsEnAttente = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Marie",
      numero: "P001",
      service: "Consultation",
      heure: "09:30",
      priorite: "Normal",
      convention: "CNSS",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Jean",
      numero: "P002",
      service: "Urgence",
      heure: "10:15",
      priorite: "Urgent",
      convention: "Privé",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Sophie",
      numero: "P003",
      service: "Consultation",
      heure: "11:00",
      priorite: "Normal",
      convention: "CNSS",
    },
  ]

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
    { id: 1, nom: "Pansement simple", prix: 50, code: "PAN001" },
    { id: 2, nom: "Injection intramusculaire", prix: 30, code: "INJ001" },
    { id: 3, nom: "Prélèvement sanguin", prix: 40, code: "PRE001" },
    { id: 4, nom: "Perfusion", prix: 80, code: "PER001" },
    { id: 5, nom: "Pansement complexe", prix: 100, code: "PAN002" },
  ]

  const [selectedCares, setSelectedCares] = useState([])

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setShowPatientSearch(false)
  }

  const handleVitalSignsSubmit = (e) => {
    e.preventDefault()
    console.log("Signes vitaux enregistrés:", vitalSigns)
    setShowVitalSigns(false)
    // Reset form
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

  const handleBillingSubmit = (paymentMethod) => {
    console.log("Facturation:", {
      patient: selectedPatient,
      soins: selectedCares,
      total: calculateTotal(),
      paymentMethod,
    })
    setShowBillingModal(false)
    setSelectedCares([])
    setSelectedPatient(null)
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
            Sélectionner Patient
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Patients en Attente</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Convention</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patientsEnAttente.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {patient.prenom} {patient.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.heure}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.priorite === "Urgent" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {patient.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.convention === "CNSS" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {patient.convention}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        onClick={() => handlePatientSelect(patient)}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        Sélectionner
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={showPatientSearch}
          onClose={() => setShowPatientSearch(false)}
          title="Rechercher un Patient"
          size="lg"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div className="max-h-60 overflow-y-auto">
              {patientsEnAttente.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {patient.prenom} {patient.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        N° {patient.numero} • {patient.convention}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        patient.priorite === "Urgent" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.priorite}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiration (/min)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={vitalSigns.respiration}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, respiration: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={vitalSigns.poids}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, poids: e.target.value })}
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

        <Modal isOpen={showCareModal} onClose={() => setShowCareModal(false)} title="Sélectionner les Soins" size="lg">
          <div className="space-y-4">
            <div className="grid gap-3">
              {soinsTypes.map((soin) => (
                <div
                  key={soin.id}
                  onClick={() => handleCareToggle(soin)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCares.find((c) => c.id === soin.id)
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{soin.nom}</div>
                      <div className="text-sm text-gray-500">Code: {soin.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{soin.prix} DH</div>
                      {selectedCares.find((c) => c.id === soin.id) && (
                        <div className="text-xs text-cyan-600">✓ Sélectionné</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedCares.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total: {calculateTotal()} DH</span>
                  <Button onClick={() => setShowBillingModal(true)} className="bg-purple-600 hover:bg-purple-700">
                    Valider & Facturer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          title="Validation et Facturation"
          size="lg"
        >
          <div className="space-y-6">
            {selectedPatient && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Patient: {selectedPatient.prenom} {selectedPatient.nom}
                </h4>
                <p className="text-sm text-gray-600">
                  Convention:{" "}
                  <span
                    className={`font-medium ${
                      selectedPatient.convention === "CNSS" ? "text-blue-600" : "text-orange-600"
                    }`}
                  >
                    {selectedPatient.convention}
                  </span>
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Soins effectués:</h4>
              <div className="space-y-2">
                {selectedCares.map((soin) => (
                  <div key={soin.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-medium">{soin.nom}</div>
                      <div className="text-sm text-gray-500">Code: {soin.code}</div>
                    </div>
                    <div className="font-semibold">{soin.prix} DH</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
                <span>Total à payer:</span>
                <span>{calculateTotal()} DH</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Mode de paiement:</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleBillingSubmit("Espèces")} className="h-16 bg-green-600 hover:bg-green-700">
                  <div className="text-center">
                    <div className="font-semibold">Espèces</div>
                    <div className="text-sm opacity-90">Paiement cash</div>
                  </div>
                </Button>
                <Button onClick={() => handleBillingSubmit("Carte")} className="h-16 bg-blue-600 hover:bg-blue-700">
                  <div className="text-center">
                    <div className="font-semibold">Carte</div>
                    <div className="text-sm opacity-90">Paiement CB</div>
                  </div>
                </Button>
                {selectedPatient?.convention === "CNSS" && (
                  <Button
                    onClick={() => handleBillingSubmit("Convention")}
                    className="h-16 bg-purple-600 hover:bg-purple-700 col-span-2"
                  >
                    <div className="text-center">
                      <div className="font-semibold">Prise en charge CNSS</div>
                      <div className="text-sm opacity-90">Facturation conventionnée</div>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
