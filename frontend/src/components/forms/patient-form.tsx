'use client'

import { useState } from 'react'
import { useCreatePatient } from '@/hooks/use-patients'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PatientFormProps {
  onSuccess: () => void
}

export function PatientForm({ onSuccess }: PatientFormProps) {
  const createPatient = useCreatePatient()
  const [form, setForm] = useState({
    nom: '', prenom: '', sexe: 'M', telephone: '', email: '',
    dateNaissance: '', adresse: '', ville: '', codePostal: '', numeroSecu: '',
    typePatient: 'Externe', convention: '', statut: 'Actif',
    contactUrgence: '', telephoneUrgence: '',
    allergies: '', antecedents: '', traitements: '',
  })

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom || !form.prenom || !form.dateNaissance) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }
    try {
      await createPatient.mutateAsync(form as any)
      toast.success('Patient créé avec succès')
      onSuccess()
    } catch {
      toast.error('Erreur lors de la création du patient')
    }
  }

  const inputClass = 'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
  const labelClass = 'text-sm font-medium text-foreground'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Nom *</label>
          <input className={inputClass} value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Dupont" required />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Prénom *</label>
          <input className={inputClass} value={form.prenom} onChange={(e) => set('prenom', e.target.value)} placeholder="Jean" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Sexe</label>
          <select className={inputClass} value={form.sexe} onChange={(e) => set('sexe', e.target.value)}>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Date de naissance *</label>
          <input type="date" className={inputClass} value={form.dateNaissance} onChange={(e) => set('dateNaissance', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Téléphone</label>
          <input className={inputClass} value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder="+243..." />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Adresse</label>
        <input className={inputClass} value={form.adresse} onChange={(e) => set('adresse', e.target.value)} placeholder="123 Rue..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Ville</label>
          <input className={inputClass} value={form.ville} onChange={(e) => set('ville', e.target.value)} placeholder="Kinshasa" />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Type patient</label>
          <select className={inputClass} value={form.typePatient} onChange={(e) => set('typePatient', e.target.value)}>
            <option value="Externe">Externe</option>
            <option value="Interne">Interne</option>
            <option value="Urgence">Urgence</option>
          </select>
        </div>
      </div>

      {/* Medical */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground mb-3">Informations médicales</p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className={labelClass}>Allergies</label>
            <textarea className={`${inputClass} h-16 py-2`} value={form.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Allergies connues..." />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Antécédents</label>
            <textarea className={`${inputClass} h-16 py-2`} value={form.antecedents} onChange={(e) => set('antecedents', e.target.value)} placeholder="Antécédents médicaux..." />
          </div>
        </div>
      </div>

      {/* Emergency contact */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground mb-3">Contact d&apos;urgence</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Nom</label>
            <input className={inputClass} value={form.contactUrgence} onChange={(e) => set('contactUrgence', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Téléphone</label>
            <input className={inputClass} value={form.telephoneUrgence} onChange={(e) => set('telephoneUrgence', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={createPatient.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {createPatient.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer le patient
        </button>
      </div>
    </form>
  )
}
