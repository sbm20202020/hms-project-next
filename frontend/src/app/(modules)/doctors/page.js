"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { employeService, serviceService } from "@/services/dossierService"
import { Plus, Pencil, Trash2, Users } from "lucide-react"

const emptyForm = { nom: "", prenom: "", email: "", telephone: "", sexe: "M", serviceId: "", statut: "Actif" }

export default function DoctorsPage() {
  const [employes, setEmployes] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [empData, svcData] = await Promise.all([employeService.getAll(), serviceService.getAll()])
      setEmployes(Array.isArray(empData) ? empData : [])
      setServices(Array.isArray(svcData) ? svcData : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openCreate = () => { setEditMode(false); setForm(emptyForm); setShowModal(true) }
  const openEdit = (emp) => {
    setEditMode(true)
    setSelectedId(emp.id)
    setForm({
      nom: emp.contact?.nom || "",
      prenom: emp.contact?.prenom || "",
      email: emp.contact?.email || "",
      telephone: emp.contact?.telephone || "",
      sexe: emp.contact?.sexe || "M",
      serviceId: emp.service?.id || "",
      statut: emp.statut || "Actif",
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editMode) { await employeService.update(selectedId, form) }
      else { await employeService.create(form) }
      setShowModal(false)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet employé ?")) return
    try { await employeService.delete(id); await loadData() } catch (e) { console.error(e) }
  }

  const columns = [
    { key: "nom", header: "Nom Prénom", render: (r) => `${r.contact?.nom || ""} ${r.contact?.prenom || ""}`.trim() || "—" },
    { key: "email", header: "Email", render: (r) => r.contact?.email || "—" },
    { key: "telephone", header: "Téléphone", render: (r) => r.contact?.telephone || "—" },
    { key: "service", header: "Service", render: (r) => r.service?.nom || "Non assigné" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={r.statut === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{r.statut}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Pencil className="w-3 h-3" /></Button>
          <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(r.id)}><Trash2 className="w-3 h-3" /></Button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Médecins & Employés</h1><p className="text-gray-500">Gestion du personnel médical</p></div>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Ajouter Employé</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Personnel</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{employes.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Actifs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{employes.filter(e=>e.statut==="Actif").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Services</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{services.length}</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={employes} loading={loading} emptyMessage="Aucun employé trouvé" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMode ? "Modifier l'Employé" : "Ajouter un Employé"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Nom</label><Input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Prénom</label><Input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Téléphone</label><Input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Sexe</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value }))}>
                <option value="M">Masculin</option><option value="F">Féminin</option>
              </select>
            </div>
            <div><label className="text-sm font-medium">Service</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.serviceId} onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}>
                <option value="">— Choisir un service —</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium">Statut</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                <option>Actif</option><option>Inactif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : editMode ? "Modifier" : "Ajouter"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
