import DashboardLayout from "../../../../components/dashboard-layout"
import BillingForm from "../../../../components/billing-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../../../components/ui/button"

export default function NewBillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/billing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouvelle Facture</h1>
            <p className="text-muted-foreground">Créer une nouvelle facture patient</p>
          </div>
        </div>

        {/* Billing Form */}
        <BillingForm />
      </div>
    </DashboardLayout>
  )
}
