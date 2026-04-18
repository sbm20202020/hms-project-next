"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { soinsInfirmiersService } from "@/services/dossierService"
import { Plus, Heart } from "lucide-react"

const statutColors = { "Terminé": "bg-green-100 text-green-800", "En cours": "bg-blue-100 text-blue-800", "En attente": "bg-yellow-100 text-yellow-800" }

const emptyForm = { patientId: "", tension: "", temperature: "", pouls: "", respiration: "", saturation: "", poids: "", taille: "", observations: "" }

export default function InfirmeriePage() {
  const [soins, setSoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadSoins() }, [])

  const loadSoins = async () => {
    try {
      const data = await soinsInfirmiersService.getAll()
      setSoins(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await soinsInfirmiersService.create({ ...form, soinsEffectues: [] })
      setShowModal(false)
      setForm(emptyForm)
      await loadSoins()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const columns = [
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : `Patient #${r.patient || "—"}` },
    { key: "date_heure", header: "Date", render: (r) => r.date_heure ? new Date(r.date_heure).toLocaleString("fr-FR") : "—" },
    { key: "tension", header: "Tension", render: (r) => r.tension || "—" },
    { key: "temperature", header: "Temp.", render: (r) => r.temperature ? `${r.temperature}°C` : "—" },
    { key: "pouls", header: "Pouls", render: (r) => r.pouls ? `${r.pouls} bpm` : "—" },
    { key: "saturation", header: "SpO2", render: (r) => r.saturation ? `${r.saturation}%` : "—" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Soins Infirmiers</h1><p className="text-gray-500">Enregistrement des signes vitaux et actes infirmiers</p></div>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nouveau Soin</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Soins</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{soins.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Terminés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{soins.filter(s => s.statut === "Terminé").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{soins.filter(s => s.statut === "En attente").length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={soins} loading={loading} emptyMessage="Aucun soin enregistré" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enregistrer un Soin">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="text-sm font-medium">ID Patient</label><Input value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} placeholder="Ex: 1" /></div>
          <div className="grid grid-cols-2 gap-3">
            {[["tension","Tension (ex: 120/80)"],["temperature","Température (°C)"],["pouls","Pouls (bpm)"],["respiration","Respiration (/min)"],["saturation","Saturation (%)"],["poids","Poids (kg)"],["taille","Taille (cm)"]].map(([k, label]) => (
              <div key={k}><label className="text-sm font-medium">{label}</label><Input type={k === "tension" ? "text" : "number"} step="0.1" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></div>
            ))}
          </div>
          <div><label className="text-sm font-medium">Observations</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Enregistrer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
