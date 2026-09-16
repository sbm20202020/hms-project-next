'use client'

import { useState } from 'react'
import { usePatients } from '@/hooks/use-patients'
import { Modal } from '@/components/ui/modal'
import { PatientForm } from '@/components/forms/patient-form'
import { Plus, Loader2, Search, User } from 'lucide-react'

export default function PatientsPage() {
  const { data: patients = [], isLoading } = usePatients()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = Array.isArray(patients)
    ? patients.filter((p: any) => {
        const c = p.contact || {}
        const text = `${c.nom || ''} ${c.prenom || ''} ${c.telephone || ''} ${c.email || ''}`.toLowerCase()
        return text.includes(search.toLowerCase())
      })
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">
            {filtered.length} patient{filtered.length !== 1 ? 's' : ''} enregistré{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau patient
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Téléphone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sexe</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date naissance</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((p: any) => {
                  const c = p.contact || {}
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                            {(c.prenom || '?')[0]}{(c.nom || '?')[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{c.prenom} {c.nom}</p>
                            <p className="text-xs text-muted-foreground">{c.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{c.telephone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.sexe === 'M' ? 'bg-blue-500/10 text-blue-600' : 'bg-pink-500/10 text-pink-600'}`}>
                          {c.sexe === 'M' ? 'Masculin' : c.sexe === 'F' ? 'Féminin' : c.sexe || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {c.date_naissance ? new Date(c.date_naissance).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-4 py-3 text-foreground">{p.type_patient || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          p.statut === 'Actif' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-600'
                        }`}>
                          {p.statut || 'Actif'}
                        </span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <User className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                      <p className="text-muted-foreground">Aucun patient trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau patient" description="Remplissez les informations du patient" className="max-w-2xl">
        <PatientForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
