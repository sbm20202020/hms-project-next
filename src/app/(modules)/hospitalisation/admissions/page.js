"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { admissionService } from "@/services/dossierService"
import { Plus, LogOut, ArrowRightLeft } from "lucide-react"

const statutColors = { "En cours": "bg-blue-100 text-blue-800", "Sorti": "bg-green-100 text-green-800", "Transféré": "bg-orange-100 text-orange-800" }

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showSortieModal, setShowSortieModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ patientId: "", litId: "", medecinId: "", dateSortiePrevue: "", motif: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await admissionService.getAll()
      setAdmissions(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await admissionService.create(form)
      setShowNewModal(false)
      setForm({ patientId: "", litId: "", medecinId: "", dateSortiePrevue: "", motif: "", notes: "" })
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleSortie = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await admissionService.update(selected.id, { statut: "Sorti", dateSortieReelle: new Date().toISOString() })
      setShowSortieModal(false)
      setSelected(null)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const columns = [
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : "—" },
    { key: "lit", header: "Lit", render: (r) => r.lit ? `Chambre ${r.lit.chambre?.numero || "?"} — Lit ${r.lit.numero}` : "—" },
    { key: "medecin", header: "Médecin", render: (r) => r.medecin ? `${r.medecin.contact?.nom || ""} ${r.medecin.contact?.prenom || ""}`.trim() : "—" },
    { key: "date_entree", header: "Entrée", render: (r) => r.date_entree ? new Date(r.date_entree).toLocaleDateString("fr-FR") : "—" },
    { key: "date_sortie_prevue", header: "Sortie prévue", render: (r) => r.date_sortie_prevue || "—" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (r) => r.statut === "En cours"
        ? <Button size="sm" variant="outline" className="text-orange-600" onClick={() => { setSelected(r); setShowSortieModal(true) }}><LogOut className="w-3 h-3 mr-1" />Sortie</Button>
        : null
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Admissions</h1><p className="text-gray-500">Gestion des admissions et sorties</p></div>
          <Button onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4 mr-2" />Nouvelle Admission</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{admissions.filter(a=>a.statut==="En cours").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Sorties</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{admissions.filter(a=>a.statut==="Sorti").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Transferts</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-600">{admissions.filter(a=>a.statut==="Transféré").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={admissions} loading={loading} emptyMessage="Aucune admission trouvée" />
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle Admission">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">ID Patient</label><Input value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">ID Lit</label><Input value={form.litId} onChange={e => setForm(f => ({ ...f, litId: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">ID Médecin</label><Input value={form.medecinId} onChange={e => setForm(f => ({ ...f, medecinId: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Sortie prévue</label><Input type="date" value={form.dateSortiePrevue} onChange={e => setForm(f => ({ ...f, dateSortiePrevue: e.target.value }))} /></div>
          </div>
          <div><label className="text-sm font-medium">Motif</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={form.motif} onChange={e => setForm(f => ({ ...f, motif: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Admettre"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showSortieModal} onClose={() => setShowSortieModal(false)} title="Confirmer la Sortie">
        <div className="space-y-4">
          <p className="text-sm">Confirmer la sortie du patient <strong>{selected?.patient?.contact?.nom} {selected?.patient?.contact?.prenom}</strong> ?</p>
          <p className="text-xs text-gray-500">Le lit sera automatiquement libéré.</p>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowSortieModal(false)}>Annuler</Button><Button onClick={handleSortie} disabled={submitting}>{submitting ? "..." : "Confirmer la sortie"}</Button></div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
