'use client'

import { useState } from 'react'
import { useFactures, useUpdateFacture } from '@/hooks/use-factures'
import { Modal } from '@/components/ui/modal'
import { FactureForm } from '@/components/forms/facture-form'
import { Plus, Loader2, Search, Receipt, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

const statusColor = (s: string) => {
  if (s === 'Payée') return 'bg-emerald-500/10 text-emerald-600'
  if (s === 'Annulée') return 'bg-red-500/10 text-red-600'
  if (s === 'Validée') return 'bg-blue-500/10 text-blue-600'
  return 'bg-amber-500/10 text-amber-600'
}

export default function FacturationPage() {
  const { data: factures = [], isLoading } = useFactures()
  const updateFacture = useUpdateFacture()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const list = Array.isArray(factures) ? factures : []
  const filtered = list.filter((f: any) => {
    const text = `${f.numero_facture || ''} ${f.patient?.contact?.nom || ''} ${f.patient?.contact?.prenom || ''} ${f.statut || ''}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const markPaid = async (id: number) => {
    try {
      await updateFacture.mutateAsync({ id, data: { statut: 'Payée' } })
      toast.success('Facture marquée comme payée')
    } catch { toast.error('Erreur') }
  }

  const totalMois = list
    .filter((f: any) => f.statut === 'Payée')
    .reduce((s: number, f: any) => s + (f.montant_total || 0), 0)

  const totalEnAttente = list
    .filter((f: any) => f.statut === 'En attente' || f.statut === 'Validée')
    .reduce((s: number, f: any) => s + (f.montant_total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Facturation</h1>
          <p className="text-muted-foreground">{filtered.length} facture{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouvelle facture
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total factures</p>
          <p className="text-xl font-bold text-foreground mt-1">{list.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Payées</p>
          <p className="text-xl font-bold text-emerald-500 mt-1">{fmt(totalMois)} FC</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">En attente</p>
          <p className="text-xl font-bold text-amber-500 mt-1">{fmt(totalEnAttente)} FC</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher une facture..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">N° Facture</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((f: any) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">{f.numero_facture}</td>
                    <td className="px-4 py-3 text-foreground">{f.patient?.contact?.prenom} {f.patient?.contact?.nom}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{fmt(f.montant_total || 0)} FC</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(f.statut)}`}>{f.statut}</span></td>
                    <td className="px-4 py-3 text-foreground">{f.created_at ? new Date(f.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                    <td className="px-4 py-3">
                      {(f.statut === 'En attente' || f.statut === 'Validée') && (
                        <button onClick={() => markPaid(f.id)} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                          <CheckCircle className="h-3 w-3" /> Payer
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-12 text-center">
                    <Receipt className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">Aucune facture</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle facture" description="Créer une facture avec lignes de facturation" className="max-w-2xl">
        <FactureForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
