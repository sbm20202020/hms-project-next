'use client'

import { useState } from 'react'
import { useExamensImagerie, useUpdateExamenImagerie } from '@/hooks/use-imagerie'
import { Modal } from '@/components/ui/modal'
import { ExamenImagerieForm } from '@/components/forms/examen-imagerie-form'
import { Plus, Loader2, Search, ScanLine, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ImageriePage() {
  const { data: examens = [], isLoading } = useExamensImagerie()
  const updateExamen = useUpdateExamenImagerie()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('')

  const list = Array.isArray(examens) ? examens : []
  const demandes = list.filter((e: any) => e.statut === 'Demandé').length
  const enCours = list.filter((e: any) => e.statut === 'En cours').length
  const termines = list.filter((e: any) => e.statut === 'Résultats disponibles').length

  const filtered = list.filter((e: any) => {
    const patient = typeof e.patient === 'object' && e.patient ? `${e.patient.nom} ${e.patient.prenom}` : ''
    const matchSearch = patient.toLowerCase().includes(search.toLowerCase()) || (e.type || '').toLowerCase().includes(search.toLowerCase())
    const matchStatut = !filterStatut || e.statut === filterStatut
    return matchSearch && matchStatut
  })

  const handleStatusChange = (id: number, statut: string) => {
    updateExamen.mutate({ id, data: { statut } as any }, {
      onSuccess: () => toast.success('Statut mis à jour'),
      onError: () => toast.error('Erreur'),
    })
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'Demandé': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'En cours': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Résultats disponibles': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Annulé': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imagerie Médicale</h1>
          <p className="text-muted-foreground">{list.length} examen{list.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouvel examen
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /><p className="text-sm text-muted-foreground">Demandés</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{demandes}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><ScanLine className="h-4 w-4 text-blue-500" /><p className="text-sm text-muted-foreground">En cours</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{enCours}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /><p className="text-sm text-muted-foreground">Terminés</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{termines}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm">
          <option value="">Tous les statuts</option>
          <option value="Demandé">Demandé</option>
          <option value="En cours">En cours</option>
          <option value="Résultats disponibles">Résultats disponibles</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Demandé par</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date demande</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length ? filtered.map((e: any) => {
                  const patient = typeof e.patient === 'object' && e.patient ? `${e.patient.nom} ${e.patient.prenom}` : '-'
                  const demandePar = typeof e.demande_par === 'object' && e.demande_par ? `Dr. ${e.demande_par.nom}` : '-'
                  return (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{patient}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.type || '-'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{demandePar}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.date_demande ? new Date(e.date_demande).toLocaleDateString('fr-FR') : '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(e.statut)}`}>{e.statut}</span></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {e.statut === 'Demandé' && (
                            <button onClick={() => handleStatusChange(e.id, 'En cours')} className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors">
                              Démarrer
                            </button>
                          )}
                          {e.statut === 'En cours' && (
                            <button onClick={() => handleStatusChange(e.id, 'Résultats disponibles')} className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors">
                              Résultats prêts
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Aucun examen trouvé</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouvel examen d'imagerie">
        <ExamenImagerieForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
