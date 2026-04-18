"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { imagerieService } from "@/services/dossierService"
import { Plus, Scan } from "lucide-react"

const statutColors = {
  "Demandé": "bg-blue-100 text-blue-800",
  "En cours": "bg-orange-100 text-orange-800",
  "Résultats disponibles": "bg-green-100 text-green-800",
  "Annulé": "bg-red-100 text-red-800",
}

export default function ImageriePage() {
  const [examens, setExamens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [newForm, setNewForm] = useState({ patientId: "", type: "Radiographie", notes: "" })
  const [resultForm, setResultForm] = useState({ statut: "Résultats disponibles", compteRendu: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await imagerieService.getAll()
      setExamens(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await imagerieService.create(newForm)
      setShowNewModal(false)
      setNewForm({ patientId: "", type: "Radiographie", notes: "" })
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const openNewWithType = (type) => {
    setNewForm(f => ({ ...f, type }))
    setShowNewModal(true)
  }

  const handleUpdateResult = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    try {
      await imagerieService.update(selected.id, resultForm)
      setShowResultModal(false)
      setSelected(null)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const columns = [
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : `Patient #${r.patient || "—"}` },
    { key: "type", header: "Type" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    { key: "date_demande", header: "Date", render: (r) => r.date_demande ? new Date(r.date_demande).toLocaleDateString("fr-FR") : "—" },
    { key: "compte_rendu", header: "Compte-rendu", render: (r) => r.compte_rendu ? r.compte_rendu.substring(0, 50) + "..." : "—" },
    {
      key: "actions", header: "Actions",
      render: (r) => r.statut !== "Annulé"
        ? <Button size="sm" variant="outline" onClick={() => { setSelected(r); setResultForm({ statut: "Résultats disponibles", compteRendu: r.compte_rendu || "" }); setShowResultModal(true) }}>Compte-rendu</Button>
        : null
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Imagerie Médicale</h1><p className="text-gray-500">Radiologie, échographie, scanner, IRM</p></div>
          <div className="flex gap-2">
            {["Radiographie","Échographie","Scanner","IRM"].map(t => (
              <Button key={t} size="sm" variant="outline" onClick={() => openNewWithType(t)}><Plus className="w-3 h-3 mr-1" />{t}</Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Demandés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{examens.filter(e => e.statut === "Demandé").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-600">{examens.filter(e => e.statut === "En cours").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Résultats disponibles</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{examens.filter(e => e.statut === "Résultats disponibles").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={examens} loading={loading} emptyMessage="Aucun examen trouvé" />
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title={`Programmer — ${newForm.type}`}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="text-sm font-medium">ID Patient</label><Input value={newForm.patientId} onChange={e => setNewForm(f => ({ ...f, patientId: e.target.value }))} /></div>
          <div><label className="text-sm font-medium">Type</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={newForm.type} onChange={e => setNewForm(f => ({ ...f, type: e.target.value }))}>
              {["Radiographie","Échographie","Scanner","IRM","Mammographie"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium">Notes</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={newForm.notes} onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Créer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Saisir le Compte-rendu">
        <form onSubmit={handleUpdateResult} className="space-y-4">
          <div><label className="text-sm font-medium">Statut</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={resultForm.statut} onChange={e => setResultForm(f => ({ ...f, statut: e.target.value }))}>
              <option>En cours</option><option>Résultats disponibles</option><option>Annulé</option>
            </select>
          </div>
          <div><label className="text-sm font-medium">Compte-rendu du radiologue</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={5} value={resultForm.compteRendu} onChange={e => setResultForm(f => ({ ...f, compteRendu: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowResultModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Enregistrer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
