'use client'

import { useState } from 'react'
import { useCreateSoinInfirmier } from '@/hooks/use-soins'
import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const SOINS_TYPES = ['Prise de constantes', 'Injection', 'Pansement', 'Perfusion', 'Prélèvement sanguin', 'Soins de plaie', 'Administration médicaments', 'Autre']

export function SoinForm({ onSuccess }: { onSuccess?: () => void }) {
  const create = useCreateSoinInfirmier()
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const [form, setForm] = useState({
    patientId: '', infirmierId: '', tension: '', temperature: '', pouls: '', saturation: '', poids: '', taille: '',
    soinsEffectues: [] as string[], observations: '',
  })

  const infirmiers = (Array.isArray(employes) ? employes : []).filter((e: any) => e.role === 'Infirmier' || e.role === 'Infirmière')
  const patientList = Array.isArray(patients) ? patients : []
  const cls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30'

  const toggleSoin = (s: string) => {
    setForm(f => ({ ...f, soinsEffectues: f.soinsEffectues.includes(s) ? f.soinsEffectues.filter(x => x !== s) : [...f.soinsEffectues, s] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId) { toast.error('Patient requis'); return }
    create.mutate({
      patientId: Number(form.patientId),
      infirmierId: form.infirmierId ? Number(form.infirmierId) : undefined,
      tension: form.tension || undefined, temperature: form.temperature ? Number(form.temperature) : undefined,
      pouls: form.pouls ? Number(form.pouls) : undefined, saturation: form.saturation ? Number(form.saturation) : undefined,
      poids: form.poids ? Number(form.poids) : undefined, taille: form.taille ? Number(form.taille) : undefined,
      soinsEffectues: form.soinsEffectues, observations: form.observations || undefined,
    } as any, {
      onSuccess: () => { toast.success('Soin enregistré'); onSuccess?.() },
      onError: () => toast.error('Erreur lors de la création'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Patient *</label>
        <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className={cls} required>
          <option value="">Sélectionner un patient</option>
          {patientList.map((p: any) => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Infirmier(ère)</label>
        <select value={form.infirmierId} onChange={e => setForm({ ...form, infirmierId: e.target.value })} className={cls}>
          <option value="">Sélectionner</option>
          {infirmiers.map((i: any) => <option key={i.id} value={i.id}>{i.nom} {i.prenom}</option>)}
        </select>
      </div>

      <p className="text-sm font-medium text-foreground">Constantes vitales</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Tension (mmHg)</label>
          <input type="text" placeholder="12/8" value={form.tension} onChange={e => setForm({ ...form, tension: e.target.value })} className={cls} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Température (°C)</label>
          <input type="number" step="0.1" placeholder="37.0" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} className={cls} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Pouls (bpm)</label>
          <input type="number" placeholder="72" value={form.pouls} onChange={e => setForm({ ...form, pouls: e.target.value })} className={cls} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">SpO₂ (%)</label>
          <input type="number" placeholder="98" value={form.saturation} onChange={e => setForm({ ...form, saturation: e.target.value })} className={cls} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Poids (kg)</label>
          <input type="number" step="0.1" value={form.poids} onChange={e => setForm({ ...form, poids: e.target.value })} className={cls} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Taille (cm)</label>
          <input type="number" value={form.taille} onChange={e => setForm({ ...form, taille: e.target.value })} className={cls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Soins effectués</label>
        <div className="flex flex-wrap gap-2">
          {SOINS_TYPES.map(s => (
            <button key={s} type="button" onClick={() => toggleSoin(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${form.soinsEffectues.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Observations</label>
        <textarea value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} className={cls} rows={3} />
      </div>
      <button type="submit" disabled={create.isPending} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer le soin
      </button>
    </form>
  )
}
