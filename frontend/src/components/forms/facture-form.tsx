'use client'

import { useState } from 'react'
import { useCreateFacture } from '@/hooks/use-factures'
import { usePatients } from '@/hooks/use-patients'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Ligne { description: string; quantite: string; prixUnitaire: string }

export function FactureForm({ onSuccess }: { onSuccess: () => void }) {
  const create = useCreateFacture()
  const { data: patients = [] } = usePatients()
  const [patientId, setPatientId] = useState('')
  const [typeAssurance, setTypeAssurance] = useState('Aucune')
  const [notes, setNotes] = useState('')
  const [lignes, setLignes] = useState<Ligne[]>([{ description: '', quantite: '1', prixUnitaire: '0' }])

  const addLine = () => setLignes((p) => [...p, { description: '', quantite: '1', prixUnitaire: '0' }])
  const removeLine = (i: number) => setLignes((p) => p.filter((_, idx) => idx !== i))
  const updateLine = (i: number, k: keyof Ligne, v: string) => setLignes((p) => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const total = lignes.reduce((s, l) => s + Number(l.quantite || 0) * Number(l.prixUnitaire || 0), 0)
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
  const inputClass = 'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId) { toast.error('Sélectionnez un patient'); return }
    if (lignes.every((l) => !l.description)) { toast.error('Ajoutez au moins une ligne'); return }
    try {
      await create.mutateAsync({ patientId: Number(patientId), typeAssurance, notes, lignes } as any)
      toast.success('Facture créée avec succès')
      onSuccess()
    } catch { toast.error('Erreur lors de la création') }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Patient *</label>
          <select className={inputClass} value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
            <option value="">Sélectionner...</option>
            {Array.isArray(patients) && patients.map((p: any) => (
              <option key={p.id} value={p.id}>{p.contact?.prenom} {p.contact?.nom}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Assurance</label>
          <select className={inputClass} value={typeAssurance} onChange={(e) => setTypeAssurance(e.target.value)}>
            <option>Aucune</option>
            <option>CNSS</option>
            <option>Mutuelle</option>
            <option>Privée</option>
          </select>
        </div>
      </div>

      {/* Lines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Lignes de facturation</p>
          <button type="button" onClick={addLine} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Plus className="h-3 w-3" /> Ajouter
          </button>
        </div>

        {lignes.map((l, i) => (
          <div key={i} className="flex items-start gap-2">
            <input className={`${inputClass} flex-1`} placeholder="Description" value={l.description} onChange={(e) => updateLine(i, 'description', e.target.value)} />
            <input type="number" className={`${inputClass} w-20`} placeholder="Qté" value={l.quantite} onChange={(e) => updateLine(i, 'quantite', e.target.value)} min="1" />
            <input type="number" className={`${inputClass} w-28`} placeholder="Prix" value={l.prixUnitaire} onChange={(e) => updateLine(i, 'prixUnitaire', e.target.value)} min="0" />
            <button type="button" onClick={() => removeLine(i)} className="mt-2 text-muted-foreground hover:text-destructive transition-colors" disabled={lignes.length === 1}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex justify-end border-t border-border pt-3">
          <p className="text-lg font-bold text-foreground">Total : {fmt(total)} FC</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <textarea className={`${inputClass} h-16 py-2`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={create.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer la facture
        </button>
      </div>
    </form>
  )
}
