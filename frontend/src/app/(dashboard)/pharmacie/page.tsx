'use client'

import { useState } from 'react'
import { useMedicaments } from '@/hooks/use-pharmacie'
import { Modal } from '@/components/ui/modal'
import { MedicamentForm } from '@/components/forms/medicament-form'
import { Plus, Loader2, Search, Pill, AlertTriangle } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export default function PharmaciePage() {
  const { data: medicaments = [], isLoading } = useMedicaments()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const list = Array.isArray(medicaments) ? medicaments : []
  const filtered = list.filter((m: any) => {
    const text = `${m.nom || ''} ${m.dci || ''} ${m.forme || ''}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const lowStock = list.filter((m: any) => (m.stock || 0) <= (m.seuil_alerte || 10)).length
  const totalValue = list.reduce((s: number, m: any) => s + (m.stock || 0) * (m.prix || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacie</h1>
          <p className="text-muted-foreground">{list.length} médicament{list.length !== 1 ? 's' : ''} en stock</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau médicament
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total références</p>
          <p className="text-xl font-bold text-foreground mt-1">{list.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Valeur du stock</p>
          <p className="text-xl font-bold text-foreground mt-1">{fmt(totalValue)} FC</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Stock faible</p>
            {lowStock > 0 && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
          </div>
          <p className={`text-xl font-bold mt-1 ${lowStock > 0 ? 'text-amber-500' : 'text-foreground'}`}>{lowStock}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher un médicament..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">DCI</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Forme</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prix (FC)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((m: any) => {
                  const low = (m.stock || 0) <= (m.seuil_alerte || 10)
                  return (
                    <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{m.nom}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.dci || '—'}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">{m.forme}</span></td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${low ? 'text-amber-500' : 'text-foreground'}`}>
                          {m.stock}
                          {low && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">{fmt(m.prix || 0)}</td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={5} className="px-4 py-12 text-center">
                    <Pill className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">Aucun médicament</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau médicament" description="Ajouter un médicament au stock">
        <MedicamentForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
