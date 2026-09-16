import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Syringe,
  FlaskConical,
  ScanLine,
  Pill,
  BedDouble,
  Receipt,
  TrendingUp,
  CalendarDays,
  FileText,
  Settings,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Réception',
    href: '/reception',
    icon: ClipboardList,
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
  },
  {
    title: 'Consultations',
    href: '/consultations',
    icon: Stethoscope,
  },
  {
    title: 'Infirmerie',
    href: '/infirmerie',
    icon: Syringe,
  },
  {
    title: 'Laboratoire',
    href: '/laboratoire',
    icon: FlaskConical,
  },
  {
    title: 'Imagerie',
    href: '/imagerie',
    icon: ScanLine,
  },
  {
    title: 'Pharmacie',
    href: '/pharmacie',
    icon: Pill,
  },
  {
    title: 'Hospitalisation',
    href: '/hospitalisation',
    icon: BedDouble,
  },
  {
    title: 'Facturation',
    href: '/facturation',
    icon: Receipt,
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: TrendingUp,
  },
  {
    title: 'Rendez-vous',
    href: '/rdv',
    icon: CalendarDays,
  },
  {
    title: 'Rapports',
    href: '/rapports',
    icon: FileText,
  },
  {
    title: 'Paramètres',
    href: '/parametres',
    icon: Settings,
  },
]
