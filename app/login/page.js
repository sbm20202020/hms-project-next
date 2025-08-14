"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        let userData = null

        // Admin account
        if (email === "admin@hospital.com" && password === "admin123") {
          userData = {
            id: 1,
            name: "Dr. Admin",
            email: email,
            role: "admin",
            roleDisplay: "Administrateur",
            avatar: "AD",
          }
          
        }
        // Doctor account
        else if (email === "doctor@hospital.com" && password === "doctor123") {
          userData = {
            id: 2,
            name: "Dr. Martin",
            email: email,
            role: "doctor",
            roleDisplay: "Médecin",
            avatar: "DM",
          }
        }
        // Cashier account
        else if (email === "caissier@hospital.com" && password === "caissier123") {
          userData = {
            id: 3,
            name: "Marie Dubois",
            email: email,
            role: "cashier",
            roleDisplay: "Caissier",
            avatar: "MD",
          }
        }
        // Nurse account
        else if (email === "infirmier@hospital.com" && password === "infirmier123") {
          userData = {
            id: 4,
            name: "Sophie Laurent",
            email: email,
            role: "nurse",
            roleDisplay: "Infirmier",
            avatar: "SL",
          }
        }
        // Finance account
        else if (email === "financier@hospital.com" && password === "financier123") {
          userData = {
            id: 5,
            name: "Pierre Moreau",
            email: email,
            role: "finance",
            roleDisplay: "Financier",
            avatar: "PM",
          }
        }

        if (userData) {
          login(userData)
          router.push("/")
        }
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">HMS Login</CardTitle>
          <CardDescription>Connectez-vous à votre compte pour accéder au système hospitalier</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          {/* <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Comptes de démonstration :</p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium">Admin:</span> admin@hospital.com | admin123
              </p>
              <p>
                <span className="font-medium">Médecin:</span> doctor@hospital.com | doctor123
              </p>
              <p>
                <span className="font-medium">Caissier:</span> caissier@hospital.com | caissier123
              </p>
              <p>
                <span className="font-medium">Infirmier:</span> infirmier@hospital.com | infirmier123
              </p>
              <p>
                <span className="font-medium">Financier:</span> financier@hospital.com | financier123
              </p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
