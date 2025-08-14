import DashboardLayout from "../../../components/dashboard-layout"
import BillingDetails from "../../../components/billing-details"
import { ArrowLeft, Edit, Download } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function BillingDetailsPage({ params }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/billing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails de la Facture</h1>
              <p className="text-muted-foreground">Informations complètes de facturation</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <a href={`/billing/${params.id}/download`}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </a>
            </Button>
            <Button asChild>
              <a href={`/billing/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </a>
            </Button>
          </div>
        </div>

        {/* Billing Details */}
        <BillingDetails billingId={params.id} />
      </div>
    </DashboardLayout>
  )
}
