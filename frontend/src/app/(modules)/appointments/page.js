"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { rendezVousService } from "@/services/dossierService"
import { Plus, CheckCircle, XCircle } from "lucide-react"

const statutColors = {
  "Confirmé": "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  "Annulé": "bg-red-100 text-red-800",
  "Terminé": "bg-gray-100 text-gray-800",
  "Urgent": "bg-red-200 text-red-900",
}

const emptyForm = { patientId: "", medecinId: "", date: "", heure: "", type: "Consultation", duree: 30, notes: "" }

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await rendezVousService.getAll()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await rendezVousService.create(form)
      setShowModal(false)
      setForm(emptyForm)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleUpdateStatut = async (rdv, statut) => {
    try {
      await rendezVousService.update(rdv.id, { statut })
      await loadData()
    } catch (e) { console.error(e) }
  }

  const todayCount = appointments.filter(a => a.date === today).length

  const columns = [
    { key: "date", header: "Date", sortable: true, render: (r) => `${r.date || ""} ${r.heure || ""}`.trim() },
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : `Patient #${r.patient || "—"}` },
    { key: "medecin", header: "Médecin", render: (r) => r.medecin ? `${r.medecin.contact?.nom || ""} ${r.medecin.contact?.prenom || ""}`.trim() : "—" },
    { key: "type", header: "Type" },
    { key: "duree", header: "Durée", render: (r) => `${r.duree || 30} min` },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          {r.statut === "En attente" && <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleUpdateStatut(r, "Confirmé")}><CheckCircle className="w-3 h-3 mr-1" />Confirmer</Button>}
          {(r.statut === "Confirmé" || r.statut === "En attente") && <Button size="sm" variant="outline" className="text-gray-600" onClick={() => handleUpdateStatut(r, "Terminé")}>Terminer</Button>}
          {r.statut !== "Annulé" && r.statut !== "Terminé" && <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleUpdateStatut(r, "Annulé")}><XCircle className="w-3 h-3" /></Button>}
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Rendez-vous</h1><p className="text-gray-500">Planning et gestion des rendez-vous</p></div>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nouveau RDV</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{appointments.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Confirmés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{appointments.filter(a => a.statut === "Confirmé").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Aujourd&apos;hui</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{todayCount}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.statut === "En attente").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={appointments} loading={loading} emptyMessage="Aucun rendez-vous trouvé" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau Rendez-vous">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">ID Patient</label><Input value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} placeholder="Ex: 1" /></div>
            <div><label className="text-sm font-medium">ID Médecin</label><Input value={form.medecinId} onChange={e => setForm(f => ({ ...f, medecinId: e.target.value }))} placeholder="Ex: 1" /></div>
            <div><label className="text-sm font-medium">Date</label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Heure</label><Input type="time" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Type</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Consultation","Suivi","Urgence","Contrôle","Téléconsultation"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium">Durée (min)</label><Input type="number" value={form.duree} onChange={e => setForm(f => ({ ...f, duree: parseInt(e.target.value) || 30 }))} /></div>
          </div>
          <div><label className="text-sm font-medium">Notes</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Créer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
