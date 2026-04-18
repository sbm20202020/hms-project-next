import DashboardLayout from "../../../components/dashboard-layout"
import BillingStats from "../../../components/billing-stats"
import BillingList from "../../../components/billing-list"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Système de Facturation</h1>
            <p className="text-muted-foreground">Gérer les factures et les paiements</p>
          </div>
          <Button asChild>
            <a href="/billing/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Facture
            </a>
          </Button>
        </div>

        {/* Billing Statistics */}
        <BillingStats />

        {/* Billing List */}
        <BillingList />
      </div>
    </DashboardLayout>
  )
}
