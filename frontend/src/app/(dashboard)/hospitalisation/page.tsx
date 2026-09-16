'use client'

import { useState } from 'react'
import { useChambres, useAdmissions, useUpdateAdmission } from '@/hooks/use-hospitalisation'
import { Modal } from '@/components/ui/modal'
import { AdmissionForm } from '@/components/forms/admission-form'
import { Plus, Loader2, Search, BedDouble, Users, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export default function HospitalisationPage() {
  const { data: chambres = [], isLoading: loadingC } = useChambres()
  const { data: admissions = [], isLoading: loadingA } = useAdmissions()
  const updateAdmission = useUpdateAdmission()
  const [showCreate, setShowCreate] = useState(false)
  const [tab, setTab] = useState<'admissions' | 'chambres'>('admissions')
  const [search, setSearch] = useState('')

  const chambreList = Array.isArray(chambres) ? chambres : []
  const admissionList = Array.isArray(admissions) ? admissions : []

  const enCours = admissionList.filter((a: any) => a.statut === 'En cours').length
  const totalLits = chambreList.reduce((s: number, c: any) => s + (c.nombre_lits || 0), 0)
  const litsOccupes = chambreList.reduce((s: number, c: any) => s + ((c.lits || []).filter((l: any) => l.statut === 'Occupé').length), 0)

  const filteredAdmissions = admissionList.filter((a: any) => {
    const p = typeof a.patient === 'object' && a.patient ? `${a.patient.nom} ${a.patient.prenom}` : ''
    return p.toLowerCase().includes(search.toLowerCase()) || (a.motif || '').toLowerCase().includes(search.toLowerCase())
  })

  const handleSortie = (id: number) => {
    updateAdmission.mutate({ id, data: { statut: 'Sorti' } as any }, {
      onSuccess: () => toast.success('Patient sorti'),
      onError: () => toast.error('Erreur'),
    })
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'En cours': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Sorti': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Transféré': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const chambreColor = (s: string) => {
    switch (s) {
      case 'Disponible': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'Occupée': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'Maintenance': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const isLoading = loadingC || loadingA

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hospitalisation</h1>
          <p className="text-muted-foreground">{enCours} admission{enCours !== 1 ? 's' : ''} en cours</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouvelle admission
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /><p className="text-sm text-muted-foreground">Admissions en cours</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{enCours}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-emerald-500" /><p className="text-sm text-muted-foreground">Lits disponibles</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{totalLits - litsOccupes} / {totalLits}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Chambres</p>
          <p className="text-xl font-bold text-foreground mt-1">{chambreList.length}</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        {(['admissions', 'chambres'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'admissions' ? 'Admissions' : 'Chambres'}
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
        ) : tab === 'admissions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Médecin</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lit</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entrée</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Motif</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredAdmissions.length ? filteredAdmissions.map((a: any) => {
                  const patient = typeof a.patient === 'object' && a.patient ? `${a.patient.nom} ${a.patient.prenom}` : '-'
                  const medecin = typeof a.medecin === 'object' && a.medecin ? `Dr. ${a.medecin.nom}` : '-'
                  const lit = typeof a.lit === 'object' && a.lit ? `Lit ${a.lit.numero}` : '-'
                  return (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{patient}</td>
                      <td className="px-4 py-3 text-muted-foreground">{medecin}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.date_entree ? new Date(a.date_entree).toLocaleDateString('fr-FR') : '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(a.statut)}`}>{a.statut}</span></td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{a.motif || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        {a.statut === 'En cours' && (
                          <button onClick={() => handleSortie(a.id)} className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 transition-colors">
                            <LogOut className="h-3 w-3" /> Sortie
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Aucune admission trouvée</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {chambreList.filter((c: any) => c.numero?.toLowerCase().includes(search.toLowerCase()) || (c.type || '').toLowerCase().includes(search.toLowerCase())).map((c: any) => (
              <div key={c.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Chambre {c.numero}</h3>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${chambreColor(c.statut)}`}>{c.statut}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.type} • {c.nombre_lits} lit{c.nombre_lits !== 1 ? 's' : ''}</p>
                {c.lits && c.lits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.lits.map((l: any) => (
                      <span key={l.id} className={`inline-flex rounded px-2 py-0.5 text-xs ${l.statut === 'Libre' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : l.statut === 'Occupé' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        Lit {l.numero}: {l.statut}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {chambreList.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">Aucune chambre configurée</p>}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle admission">
        <AdmissionForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
