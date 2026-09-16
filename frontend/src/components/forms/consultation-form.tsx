'use client'

import { useState } from 'react'
import { useCreateConsultation } from '@/hooks/use-consultations'
import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ConsultationForm({ onSuccess }: { onSuccess: () => void }) {
  const create = useCreateConsultation()
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const [form, setForm] = useState({
    patientId: '', medecinId: '', anamnese: '', diagnostic: '', prescription: '', notes: '',
  })

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const inputClass = 'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId) { toast.error('Sélectionnez un patient'); return }
    try {
      await create.mutateAsync({
        patientId: Number(form.patientId),
        medecinId: form.medecinId ? Number(form.medecinId) : undefined,
        anamnese: form.anamnese, diagnostic: form.diagnostic,
        prescription: form.prescription, notes: form.notes,
      } as any)
      toast.success('Consultation créée')
      onSuccess()
    } catch { toast.error('Erreur lors de la création') }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Patient *</label>
        <select className={inputClass} value={form.patientId} onChange={(e) => set('patientId', e.target.value)} required>
          <option value="">Sélectionner...</option>
          {Array.isArray(patients) && patients.map((p: any) => (
            <option key={p.id} value={p.id}>{p.contact?.prenom} {p.contact?.nom}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Médecin</label>
        <select className={inputClass} value={form.medecinId} onChange={(e) => set('medecinId', e.target.value)}>
          <option value="">Sélectionner...</option>
          {Array.isArray(employes) && employes.map((e: any) => (
            <option key={e.id} value={e.id}>{e.contact?.prenom} {e.contact?.nom}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Anamnèse</label>
        <textarea className={`${inputClass} h-20 py-2`} value={form.anamnese} onChange={(e) => set('anamnese', e.target.value)} placeholder="Histoire de la maladie..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Diagnostic</label>
        <textarea className={`${inputClass} h-16 py-2`} value={form.diagnostic} onChange={(e) => set('diagnostic', e.target.value)} placeholder="Diagnostic..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Prescription</label>
        <textarea className={`${inputClass} h-16 py-2`} value={form.prescription} onChange={(e) => set('prescription', e.target.value)} placeholder="Traitement prescrit..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <textarea className={`${inputClass} h-16 py-2`} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Observations..." />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={create.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer la consultation
        </button>
      </div>
    </form>
  )
}
