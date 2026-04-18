"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { chambreService } from "@/services/dossierService"
import { Plus, Eye, Bed } from "lucide-react"

const statutColors = { "Disponible": "bg-green-100 text-green-800", "Occupée": "bg-red-100 text-red-800", "Maintenance": "bg-orange-100 text-orange-800" }

export default function RoomsPage() {
  const [chambres, setChambres] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ numero: "", type: "Simple", nombreLits: 1, description: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await chambreService.getAll()
      setChambres(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await chambreService.create(form)
      setShowModal(false)
      setForm({ numero: "", type: "Simple", nombreLits: 1, description: "" })
      await loadData()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Chambres & Lits</h1><p className="text-gray-500">Gestion des chambres et de l&apos;occupation</p></div>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nouvelle Chambre</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["Total", chambres.length, "text-gray-800"], ["Disponibles", chambres.filter(c=>c.statut==="Disponible").length, "text-green-600"], ["Occupées", chambres.filter(c=>c.statut==="Occupée").length, "text-red-600"], ["Maintenance", chambres.filter(c=>c.statut==="Maintenance").length, "text-orange-600"]].map(([label, val, cls]) => (
            <Card key={label}><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">{label}</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${cls}`}>{val}</p></CardContent></Card>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : chambres.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><Bed className="w-12 h-12 mx-auto mb-4" /><p>Aucune chambre trouvée</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {chambres.map(c => {
              const litsLibres = (c.lits || []).filter(l => l.statut === "Libre").length
              return (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-xl font-bold">Chambre {c.numero}</p><p className="text-xs text-gray-500">{c.type}</p></div>
                      <Badge className={statutColors[c.statut] || ""}>{c.statut}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{c.service?.nom || "Service non défini"}</p>
                    <p className="text-xs text-gray-400">{litsLibres}/{c.nombre_lits} lits libres</p>
                    <div className="flex gap-1 mt-3">
                      {(c.lits || []).map(l => (
                        <div key={l.id} className={`w-4 h-4 rounded-sm ${l.statut === "Libre" ? "bg-green-400" : l.statut === "Occupé" ? "bg-red-400" : "bg-orange-400"}`} title={`Lit ${l.numero}: ${l.statut}`} />
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => { setSelected(c); setShowDetailModal(true) }}><Eye className="w-3 h-3 mr-1" />Détails</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle Chambre">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Numéro</label><Input value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} required /></div>
            <div><label className="text-sm font-medium">Type</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Simple","Double","Suite","Salle commune","Réanimation"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium">Nombre de lits</label><Input type="number" min={1} value={form.nombreLits} onChange={e => setForm(f => ({ ...f, nombreLits: parseInt(e.target.value) || 1 }))} /></div>
          </div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "..." : "Créer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Chambre ${selected?.numero}`}>
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 text-sm gap-2">
              <div><span className="text-gray-500">Type :</span> {selected.type}</div>
              <div><span className="text-gray-500">Statut :</span> <Badge className={statutColors[selected.statut]}>{selected.statut}</Badge></div>
              <div><span className="text-gray-500">Service :</span> {selected.service?.nom || "—"}</div>
              <div><span className="text-gray-500">Lits :</span> {selected.nombre_lits}</div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">État des lits</p>
              <div className="space-y-1">
                {(selected.lits || []).map(l => (
                  <div key={l.id} className="flex items-center justify-between text-sm py-1 border-b">
                    <span>Lit {l.numero}</span>
                    <Badge className={l.statut === "Libre" ? "bg-green-100 text-green-800" : l.statut === "Occupé" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}>{l.statut}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
