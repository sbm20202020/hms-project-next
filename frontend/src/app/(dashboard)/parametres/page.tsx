'use client'

import { useState } from 'react'
import { useServices, useCreateService, useUpdateService } from '@/hooks/use-services'
import { useEmployes } from '@/hooks/use-employes'
import { Modal } from '@/components/ui/modal'
import { Plus, Loader2, Search, Settings, Users, Building2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

function ServiceForm({ onSuccess, initial }: { onSuccess?: () => void; initial?: any }) {
  const create = useCreateService()
  const update = useUpdateService()
  const [form, setForm] = useState({ nom: initial?.nom || '', description: initial?.description || '' })
  const cls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30'
  const mutation = initial ? update : create

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom) { toast.error('Nom requis'); return }
    const payload = initial ? { id: initial.id, data: form } : form
    mutation.mutate(payload as any, {
      onSuccess: () => { toast.success(initial ? 'Service mis à jour' : 'Service créé'); onSuccess?.() },
      onError: () => toast.error('Erreur'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Nom du service *</label>
        <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className={cls} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={cls} rows={3} />
      </div>
      <button type="submit" disabled={mutation.isPending} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} {initial ? 'Mettre à jour' : 'Créer le service'}
      </button>
    </form>
  )
}

export default function ParametresPage() {
  const { data: services = [], isLoading: loadingS } = useServices()
  const { data: employes = [], isLoading: loadingE } = useEmployes()
  const [showCreateService, setShowCreateService] = useState(false)
  const [editService, setEditService] = useState<any>(null)
  const [tab, setTab] = useState<'services' | 'employes'>('services')
  const [search, setSearch] = useState('')

  const serviceList = Array.isArray(services) ? services : []
  const employeList = Array.isArray(employes) ? employes : []

  const filteredServices = serviceList.filter((s: any) => (s.nom || '').toLowerCase().includes(search.toLowerCase()))
  const filteredEmployes = employeList.filter((e: any) => `${e.nom || ''} ${e.prenom || ''} ${e.role || ''}`.toLowerCase().includes(search.toLowerCase()))

  const isLoading = loadingS || loadingE

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configuration de l&apos;établissement</p>
        </div>
        {tab === 'services' && (
          <button onClick={() => setShowCreateService(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Nouveau service
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-500" /><p className="text-sm text-muted-foreground">Services</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{serviceList.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-emerald-500" /><p className="text-sm text-muted-foreground">Employés</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{employeList.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-amber-500" /><p className="text-sm text-muted-foreground">Médecins</p></div>
          <p className="text-xl font-bold text-foreground mt-1">{employeList.filter((e: any) => e.role === 'Médecin').length}</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        {(['services', 'employes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'services' ? 'Services' : 'Employés'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : tab === 'services' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredServices.length ? filteredServices.map((s: any) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{s.nom}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[400px] truncate">{s.description || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditService(s)} className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
                        <Edit2 className="h-3 w-3" /> Modifier
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">Aucun service trouvé</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Spécialité</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Téléphone</th>
              </tr></thead>
              <tbody>
                {filteredEmployes.length ? filteredEmployes.map((e: any) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{e.nom} {e.prenom}</td>
                    <td className="px-4 py-3"><span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{e.role || '-'}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{e.specialite || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.telephone || '-'}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucun employé trouvé</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreateService} onClose={() => setShowCreateService(false)} title="Nouveau service">
        <ServiceForm onSuccess={() => setShowCreateService(false)} />
      </Modal>

      <Modal open={!!editService} onClose={() => setEditService(null)} title="Modifier le service">
        {editService && <ServiceForm initial={editService} onSuccess={() => setEditService(null)} />}
      </Modal>
    </div>
  )
}
