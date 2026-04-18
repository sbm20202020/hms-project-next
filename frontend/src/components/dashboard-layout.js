"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="lg:ml-72 transition-all duration-300">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
