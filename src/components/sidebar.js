"use client"

import {
  Home,
  Users,
  UserCheck,
  Calendar,
  Bed,
  CreditCard,
  Settings,
  Activity,
  FileText,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Stethoscope,
  TestTube,
  Scan,
  Clock,
  Receipt,
  TrendingUp,
  BarChart3,
  PieChart,
  Building2,
  UserX,
  ArrowRightLeft,
  ClipboardList,
} from "lucide-react"
import { Button } from "./ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

import { signIn, signOut, useSession } from "next-auth/react";

const getNavigationByRole = (role) => {
  const baseNavigation = [{ name: "Tableau de Bord", href: "/", icon: Home }]

  switch (role) {
    case "admin":
      return [
        ...baseNavigation,
        {
          name: "Parcours Patient",
          icon: Activity,
          children: [
            { name: "Réception", href: "/reception", icon: UserPlus },
            { name: "File d'attente", href: "/file-attente", icon: Clock },
            { name: "Caisse", href: "/caisse", icon: Receipt },
            { name: "Infirmerie", href: "/infirmerie", icon: Stethoscope },
          ],
        },
        {
          name: "Gestion Médicale",
          icon: Users,
          children: [
            { name: "Patients", href: "/dashboard/patients", icon: Users },
            { name: "Médecins", href: "/doctors", icon: UserCheck },
            { name: "Rendez-vous", href: "/appointments", icon: Calendar },
          ],
        },
        {
          name: "Hospitalisation",
          icon: Building2,
          children: [
            { name: "Admissions", href: "/hospitalisation/admissions", icon: UserPlus },
            { name: "Patients Hospitalisés", href: "/hospitalisation/patients", icon: Bed },
            { name: "Sorties", href: "/hospitalisation/sorties", icon: UserX },
            { name: "Transferts", href: "/hospitalisation/transferts", icon: ArrowRightLeft },
            { name: "Suivi Médical", href: "/hospitalisation/suivi", icon: ClipboardList },
          ],
        },
        {
          name: "Services Médicaux",
          icon: TestTube,
          children: [
            { name: "Laboratoire", href: "/laboratoire", icon: TestTube },
            { name: "Imagerie", href: "/imagerie", icon: Scan },
            { name: "Consultations", href: "/consultations", icon: Stethoscope },
          ],
        },
        {
          name: "Finance & Comptabilité",
          icon: TrendingUp,
          children: [
            { name: "Tableau de Bord Financier", href: "/finance", icon: BarChart3 },
            { name: "Analyse des Revenus", href: "/finance/revenus", icon: PieChart },
            { name: "Gestion des Dépenses", href: "/finance/depenses", icon: CreditCard },
            { name: "Rapports Financiers", href: "/finance/rapports", icon: FileText },
          ],
        },
        {
          name: "Administration",
          icon: Settings,
          children: [
            { name: "Chambres", href: "/rooms", icon: Bed },
            { name: "Facturation", href: "/billing", icon: CreditCard },
            { name: "Rapports", href: "/rapports", icon: FileText },
            {
              name: "Paramètres",
              icon: Settings,
              children: [
                { name: "Général", href: "/parametres", icon: Settings },
                { name: "Utilisateurs", href: "/parametres/utilisateurs", icon: Users },
                { name: "Rôles", href: "/parametres/roles", icon: UserCheck },
                { name: "Permissions", href: "/parametres/permissions", icon: Settings },
              ],
            },
          ],
        },
      ]

    case "doctor":
      return [
        ...baseNavigation,
        { name: "Mes Patients", href: "/dashboard/patients", icon: Users },
        { name: "Consultations", href: "/consultations", icon: Stethoscope },
        { name: "Prescriptions", href: "/prescriptions", icon: FileText },
        { name: "Examens", href: "/examens", icon: TestTube },
        {
          name: "Hospitalisation",
          icon: Building2,
          children: [
            { name: "Patients Hospitalisés", href: "/hospitalisation/patients", icon: Bed },
            { name: "Suivi Médical", href: "/hospitalisation/suivi", icon: ClipboardList },
          ],
        },
      ]

    case "cashier":
      return [
        ...baseNavigation,
        { name: "Caisse", href: "/caisse", icon: Receipt },
        { name: "Facturation", href: "/billing", icon: CreditCard },
        { name: "Paiements", href: "/paiements", icon: CreditCard },
        {
          name: "Rapports",
          icon: FileText,
          children: [
            { name: "Recettes Journalières", href: "/rapports/recettes", icon: BarChart3 },
            { name: "Factures Impayées", href: "/rapports/impayes", icon: FileText },
          ],
        },
      ]

    case "nurse":
      return [
        ...baseNavigation,
        { name: "Infirmerie", href: "/infirmerie", icon: Stethoscope },
        { name: "Patients", href: "/dashboard/patients", icon: Users },
        { name: "Soins", href: "/soins", icon: Activity },
        {
          name: "Hospitalisation",
          icon: Building2,
          children: [
            { name: "Patients Hospitalisés", href: "/hospitalisation/patients", icon: Bed },
            { name: "Suivi Médical", href: "/hospitalisation/suivi", icon: ClipboardList },
          ],
        },
      ]

    case "finance":
      return [
        ...baseNavigation,
        {
          name: "Finance & Comptabilité",
          icon: TrendingUp,
          children: [
            { name: "Tableau de Bord Financier", href: "/finance", icon: BarChart3 },
            { name: "Analyse des Revenus", href: "/finance/revenus", icon: PieChart },
            { name: "Gestion des Dépenses", href: "/finance/depenses", icon: CreditCard },
            { name: "Rapports Financiers", href: "/finance/rapports", icon: FileText },
          ],
        },
        { name: "Facturation", href: "/billing", icon: CreditCard },
        { name: "Budget", href: "/budget", icon: PieChart },
        { name: "Comptabilité", href: "/comptabilite", icon: BarChart3 },
      ]

    default:
      return baseNavigation
  }
}

export default function Sidebar({ open, setOpen }) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState({})
  // Default to admin role since auth is removed
  // const { data: session } = useSession();

  // console.log(session);
  // const user = { role: "admin", name: "Utilisateur", roleDisplay: "Administrateur", avatar: "U" }
  // const user = { role: "admin", name: session, roleDisplay: "Administrateur", avatar: "U" }\
  const { data: session } = useSession();
  const user = { role: "admin", name: session?.user?.name, roleDisplay: "Administrateur", avatar: "U" }

  const navigation = useMemo(() => getNavigationByRole("admin"), [])

  // Auto-expand sections that contain the current route
  useEffect(() => {
    if (!pathname) return

    const expanded = {}

    const visit = (items, parents = []) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          visit(item.children, [...parents, item.name])
        } else if (item.href && pathname.startsWith(item.href)) {
          parents.forEach((name) => {
            expanded[name] = true
          })
        }
      })
    }

    visit(navigation)
    setExpandedSections((prev) => {
      const merged = { ...prev, ...expanded }
      const prevKeys = Object.keys(prev)
      const mergedKeys = Object.keys(merged)
      const isSame =
        prevKeys.length === mergedKeys.length && mergedKeys.every((key) => merged[key] === prev[key])
      return isSame ? prev : merged
    })
  }, [pathname, navigation])

  const handleLogout = () => {
    // Logout functionality removed - no action needed
    signOut()
  }

  const isActive = (href) => {
    if (!pathname) return false

    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }))
  }

  const renderNavItem = (item, level = 0) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections[item.name]

    if (hasChildren) {
      return (
        <div key={item.name} className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-between h-12 px-4 rounded-xl font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 ${
              level > 0 ? "ml-4" : ""
            }`}
            onClick={() => toggleSection(item.name)}
          >
            <div className="flex items-center">
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {isExpanded && (
            <div className={`${level === 0 ? "ml-4" : "ml-8"} space-y-1 border-l-2 border-sidebar-border pl-4`}>
              {item.children.map((child) => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    if (!item.href) {
      return null
    }

    const ChildIcon = item.icon
    const childActive = isActive(item.href)

    return (
      <Button
        key={item.name}
        variant={childActive ? "default" : "ghost"}
        className={`
          w-full justify-start h-10 px-3 rounded-lg font-medium transition-all duration-200
          ${level > 0 ? "ml-4" : ""}
          ${
            childActive
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }
        `}
        asChild
        onClick={() => {
          // Close only on small screens where the sidebar overlays content
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setOpen(false)
          }
        }}
      >
        <Link href={item.href}>
          <ChildIcon className="mr-3 h-4 w-4" />
          {item.name}
        </Link>
      </Button>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border shadow-xl transform transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-sidebar-border bg-gradient-to-r from-primary to-primary/90">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-white font-display">HMS</span>
              <p className="text-xs text-white/80 font-medium">Centre Médical</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => renderNavItem(item))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center p-3 rounded-xl bg-sidebar hover:bg-sidebar-accent transition-colors duration-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-white font-bold font-display">{user?.avatar || "U"}</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-sidebar-foreground font-display">
                  {user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-muted-foreground">{user?.roleDisplay || "Utilisateur"}</p>
              </div>
            </div>

            {/* Profile and logout buttons */}
            <div className="flex space-x-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start h-10 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                asChild
              >
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex-1 justify-start h-10 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
