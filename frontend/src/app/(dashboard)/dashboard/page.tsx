'use client'

import { useSession } from 'next-auth/react'
import { usePatientsCount } from '@/hooks/use-patients'
import { useFinanceDashboard } from '@/hooks/use-finance'
import { useTickets } from '@/hooks/use-tickets'
import { useRendezVous } from '@/hooks/use-rdv'
import { useConsultations } from '@/hooks/use-consultations'
import { useAdmissions } from '@/hooks/use-hospitalisation'
import Link from 'next/link'
import {
  Users, Calendar, FileText, DollarSign, TrendingUp, TrendingDown,
  Bed, Pill, Activity, ClipboardList, Loader2, ArrowRight,
  Stethoscope, Receipt, AlertCircle,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

const quickActions = [
  { label: 'Nouveau patient', href: '/patients', icon: Users, color: 'bg-blue-500/10 text-blue-500' },
  { label: 'Nouveau RDV', href: '/rdv', icon: Calendar, color: 'bg-emerald-500/10 text-emerald-500' },
  { label: 'Hospitalisation', href: '/hospitalisation', icon: Bed, color: 'bg-violet-500/10 text-violet-500' },
  { label: 'Pharmacie', href: '/pharmacie', icon: Pill, color: 'bg-amber-500/10 text-amber-500' },
  { label: 'Réception', href: '/reception', icon: ClipboardList, color: 'bg-rose-500/10 text-rose-500' },
  { label: 'Consultations', href: '/consultations', icon: Stethoscope, color: 'bg-cyan-500/10 text-cyan-500' },
]

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: patientsCount, isLoading: loadingPatients } = usePatientsCount()
  const { data: finance, isLoading: loadingFinance } = useFinanceDashboard()
  const { data: tickets = [] } = useTickets()
  const { data: rdvs = [] } = useRendezVous()
  const { data: consultations = [] } = useConsultations()
  const { data: admissions = [] } = useAdmissions()

  const activeAdmissions = Array.isArray(admissions)
    ? admissions.filter((a: any) => !a.date_sortie).length
    : 0

  const pendingTickets = Array.isArray(tickets)
    ? tickets.filter((t: any) => t.statut === 'En attente').length
    : 0

  const todayRdvs = Array.isArray(rdvs)
    ? rdvs.filter((r: any) => {
        const d = new Date(r.date_heure || r.date)
        const today = new Date()
        return d.toDateString() === today.toDateString()
      }).length
    : 0

  const financeChartData = finance
    ? [
        { name: 'Revenus', value: finance.totalRevenus, fill: '#10b981' },
        { name: 'Dépenses', value: finance.totalDepenses, fill: '#ef4444' },
        { name: 'En attente', value: finance.enAttente, fill: '#f59e0b' },
      ]
    : []

  const ticketsByStatus = Array.isArray(tickets)
    ? Object.entries(
        tickets.reduce((acc: Record<string, number>, t: any) => {
          acc[t.statut || 'Inconnu'] = (acc[t.statut || 'Inconnu'] || 0) + 1
          return acc
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : []

  const stats = [
    { label: 'Patients', value: loadingPatients ? '...' : fmt(patientsCount?.count ?? 0), icon: Users, color: 'text-blue-500 bg-blue-500/10', href: '/patients' },
    { label: 'RDV aujourd\'hui', value: String(todayRdvs), icon: Calendar, color: 'text-emerald-500 bg-emerald-500/10', href: '/rdv' },
    { label: 'Tickets en attente', value: String(pendingTickets), icon: ClipboardList, color: 'text-amber-500 bg-amber-500/10', href: '/reception' },
    { label: 'Hospitalisés', value: String(activeAdmissions), icon: Bed, color: 'text-violet-500 bg-violet-500/10', href: '/hospitalisation' },
  ]

  const financeStats = [
    { label: 'Revenus du mois', value: loadingFinance ? '...' : `${fmt(finance?.totalRevenus ?? 0)} FC`, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Dépenses du mois', value: loadingFinance ? '...' : `${fmt(finance?.totalDepenses ?? 0)} FC`, icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { label: 'Bénéfice net', value: loadingFinance ? '...' : `${fmt(finance?.beneficeNet ?? 0)} FC`, icon: DollarSign, color: (finance?.beneficeNet ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500', bgColor: (finance?.beneficeNet ?? 0) >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10' },
    { label: 'Factures en attente', value: loadingFinance ? '...' : `${fmt(finance?.enAttente ?? 0)} FC`, icon: AlertCircle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour, {session?.user?.email?.split('@')[0] || 'Utilisateur'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Voici un aperçu de l&apos;activité de votre établissement</p>
      </div>

      {/* Main stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            <div className="mt-2 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Voir détails <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Finance stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`mt-2 text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Finance du mois</h2>
          {loadingFinance ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : financeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={financeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${fmt(value)} FC`, '']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {financeChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Aucune donnée financière</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tickets par statut</h2>
          {ticketsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={ticketsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {ticketsByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              <div className="text-center">
                <ClipboardList className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p>Aucun ticket</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2.5 rounded-lg border border-border p-4 text-center hover:bg-muted hover:border-primary/30 transition-all">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent consultations + RDV */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Dernières consultations</h2>
            <Link href="/consultations" className="text-xs text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {Array.isArray(consultations) && consultations.length > 0 ? (
              consultations.slice(0, 5).map((c: any) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                    <Stethoscope className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{c.motif || 'Consultation'}</p>
                    <p className="text-xs text-muted-foreground">{c.date_consultation ? new Date(c.date_consultation).toLocaleDateString('fr-FR') : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.statut === 'Terminée' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {c.statut || 'En cours'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune consultation récente</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Rendez-vous à venir</h2>
            <Link href="/rdv" className="text-xs text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {Array.isArray(rdvs) && rdvs.length > 0 ? (
              rdvs.slice(0, 5).map((r: any) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{r.motif || 'Rendez-vous'}</p>
                    <p className="text-xs text-muted-foreground">{r.date_heure ? new Date(r.date_heure).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.statut === 'Confirmé' ? 'bg-emerald-500/10 text-emerald-600' : r.statut === 'Annulé' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                    {r.statut || 'Planifié'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucun rendez-vous</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
