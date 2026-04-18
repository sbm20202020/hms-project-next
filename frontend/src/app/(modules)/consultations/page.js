"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { consultationService } from "@/services/dossierService"
import { Plus, Eye, Edit } from "lucide-react"

const statutColors = { "En cours": "bg-blue-100 text-blue-800", "Terminée": "bg-green-100 text-green-800" }

const emptyForm = { patientId: "", medecinId: "", anamnese: "", diagnostic: "", prescription: "", notes: "", statut: "En cours" }

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await consultationService.getAll()
      setConsultations(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openCreate = () => { setEditMode(false); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c) => {
    setEditMode(true)
    setSelectedId(c.id)
    setForm({ patientId: c.patient?.id || "", medecinId: c.medecin?.id || "", anamnese: c.anamnese || "", diagnostic: c.diagnostic || "", prescription: c.prescription || "", notes: c.notes || "", statut: c.statut })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editMode) { await consultationService.update(selectedId, form) }
      else { await consultationService.create(form) }
      setShowModal(false)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const columns = [
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : "—" },
    { key: "medecin", header: "Médecin", render: (r) => r.medecin ? `${r.medecin.contact?.nom || ""} ${r.medecin.contact?.prenom || ""}`.trim() : "—" },
    { key: "date", header: "Date", render: (r) => r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—" },
    { key: "diagnostic", header: "Diagnostic", render: (r) => r.diagnostic ? r.diagnostic.substring(0, 50) + (r.diagnostic.length > 50 ? "..." : "") : "—" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (r) => <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Edit className="w-3 h-3 mr-1" />Voir</Button>
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Consultations Médicales</h1><p className="text-gray-500">Historique et gestion des consultations</p></div>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Nouvelle Consultation</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{consultations.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{consultations.filter(c=>c.statut==="En cours").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Terminées</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{consultations.filter(c=>c.statut==="Terminée").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={consultations} loading={loading} emptyMessage="Aucune consultation trouvée" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMode ? "Consultation" : "Nouvelle Consultation"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editMode && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">ID Patient</label><Input value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} /></div>
              <div><label className="text-sm font-medium">ID Médecin</label><Input value={form.medecinId} onChange={e => setForm(f => ({ ...f, medecinId: e.target.value }))} /></div>
            </div>
          )}
          {[["anamnese","Anamnèse / Motif"],["diagnostic","Diagnostic"],["prescription","Prescription / Ordonnance"],["notes","Notes cliniques"]].map(([k, label]) => (
            <div key={k}><label className="text-sm font-medium">{label}</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></div>
          ))}
          {editMode && (
            <div><label className="text-sm font-medium">Statut</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                <option>En cours</option><option>Terminée</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : editMode ? "Enregistrer" : "Créer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
