'use client'

import { useState } from 'react'
import { useCreateAdmission } from '@/hooks/use-hospitalisation'
import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { useChambres } from '@/hooks/use-hospitalisation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function AdmissionForm({ onSuccess }: { onSuccess?: () => void }) {
  const create = useCreateAdmission()
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const { data: chambres = [] } = useChambres()

  const [form, setForm] = useState({
    patientId: '', litId: '', medecinId: '', dateSortiePrevue: '', motif: '', notes: '',
  })

  // Get available lits from chambres
  const litsDisponibles = (Array.isArray(chambres) ? chambres : []).flatMap((c: any) =>
    (c.lits || []).filter((l: any) => l.statut === 'Libre').map((l: any) => ({ ...l, chambreNumero: c.numero }))
  )

  const medecins = (Array.isArray(employes) ? employes : []).filter((e: any) => e.role === 'Médecin')
  const patientList = Array.isArray(patients) ? patients : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.litId || !form.medecinId) { toast.error('Champs requis manquants'); return }
    create.mutate({
      patientId: Number(form.patientId), litId: Number(form.litId), medecinId: Number(form.medecinId),
      dateSortiePrevue: form.dateSortiePrevue || undefined, motif: form.motif || undefined, notes: form.notes || undefined,
    } as any, {
      onSuccess: () => { toast.success('Admission créée'); onSuccess?.() },
      onError: () => toast.error('Erreur lors de la création'),
    })
  }

  const cls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30'

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
        <label className="block text-sm font-medium text-foreground mb-1">Lit disponible *</label>
        <select value={form.litId} onChange={e => setForm({ ...form, litId: e.target.value })} className={cls} required>
          <option value="">Sélectionner un lit</option>
          {litsDisponibles.map((l: any) => <option key={l.id} value={l.id}>Chambre {l.chambreNumero} - Lit {l.numero}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Médecin *</label>
        <select value={form.medecinId} onChange={e => setForm({ ...form, medecinId: e.target.value })} className={cls} required>
          <option value="">Sélectionner un médecin</option>
          {medecins.map((m: any) => <option key={m.id} value={m.id}>Dr. {m.nom} {m.prenom}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Date sortie prévue</label>
        <input type="date" value={form.dateSortiePrevue} onChange={e => setForm({ ...form, dateSortiePrevue: e.target.value })} className={cls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Motif</label>
        <textarea value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} className={cls} rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={cls} rows={2} />
      </div>
      <button type="submit" disabled={create.isPending} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Créer l&apos;admission
      </button>
    </form>
  )
}
