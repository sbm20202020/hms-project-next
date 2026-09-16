'use client'

import { usePatients } from '@/hooks/use-patients'
import { useEmployes } from '@/hooks/use-employes'
import { useExamensLabo } from '@/hooks/use-labo'
import { useExamensImagerie } from '@/hooks/use-imagerie'
import { useSoinsInfirmiers } from '@/hooks/use-soins'
import { useAdmissions } from '@/hooks/use-hospitalisation'
import { useFinanceDashboard } from '@/hooks/use-finance'
import { Users, Stethoscope, FlaskConical, ScanLine, Heart, BedDouble, DollarSign, FileText } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export default function RapportsPage() {
  const { data: patients = [] } = usePatients()
  const { data: employes = [] } = useEmployes()
  const { data: examensLabo = [] } = useExamensLabo()
  const { data: examensImagerie = [] } = useExamensImagerie()
  const { data: soins = [] } = useSoinsInfirmiers()
  const { data: admissions = [] } = useAdmissions()
  const { data: dashboard } = useFinanceDashboard()

  const pList = Array.isArray(patients) ? patients : []
  const eList = Array.isArray(employes) ? employes : []
  const labList = Array.isArray(examensLabo) ? examensLabo : []
  const imgList = Array.isArray(examensImagerie) ? examensImagerie : []
  const soinList = Array.isArray(soins) ? soins : []
  const admList = Array.isArray(admissions) ? admissions : []
  const d = dashboard || { totalRevenus: 0, totalDepenses: 0, beneficeNet: 0, enAttente: 0 }

  const medecins = eList.filter((e: any) => e.role === 'Médecin').length
  const infirmiers = eList.filter((e: any) => e.role === 'Infirmier' || e.role === 'Infirmière').length

  const reports = [
    { icon: Users, label: 'Total patients', value: pList.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { icon: Stethoscope, label: 'Médecins', value: medecins, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: Heart, label: 'Infirmiers', value: infirmiers, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
    { icon: FlaskConical, label: 'Examens labo', value: labList.length, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { icon: ScanLine, label: 'Examens imagerie', value: imgList.length, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { icon: Heart, label: 'Soins infirmiers', value: soinList.length, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
    { icon: BedDouble, label: 'Admissions', value: admList.length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { icon: DollarSign, label: 'Bénéfice net', value: `${fmt(d.beneficeNet)} FC`, color: d.beneficeNet >= 0 ? 'text-emerald-500' : 'text-red-500', bg: d.beneficeNet >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-red-50 dark:bg-red-950/30' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de l&apos;activité hospitalière</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${r.bg}`}><r.icon className={`h-5 w-5 ${r.color}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{r.label}</p>
                <p className="text-xl font-bold text-foreground">{r.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-blue-500" /><h2 className="text-lg font-semibold text-foreground">Résumé financier</h2></div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Revenus totaux</span><span className="font-medium text-emerald-600 dark:text-emerald-400">{fmt(d.totalRevenus)} FC</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Dépenses totales</span><span className="font-medium text-red-600 dark:text-red-400">{fmt(d.totalDepenses)} FC</span></div>
            <hr className="border-border" />
            <div className="flex justify-between"><span className="text-sm font-medium text-foreground">Bénéfice net</span><span className={`font-bold ${d.beneficeNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{fmt(d.beneficeNet)} FC</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">En attente de paiement</span><span className="font-medium text-amber-600 dark:text-amber-400">{fmt(d.enAttente)} FC</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4"><Stethoscope className="h-5 w-5 text-emerald-500" /><h2 className="text-lg font-semibold text-foreground">Activité médicale</h2></div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Examens labo en attente</span><span className="font-medium text-foreground">{labList.filter((e: any) => e.statut === 'Demandé' || e.statut === 'En cours').length}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Examens imagerie en attente</span><span className="font-medium text-foreground">{imgList.filter((e: any) => e.statut === 'Demandé' || e.statut === 'En cours').length}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Admissions en cours</span><span className="font-medium text-foreground">{admList.filter((a: any) => a.statut === 'En cours').length}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Soins aujourd&apos;hui</span><span className="font-medium text-foreground">{soinList.filter((s: any) => s.date_heure?.startsWith(new Date().toISOString().split('T')[0])).length}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
