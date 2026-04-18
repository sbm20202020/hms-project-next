"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvancedTable from "@/components/ui/advanced-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { factureService } from "@/services/dossierService"
import { Eye, Plus, CheckCircle, DollarSign, Receipt } from "lucide-react"

const statutColors = {
  "En attente": "bg-yellow-100 text-yellow-800",
  "Validée": "bg-blue-100 text-blue-800",
  "Payée": "bg-green-100 text-green-800",
}

const emptyForm = {
  patientId: "",
  typeAssurance: "Aucune",
  notes: "",
  lignes: [{ description: "", quantite: 1, prixUnitaire: 0 }],
}

export default function CaissePage() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [methodePaiement, setMethodePaiement] = useState("Espèces")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadFactures() }, [])

  const loadFactures = async () => {
    try {
      const data = await factureService.getAll()
      setFactures(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const totalPaye = factures.filter(f => f.statut === "Payée").reduce((s, f) => s + parseFloat(f.montant_total || 0), 0)

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await factureService.create(form)
      setShowNewModal(false)
      setForm(emptyForm)
      await loadFactures()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const handleValider = async (facture) => {
    try {
      await factureService.update(facture.id, { statut: "Validée" })
      await loadFactures()
    } catch (e) { console.error(e) }
  }

  const handleEncaisser = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await factureService.update(selected.id, { statut: "Payée", methodePaiement })
      setShowPayModal(false)
      setSelected(null)
      await loadFactures()
    } catch (e) { console.error(e) } finally { setSubmitting(false) }
  }

  const addLigne = () => setForm(f => ({ ...f, lignes: [...f.lignes, { description: "", quantite: 1, prixUnitaire: 0 }] }))
  const updateLigne = (i, field, value) => {
    const lignes = [...form.lignes]
    lignes[i] = { ...lignes[i], [field]: value }
    setForm(f => ({ ...f, lignes }))
  }

  const columns = [
    { key: "numero_facture", header: "N° Facture", sortable: true },
    { key: "patient", header: "Patient", render: (r) => r.patient ? `${r.patient.contact?.nom || ""} ${r.patient.contact?.prenom || ""}`.trim() : "—" },
    { key: "type_assurance", header: "Assurance" },
    { key: "statut", header: "Statut", render: (r) => <Badge className={statutColors[r.statut] || ""}>{r.statut}</Badge> },
    { key: "montant_total", header: "Montant", render: (r) => `${parseFloat(r.montant_total || 0).toLocaleString("fr-FR")} FCFA` },
    { key: "methode_paiement", header: "Paiement", render: (r) => r.methode_paiement || "—" },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => { setSelected(r); setShowDetailModal(true) }}><Eye className="w-3 h-3" /></Button>
          {r.statut === "En attente" && <Button size="sm" variant="outline" className="text-blue-600" onClick={() => handleValider(r)}><CheckCircle className="w-3 h-3 mr-1" />Valider</Button>}
          {r.statut === "Validée" && <Button size="sm" variant="outline" className="text-green-600" onClick={() => { setSelected(r); setShowPayModal(true) }}><DollarSign className="w-3 h-3 mr-1" />Encaisser</Button>}
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Caisse / Facturation</h1><p className="text-gray-500">Gestion des factures et encaissements</p></div>
          <Button onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4 mr-2" />Nouvelle Facture</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Factures</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{factures.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">En attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{factures.filter(f => f.statut === "En attente").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Payées</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{factures.filter(f => f.statut === "Payée").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Encaissé</CardTitle></CardHeader><CardContent><p className="text-lg font-bold text-green-700">{totalPaye.toLocaleString("fr-FR")} FCFA</p></CardContent></Card>
        </div>
        <AdvancedTable columns={columns} data={factures} loading={loading} emptyMessage="Aucune facture trouvée" />
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvelle Facture">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">ID Patient</label><Input value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} placeholder="Ex: 1" /></div>
            <div><label className="text-sm font-medium">Assurance</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.typeAssurance} onChange={e => setForm(f => ({ ...f, typeAssurance: e.target.value }))}>
                {["Aucune","CNSS","CNAMGS","Assurance Privée"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium">Lignes de facturation</label>
            {form.lignes.map((l, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mt-1">
                <Input placeholder="Description" value={l.description} onChange={e => updateLigne(i, "description", e.target.value)} />
                <Input type="number" placeholder="Qté" min={1} value={l.quantite} onChange={e => updateLigne(i, "quantite", parseInt(e.target.value) || 1)} />
                <Input type="number" placeholder="Prix unitaire" min={0} value={l.prixUnitaire} onChange={e => updateLigne(i, "prixUnitaire", parseFloat(e.target.value) || 0)} />
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" className="mt-2" onClick={addLigne}>+ Ligne</Button>
          </div>
          <div><label className="text-sm font-medium">Notes</label><textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? "Création..." : "Créer"}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Encaisser la facture">
        <div className="space-y-4">
          <p className="text-sm">Facture <strong>{selected?.numero_facture}</strong> — Montant : <strong>{parseFloat(selected?.montant_total || 0).toLocaleString("fr-FR")} FCFA</strong></p>
          <div><label className="text-sm font-medium">Méthode de paiement</label>
            <select className="w-full border rounded px-3 py-2 text-sm mt-1" value={methodePaiement} onChange={e => setMethodePaiement(e.target.value)}>
              {["Espèces","Carte Bancaire","Mobile Money","Virement"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowPayModal(false)}>Annuler</Button><Button onClick={handleEncaisser} disabled={submitting}>{submitting ? "..." : "Confirmer le paiement"}</Button></div>
        </div>
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Facture ${selected?.numero_facture}`}>
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Patient :</span> {selected.patient ? `${selected.patient.contact?.nom} ${selected.patient.contact?.prenom}` : "—"}</div>
              <div><span className="text-gray-500">Statut :</span> <Badge className={statutColors[selected.statut]}>{selected.statut}</Badge></div>
              <div><span className="text-gray-500">Assurance :</span> {selected.type_assurance}</div>
              <div><span className="text-gray-500">Paiement :</span> {selected.methode_paiement || "—"}</div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Lignes</p>
              {(selected.lignes || []).map((l, i) => (
                <div key={i} className="flex justify-between text-sm border-b py-1">
                  <span>{l.description} × {l.quantite}</span>
                  <span className="font-medium">{parseFloat(l.montant || 0).toLocaleString("fr-FR")} FCFA</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold mt-2"><span>Total</span><span>{parseFloat(selected.montant_total || 0).toLocaleString("fr-FR")} FCFA</span></div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
