'use client'

import { useState } from 'react'
import { useCreateRendezVous } from '@/hooks/use-rdv'
import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function RdvForm({ onSuccess }: { onSuccess: () => void }) {
  const createRdv = useCreateRendezVous()
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const [form, setForm] = useState({
    patientId: '', medecinId: '', date: '', heure: '',
    type: 'Consultation', duree: '30', notes: '',
  })

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const inputClass = 'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.date || !form.heure) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }
    try {
      await createRdv.mutateAsync({
        patientId: Number(form.patientId),
        medecinId: form.medecinId ? Number(form.medecinId) : undefined,
        date: form.date,
        heure: form.heure,
        type: form.type,
        duree: Number(form.duree),
        notes: form.notes,
      } as any)
      toast.success('Rendez-vous créé avec succès')
      onSuccess()
    } catch {
      toast.error('Erreur lors de la création')
    }
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Date *</label>
          <input type="date" className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Heure *</label>
          <input type="time" className={inputClass} value={form.heure} onChange={(e) => set('heure', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select className={inputClass} value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option>Consultation</option>
            <option>Contrôle</option>
            <option>Urgence</option>
            <option>Suivi</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Durée (min)</label>
          <input type="number" className={inputClass} value={form.duree} onChange={(e) => set('duree', e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <textarea className={`${inputClass} h-20 py-2`} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notes..." />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={createRdv.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {createRdv.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer le RDV
        </button>
      </div>
    </form>
  )
}
