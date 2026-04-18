"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { financeService, depenseService } from "@/services/dossierService"
import { Plus, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react"

export default function FinancePage() {
  const [dashboard, setDashboard] = useState(null)
  const [depenses, setDepenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showRapportModal, setShowRapportModal] = useState(false)
  const [form, setForm] = useState({ categorie: "Autres", montant: "", description: "", date: new Date().toISOString().split("T")[0] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [dash, deps] = await Promise.all([financeService.getDashboard(), depenseService.getAll()])
      setDashboard(dash && typeof dash === "object" ? dash : null)
      setDepenses(Array.isArray(deps) ? deps : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await depenseService.create(form)
      setShowModal(false)
      setForm({ categorie: "Autres", montant: "", description: "", date: new Date().toISOString().split("T")[0] })
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const kpis = [
    { label: "Chiffre d'Affaires", value: dashboard?.totalRevenus || 0, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Dépenses", value: dashboard?.totalDepenses || 0, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
    { label: "Bénéfice Net", value: dashboard?.beneficeNet || 0, icon: DollarSign, color: (dashboard?.beneficeNet || 0) >= 0 ? "text-green-700" : "text-red-700", bg: "bg-blue-50" },
    { label: "En Attente", value: dashboard?.enAttente || 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  const columns = [
    { key: "categorie", header: "Catégorie" },
    { key: "description", header: "Description", render: (r) => r.description ? r.description.substring(0, 50) : "—" },
    { key: "montant", header: "Montant", render: (r) => `${parseFloat(r.montant || 0).toLocaleString("fr-FR")} FCFA` },
    { key: "date", header: "Date", render: (r) => r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Finance & Comptabilité</h1><p className="text-gray-500">Tableau de bord financier du mois en cours</p></div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRapportModal(true)}>Rapport</Button>
            <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Ajouter Dépense</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className={bg}>
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <CardTitle className="text-sm text-gray-600">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-xl font-bold ${color}`}>{parseFloat(value).toLocaleString("fr-FR")} FCFA</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Dépenses récentes</h2>
          <AdvancedTable columns={columns} data={depenses} loading={loading} emptyMessage="Aucune dépense enregistrée" />
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter une Dépense">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Catégorie</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                {["Salaires","Équipements","Médicaments","Maintenance","Fournitures","Énergie","Autres"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium">Montant (FCFA)</label><Input type="number" step="0.01" value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Date</label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required /></div>
          </div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Enregistrer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showRapportModal} onClose={() => setShowRapportModal(false)} title="Rapport Financier">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 p-3 rounded"><p className="text-gray-500">Revenus du mois</p><p className="text-lg font-bold text-green-700">{parseFloat(dashboard?.totalRevenus || 0).toLocaleString("fr-FR")} FCFA</p></div>
            <div className="bg-red-50 p-3 rounded"><p className="text-gray-500">Dépenses du mois</p><p className="text-lg font-bold text-red-700">{parseFloat(dashboard?.totalDepenses || 0).toLocaleString("fr-FR")} FCFA</p></div>
            <div className="bg-blue-50 p-3 rounded col-span-2"><p className="text-gray-500">Bénéfice net</p><p className="text-xl font-bold text-blue-700">{parseFloat(dashboard?.beneficeNet || 0).toLocaleString("fr-FR")} FCFA</p></div>
          </div>
          <p className="text-xs text-gray-400">Données du mois en cours uniquement</p>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
