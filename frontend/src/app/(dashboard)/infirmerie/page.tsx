'use client'

import { useState } from 'react'
import { useSoinsInfirmiers } from '@/hooks/use-soins'
import { Modal } from '@/components/ui/modal'
import { SoinForm } from '@/components/forms/soin-form'
import { Plus, Loader2, Search, Heart, Thermometer, Activity } from 'lucide-react'

export default function InfirmeriePage() {
  const { data: soins = [], isLoading } = useSoinsInfirmiers()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const list = Array.isArray(soins) ? soins : []
  const today = new Date().toISOString().split('T')[0]
  const todayCount = list.filter((s: any) => s.date_heure?.startsWith(today)).length

  const filtered = list.filter((s: any) => {
    const patient = typeof s.patient === 'object' && s.patient ? `${s.patient.nom} ${s.patient.prenom}` : ''
    return patient.toLowerCase().includes(search.toLowerCase()) || (s.observations || '').toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Infirmerie</h1>
          <p className="text-muted-foreground">Soins infirmiers &amp; constantes vitales</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau soin
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500" /><p className="text-sm text-muted-foreground">Total soins</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{list.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500" /><p className="text-sm text-muted-foreground">Aujourd&apos;hui</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{todayCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-amber-500" /><p className="text-sm text-muted-foreground">Constantes enregistrées</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{list.filter((s: any) => s.temperature || s.tension).length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher un patient..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Infirmier(ère)</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Constantes</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Soins</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Observations</th>
              </tr></thead>
              <tbody>
                {filtered.length ? filtered.map((s: any) => {
                  const patient = typeof s.patient === 'object' && s.patient ? `${s.patient.nom} ${s.patient.prenom}` : '-'
                  const infirmier = typeof s.infirmier === 'object' && s.infirmier ? `${s.infirmier.nom} ${s.infirmier.prenom}` : '-'
                  const constantes = [
                    s.tension && `TA: ${s.tension}`,
                    s.temperature && `T: ${s.temperature}°C`,
                    s.pouls && `P: ${s.pouls}`,
                    s.saturation && `SpO₂: ${s.saturation}%`,
                  ].filter(Boolean).join(' • ')
                  const soinsArr = Array.isArray(s.soins_effectues) ? s.soins_effectues : []
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{patient}</td>
                      <td className="px-4 py-3 text-muted-foreground">{infirmier}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.date_heure ? new Date(s.date_heure).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{constantes || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">{soinsArr.slice(0, 2).map((soin: string, i: number) => (
                          <span key={i} className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{soin}</span>
                        ))}{soinsArr.length > 2 && <span className="text-xs text-muted-foreground">+{soinsArr.length - 2}</span>}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{s.observations || '-'}</td>
                    </tr>
                  )
                }) : <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Aucun soin enregistré</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau soin infirmier">
        <SoinForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
