'use client'

import { useState } from 'react'
import { useCreateMedicament } from '@/hooks/use-pharmacie'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function MedicamentForm({ onSuccess }: { onSuccess: () => void }) {
  const create = useCreateMedicament()
  const [form, setForm] = useState({
    nom: '', dci: '', forme: 'Comprimé', stock: '0', seuilAlerte: '10', prix: '0', description: '',
  })
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const inputClass = 'flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom) { toast.error('Le nom est obligatoire'); return }
    try {
      await create.mutateAsync({ ...form, stock: Number(form.stock), seuilAlerte: Number(form.seuilAlerte), prix: Number(form.prix) } as any)
      toast.success('Médicament ajouté')
      onSuccess()
    } catch { toast.error('Erreur') }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Nom *</label>
          <input className={inputClass} value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Paracétamol" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">DCI</label>
          <input className={inputClass} value={form.dci} onChange={(e) => set('dci', e.target.value)} placeholder="Dénomination commune" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Forme</label>
          <select className={inputClass} value={form.forme} onChange={(e) => set('forme', e.target.value)}>
            <option>Comprimé</option><option>Gélule</option><option>Sirop</option><option>Injectable</option><option>Pommade</option><option>Suppositoire</option><option>Autre</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Stock</label>
          <input type="number" className={inputClass} value={form.stock} onChange={(e) => set('stock', e.target.value)} min="0" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Seuil alerte</label>
          <input type="number" className={inputClass} value={form.seuilAlerte} onChange={(e) => set('seuilAlerte', e.target.value)} min="0" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Prix unitaire (FC)</label>
        <input type="number" className={inputClass} value={form.prix} onChange={(e) => set('prix', e.target.value)} min="0" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea className={`${inputClass} h-16 py-2`} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={create.isPending} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Ajouter le médicament
        </button>
      </div>
    </form>
  )
}
