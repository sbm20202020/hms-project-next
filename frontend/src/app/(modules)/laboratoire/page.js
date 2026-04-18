"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { laboService } from "@/services/dossierService"
import { Plus, FlaskConical } from "lucide-react"

const statutColors = {
  "Demandé": "bg-blue-100 text-blue-800",
  "En cours": "bg-orange-100 text-orange-800",
  "Résultats disponibles": "bg-green-100 text-green-800",
  "Annulé": "bg-red-100 text-red-800",
}

export default function LaboratoirePage() {
  const [examens, setExamens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [newForm, setNewForm] = useState({ patientId: "", typeExamen: "", notes: "" })
  const [resultForm, setResultForm] = useState({ statut: "En cours", resultats: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await laboService.getAll()
      setExamens(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await laboService.create(newForm)
      setShowNewModal(false)
      setNewForm({ patientId: "", typeExamen: "", notes: "" })
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleUpdateResult = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    try {
      await laboService.update(selected.id, resultForm)
      setShowResultModal(false)
      setSelected(null)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const columns = [
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : `Patient #${r.patient || "—"}` },
    { key: "type_examen", header: "Type d'examen" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    { key: "date_demande", header: "Date", render: (r) => r.date_demande ? new Date(r.date_demande).toLocaleDateString("fr-FR") : "—" },
    { key: "notes", header: "Notes", render: (r) => r.notes ? r.notes.substring(0, 40) + (r.notes.length > 40 ? "..." : "") : "—" },
    {
      key: "actions", header: "Actions",
      render: (r) => r.statut !== "Résultats disponibles" && r.statut !== "Annulé"
        ? <Button size="sm" variant="outline" onClick={() => { setSelected(r); setResultForm({ statut: r.statut === "Demandé" ? "En cours" : "Résultats disponibles", resultats: r.resultats || "" }); setShowResultModal(true) }}>Résultats</Button>
        : <span className="text-xs text-gray-400">{r.resultats ? r.resultats.substring(0, 30) + "..." : "—"}</span>
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Laboratoire</h1><p className="text-gray-500">Demandes d&apos;examens et résultats</p></div>
          <Button onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4 mr-2" />Programmer Examen</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Demandés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{examens.filter(e => e.statut === "Demandé").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-600">{examens.filter(e => e.statut === "En cours").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Résultats disponibles</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{examens.filter(e => e.statut === "Résultats disponibles").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={examens} loading={loading} emptyMessage="Aucun examen trouvé" />
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Programmer un Examen">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="text-sm font-medium">ID Patient</label><Input value={newForm.patientId} onChange={e => setNewForm(f => ({ ...f, patientId: e.target.value }))} /></div>
          <div><label className="text-sm font-medium">Type d&apos;examen</label><Input value={newForm.typeExamen} onChange={e => setNewForm(f => ({ ...f, typeExamen: e.target.value }))} placeholder="Ex: NFS, Glycémie, Bilan lipidique..." /></div>
          <div><label className="text-sm font-medium">Notes</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={newForm.notes} onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Créer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Saisir les Résultats">
        <form onSubmit={handleUpdateResult} className="space-y-4">
          <div><label className="text-sm font-medium">Statut</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={resultForm.statut} onChange={e => setResultForm(f => ({ ...f, statut: e.target.value }))}>
              <option>En cours</option><option>Résultats disponibles</option><option>Annulé</option>
            </select>
          </div>
          <div><label className="text-sm font-medium">Résultats</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={4} value={resultForm.resultats} onChange={e => setResultForm(f => ({ ...f, resultats: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowResultModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Enregistrer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
