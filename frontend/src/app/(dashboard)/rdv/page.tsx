'use client'

import { useState } from 'react'
import { useRendezVous } from '@/hooks/use-rdv'
import { Modal } from '@/components/ui/modal'
import { RdvForm } from '@/components/forms/rdv-form'
import { Plus, Loader2, Search, Calendar } from 'lucide-react'

export default function RdvPage() {
  const { data: rdvs = [], isLoading } = useRendezVous()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const list = Array.isArray(rdvs) ? rdvs : []
  const filtered = list.filter((r: any) => {
    const text = `${r.patient?.contact?.nom || ''} ${r.patient?.contact?.prenom || ''} ${r.motif || ''} ${r.type || ''}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const statusColor = (s: string) => {
    if (s === 'Confirmé') return 'bg-emerald-500/10 text-emerald-600'
    if (s === 'Annulé') return 'bg-red-500/10 text-red-600'
    if (s === 'Terminé') return 'bg-gray-500/10 text-gray-600'
    return 'bg-blue-500/10 text-blue-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rendez-vous</h1>
          <p className="text-muted-foreground">{filtered.length} rendez-vous</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau RDV
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Médecin</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Heure</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((r: any) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{r.patient?.contact?.prenom} {r.patient?.contact?.nom}</td>
                    <td className="px-4 py-3 text-foreground">{r.medecin?.contact?.prenom} {r.medecin?.contact?.nom || '—'}</td>
                    <td className="px-4 py-3 text-foreground">{r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—'}</td>
                    <td className="px-4 py-3 text-foreground">{r.heure || '—'}</td>
                    <td className="px-4 py-3 text-foreground">{r.type || '—'}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r.statut)}`}>{r.statut || 'En attente'}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-12 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">Aucun rendez-vous</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau rendez-vous" description="Planifier un rendez-vous">
        <RdvForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
