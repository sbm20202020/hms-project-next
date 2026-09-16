'use client'

import { useState } from 'react'
import { useCreateDepense } from '@/hooks/use-finance'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['Salaires', 'Équipements', 'Médicaments', 'Maintenance', 'Fournitures', 'Énergie', 'Autres']

export function DepenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const create = useCreateDepense()
  const [form, setForm] = useState({ categorie: '', montant: '', description: '', date: new Date().toISOString().split('T')[0] })
  const cls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categorie || !form.montant) { toast.error('Champs requis manquants'); return }
    create.mutate({
      categorie: form.categorie, montant: Number(form.montant),
      description: form.description || undefined, date: form.date,
    } as any, {
      onSuccess: () => { toast.success('Dépense enregistrée'); onSuccess?.() },
      onError: () => toast.error('Erreur lors de la création'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Catégorie *</label>
        <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} className={cls} required>
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Montant (FC) *</label>
        <input type="number" min="0" step="0.01" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} className={cls} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Date</label>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={cls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={cls} rows={3} />
      </div>
      <button type="submit" disabled={create.isPending} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer la dépense
      </button>
    </form>
  )
}
