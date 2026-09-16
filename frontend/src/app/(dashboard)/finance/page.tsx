'use client'

import { useState } from 'react'
import { useFinanceDashboard, useDepenses, useRevenus } from '@/hooks/use-finance'
import { Modal } from '@/components/ui/modal'
import { DepenseForm } from '@/components/forms/depense-form'
import { Plus, Loader2, Search, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export default function FinancePage() {
  const { data: dashboard } = useFinanceDashboard()
  const { data: depenses = [], isLoading: loadingD } = useDepenses()
  const { data: revenus = [], isLoading: loadingR } = useRevenus()
  const [showCreate, setShowCreate] = useState(false)
  const [tab, setTab] = useState<'depenses' | 'revenus'>('depenses')
  const [search, setSearch] = useState('')

  const d = dashboard || { totalRevenus: 0, totalDepenses: 0, beneficeNet: 0, enAttente: 0 }
  const depenseList = Array.isArray(depenses) ? depenses : []
  const revenuList = Array.isArray(revenus) ? revenus : []

  const filteredDepenses = depenseList.filter((dep: any) =>
    (dep.categorie || '').toLowerCase().includes(search.toLowerCase()) || (dep.description || '').toLowerCase().includes(search.toLowerCase())
  )
  const filteredRevenus = revenuList.filter((r: any) =>
    (r.description || '').toLowerCase().includes(search.toLowerCase()) || (r.source || '').toLowerCase().includes(search.toLowerCase())
  )

  const isLoading = loadingD || loadingR

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground">Gestion financière</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouvelle dépense
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /><p className="text-sm text-muted-foreground">Revenus</p></div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{fmt(d.totalRevenus)} FC</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-red-500" /><p className="text-sm text-muted-foreground">Dépenses</p></div>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{fmt(d.totalDepenses)} FC</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-500" /><p className="text-sm text-muted-foreground">Bénéfice net</p></div>
          <p className={`text-xl font-bold mt-1 ${d.beneficeNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{fmt(d.beneficeNet)} FC</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /><p className="text-sm text-muted-foreground">En attente</p></div>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{fmt(d.enAttente)} FC</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        {(['depenses', 'revenus'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'depenses' ? `Dépenses (${depenseList.length})` : `Revenus (${revenuList.length})`}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : tab === 'depenses' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant (FC)</th>
              </tr></thead>
              <tbody>
                {filteredDepenses.length ? filteredDepenses.map((dep: any) => (
                  <tr key={dep.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">{dep.categorie}</span></td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{dep.description || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{dep.date ? new Date(dep.date).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400">{fmt(dep.montant || 0)}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucune dépense trouvée</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant (FC)</th>
              </tr></thead>
              <tbody>
                {filteredRevenus.length ? filteredRevenus.map((r: any) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{r.source || 'Facture'}</span></td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{r.description || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">{fmt(r.montant || 0)}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucun revenu trouvé</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle dépense">
        <DepenseForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
