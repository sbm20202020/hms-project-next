'use client'

import { useState } from 'react'
import { useCreateExamenImagerie } from '@/hooks/use-imagerie'
import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const TYPES_IMAGERIE = ['Radiographie', 'Échographie', 'Scanner', 'IRM', 'Mammographie']

export function ExamenImagerieForm({ onSuccess }: { onSuccess?: () => void }) {
  const create = useCreateExamenImagerie()
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const [form, setForm] = useState({ patientId: '', type: 'Radiographie', notes: '', demandeParId: '' })

  const medecins = (Array.isArray(employes) ? employes : []).filter((e: any) => e.role === 'Médecin')
  const patientList = Array.isArray(patients) ? patients : []
  const cls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId) { toast.error('Patient requis'); return }
    create.mutate({
      patientId: Number(form.patientId), type: form.type,
      notes: form.notes || undefined, demandeParId: form.demandeParId ? Number(form.demandeParId) : undefined,
    } as any, {
      onSuccess: () => { toast.success('Examen imagerie créé'); onSuccess?.() },
      onError: () => toast.error('Erreur lors de la création'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Patient *</label>
        <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className={cls} required>
          <option value="">Sélectionner un patient</option>
          {patientList.map((p: any) => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Type d&apos;imagerie *</label>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={cls} required>
          {TYPES_IMAGERIE.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Demandé par</label>
        <select value={form.demandeParId} onChange={e => setForm({ ...form, demandeParId: e.target.value })} className={cls}>
          <option value="">Sélectionner un médecin</option>
          {medecins.map((m: any) => <option key={m.id} value={m.id}>Dr. {m.nom} {m.prenom}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={cls} rows={3} />
      </div>
      <button type="submit" disabled={create.isPending} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Demander l&apos;examen
      </button>
    </form>
  )
}
