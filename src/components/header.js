"use client"

import { Menu, Bell, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Header({ setSidebarOpen }) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-64 lg:w-80 border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-accent/10 hover:text-accent transition-colors duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></span>
          </Button>
        </div>
      </div>
    </header>
  )
}
