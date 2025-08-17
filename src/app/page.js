"use client"
import DashboardLayout from "../components/dashboard-layout"
import StatsCards from "../components/stats-cards"
import RecentActivity from "../components/recent-activity"
import QuickActions from "../components/quick-actions"
import { useState } from "react"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
            <p className="text-muted-foreground">Vue d'ensemble de l'hôpital</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Stats Cards */}

        <StatsCards/>

        {/* Main Content Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  )
}
