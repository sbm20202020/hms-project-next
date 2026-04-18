"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { pharmacieService } from "@/services/dossierService"
import { Plus, Eye, Package, AlertTriangle } from "lucide-react"

export default function PharmaciePage() {
  const [tab, setTab] = useState("stock")
  const [medicaments, setMedicaments] = useState([])
  const [ordonnances, setOrdonnances] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMedModal, setShowMedModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [showOrdoModal, setShowOrdoModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState(null)
  const [selectedOrdo, setSelectedOrdo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const emptyMed = { nom: "", dci: "", forme: "Comprimé", stock: 0, seuilAlerte: 10, prix: 0, description: "" }
  const [medForm, setMedForm] = useState(emptyMed)
  const [stockDelta, setStockDelta] = useState({ quantite: 0, operation: "ajouter" })

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      const [meds, ordos] = await Promise.all([pharmacieService.getMedicaments(), pharmacieService.getOrdonnances()])
      setMedicaments(Array.isArray(meds) ? meds : [])
      setOrdonnances(Array.isArray(ordos) ? ordos : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreateMed = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await pharmacieService.createMedicament(medForm)
      setShowMedModal(false)
      setMedForm(emptyMed)
      await loadAll()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleUpdateStock = async (e) => {
    e.preventDefault()
    if (!selectedMed) return
    setSubmitting(true)
    try {
      const delta = parseInt(stockDelta.quantite) || 0
      const newStock = stockDelta.operation === "ajouter"
        ? selectedMed.stock + delta
        : Math.max(0, selectedMed.stock - delta)
      await pharmacieService.updateMedicament(selectedMed.id, { stock: newStock })
      setShowStockModal(false)
      setSelectedMed(null)
      await loadAll()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleDispenser = async (ordo) => {
    try {
      await pharmacieService.updateOrdonnance(ordo.id, { statut: "Dispensée" })
      await loadAll()
    } catch (e) { console.error(e) }
  }

  const alertes = medicaments.filter(m => m.stock <= m.seuil_alerte)
  const ruptures = medicaments.filter(m => m.stock === 0)

  const medColumns = [
    { key: "nom", header: "Nom", sortable: true },
    { key: "dci", header: "DCI", render: (r) => r.dci || "—" },
    { key: "forme", header: "Forme" },
    {
      key: "stock", header: "Stock",
      render: (r) => (
        <span className={r.stock === 0 ? "text-red-600 font-bold" : r.stock <= r.seuil_alerte ? "text-orange-600 font-medium" : "text-green-700"}>
          {r.stock} {r.stock <= r.seuil_alerte && r.stock > 0 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
        </span>
      )
    },
    { key: "prix", header: "Prix", render: (r) => `${parseFloat(r.prix || 0).toLocaleString("fr-FR")} FCFA` },
    {
      key: "actions", header: "Actions",
      render: (r) => <Button size="sm" variant="outline" onClick={() => { setSelectedMed(r); setStockDelta({ quantite: 0, operation: "ajouter" }); setShowStockModal(true) }}><Package className="w-3 h-3 mr-1" />Stock</Button>
    },
  ]

  const ordoColumns = [
    { key: "id", header: "N°", render: (r) => `ORD-${r.id}` },
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : "—" },
    { key: "medecin", header: "Médecin", render: (r) => r.medecin ? `${r.medecin.contact?.nom || ""} ${r.medecin.contact?.prenom || ""}`.trim() : "—" },
    { key: "date", header: "Date", render: (r) => r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={r.statut === "Dispensée" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>{r.statut}</Badge> },
    { key: "lignes", header: "Médicaments", render: (r) => `${(r.lignes || []).length} médicament(s)` },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => { setSelectedOrdo(r); setShowOrdoModal(true) }}><Eye className="w-3 h-3" /></Button>
          {r.statut === "En attente" && <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleDispenser(r)}>Dispenser</Button>}
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Pharmacie</h1><p className="text-gray-500">Gestion du stock et des ordonnances</p></div>
          {tab === "stock" && <Button onClick={() => setShowMedModal(true)}><Plus className="w-4 h-4 mr-2" />Ajouter Médicament</Button>}
        </div>

        <div className="flex gap-2 border-b">
          {["stock","ordonnances"].map(t => (
            <button key={t} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`} onClick={() => setTab(t)}>
              {t === "stock" ? "Stock Médicaments" : "Ordonnances"}
            </button>
          ))}
        </div>

        {tab === "stock" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Médicaments</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{medicaments.length}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-orange-500" />Alertes Stock</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-600">{alertes.length}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Ruptures</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{ruptures.length}</p></CardContent></Card>
            </div>
            <AdvancedTable columns={medColumns} data={medicaments} loading={loading} emptyMessage="Aucun médicament" />
          </>
        )}
        {tab === "ordonnances" && (
          <AdvancedTable columns={ordoColumns} data={ordonnances} loading={loading} emptyMessage="Aucune ordonnance" />
        )}
      </div>

      <Modal isOpen={showMedModal} onClose={() => setShowMedModal(false)} title="Ajouter un Médicament">
        <form onSubmit={handleCreateMed} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Nom</label><Input value={medForm.nom} onChange={e => setMedForm(f => ({ ...f, nom: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">DCI</label><Input value={medForm.dci} onChange={e => setMedForm(f => ({ ...f, dci: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Forme</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={medForm.forme} onChange={e => setMedForm(f => ({ ...f, forme: e.target.value }))}>
                {["Comprimé","Gélule","Sirop","Injectable","Pommade","Suppositoire","Collyre"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium">Stock initial</label><Input type="number" value={medForm.stock} onChange={e => setMedForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} /></div>
            <div><label className="text-sm font-medium">Seuil d&apos;alerte</label><Input type="number" value={medForm.seuilAlerte} onChange={e => setMedForm(f => ({ ...f, seuilAlerte: parseInt(e.target.value) || 10 }))} /></div>
            <div><label className="text-sm font-medium">Prix (FCFA)</label><Input type="number" value={medForm.prix} onChange={e => setMedForm(f => ({ ...f, prix: parseFloat(e.target.value) || 0 }))} /></div>
          </div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={medForm.description} onChange={e => setMedForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowMedModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Ajouter"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showStockModal} onClose={() => setShowStockModal(false)} title={`Modifier Stock — ${selectedMed?.nom}`}>
        <form onSubmit={handleUpdateStock} className="space-y-4">
          <p className="text-sm text-gray-500">Stock actuel : <strong>{selectedMed?.stock}</strong></p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Opération</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={stockDelta.operation} onChange={e => setStockDelta(f => ({ ...f, operation: e.target.value }))}>
                <option value="ajouter">Ajouter</option><option value="retirer">Retirer</option>
              </select>
            </div>
            <div><label className="text-sm font-medium">Quantité</label><Input type="number" min={0} value={stockDelta.quantite} onChange={e => setStockDelta(f => ({ ...f, quantite: e.target.value }))} /></div>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowStockModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Enregistrer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showOrdoModal} onClose={() => setShowOrdoModal(false)} title="Détails Ordonnance">
        {selectedOrdo && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 text-sm gap-2">
              <div><span className="text-gray-500">Patient :</span> {selectedOrdo.patient ? `${selectedOrdo.patient.contact?.nom} ${selectedOrdo.patient.contact?.prenom}` : "—"}</div>
              <div><span className="text-gray-500">Statut :</span> <Badge className={selectedOrdo.statut === "Dispensée" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>{selectedOrdo.statut}</Badge></div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Médicaments prescrits</p>
              {(selectedOrdo.lignes || []).map((l, i) => (
                <div key={i} className="border-b py-1 text-sm flex justify-between">
                  <span>{l.medicament?.nom || "—"}</span>
                  <span className="text-gray-500">{l.quantite} × {l.posologie || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
