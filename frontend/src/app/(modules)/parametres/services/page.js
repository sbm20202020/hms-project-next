"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { hospitalServicesCRUD } from "@/services/dossierService"
import { Plus, Pencil, Trash2, Check } from "lucide-react"

const boolFields = [
  { key: "isRequiredNurseService", label: "Infirmier requis" },
  { key: "isRequiredDoctorService", label: "Médecin requis" },
  { key: "isRequiredLabService", label: "Laboratoire requis" },
  { key: "isRequiredRadiologyService", label: "Radiologie requise" },
  { key: "isRequiredImagingService", label: "Imagerie requise" },
  { key: "isRequiredPharmacistService", label: "Pharmacien requis" },
]
const emptyForm = { nom: "", code: "", description: "", statut: "Actif", isRequiredNurseService: false, isRequiredDoctorService: false, isRequiredLabService: false, isRequiredRadiologyService: false, isRequiredImagingService: false, isRequiredPharmacistService: false }

export default function ParametresServicesPage() {
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
      const data = await hospitalServicesCRUD.getAll()
      setServices(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openCreate = () => { setEditMode(false); setForm(emptyForm); setShowModal(true) }
  const openEdit = (s) => {
    setEditMode(true)
    setSelectedId(s.id)
    setForm({
      nom: s.nom, code: s.code || "", description: s.description || "", statut: s.statut,
      isRequiredNurseService: s.is_required_nurse_service,
      isRequiredDoctorService: s.is_required_doctor_service,
      isRequiredLabService: s.is_required_lab_service,
      isRequiredRadiologyService: s.is_required_radiology_service,
      isRequiredImagingService: s.is_required_imaging_service,
      isRequiredPharmacistService: s.is_required_pharmacist_service,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editMode) { await hospitalServicesCRUD.update(selectedId, form) }
      else { await hospitalServicesCRUD.create(form) }
      setShowModal(false)
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce service ?")) return
    try { await hospitalServicesCRUD.delete(id); await loadData() } catch (e) { console.error(e) }
  }

  const columns = [
    { key: "nom", header: "Nom", sortable: true },
    { key: "code", header: "Code" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={r.statut === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{r.statut}</Badge> },
    {
      key: "requis", header: "Requis",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.is_required_nurse_service && <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">Infirmier</span>}
          {r.is_required_doctor_service && <span className="text-xs bg-purple-100 text-purple-700 px-1 rounded">Médecin</span>}
          {r.is_required_lab_service && <span className="text-xs bg-orange-100 text-orange-700 px-1 rounded">Labo</span>}
          {r.is_required_radiology_service && <span className="text-xs bg-red-100 text-red-700 px-1 rounded">Radio</span>}
          {r.is_required_imaging_service && <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">Imagerie</span>}
          {r.is_required_pharmacist_service && <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Pharma</span>}
        </div>
      )
    },
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
          <div><h1 className="text-2xl font-bold">Services Hospitaliers</h1><p className="text-gray-500">Configuration et paramétrage des services</p></div>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Nouveau Service</Button>
        </div>
        <AdvancedTable columns={columns} data={services} loading={loading} emptyMessage="Aucun service configuré" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMode ? "Modifier le Service" : "Nouveau Service"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Nom</label><Input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Code</label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Statut</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                <option>Actif</option><option>Inactif</option>
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div>
            <label className="text-sm font-medium">Personnels / Ressources requis</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {boolFields.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4" />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : editMode ? "Modifier" : "Créer"}</Button></div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
