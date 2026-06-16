'use client'

import { useState } from 'react';
import { Home, Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Users, Activity, Building, Briefcase, Phone, ChevronDown } from 'lucide-react';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { userAuthService } from '@/services/dossierService'
import { showToast } from 'nextjs-toast-notify';
import { showErrorNotification } from '@/utils/helpers';
import { validateSignup } from '@/lib/validation/auth'
import { SignInfos } from '@/components/signinfos';





export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organization, setOrganization] = useState('')
  const [position, setPosition] = useState('')
  const [phone, setPhone] = useState('')
  const [establishmentType, setEstablishmentType] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    position: '',
    establishmentType: '',
    phone: '',
  })

  // Évalue la force du mot de passe: 0 (faible), 1 (moyen), 2 (fort)
  const getPasswordStrength = (pwd) => {
    let score = 0
    if (!pwd) return 0
    if (pwd.length >= 8) score++
    const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^\w\s]/].reduce((acc, r) => acc + (r.test(pwd) ? 1 : 0), 0)
    if (variety >= 3) score++
    return Math.min(score, 2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setFieldErrors({
      name: '', email: '', password: '', organization: '', position: '', establishmentType: '', phone: ''
    })

    // Validation Zod partagée
    const validated = validateSignup({
      name,
      email,
      password,
      organization,
      position,
      establishmentType,
      phone,
      isDemoRequest: true,
    })
    if (!validated.success) {
      const errs = validated.errors || {}
      setFieldErrors(prev => ({
        ...prev,
        name: errs.name || '',
        email: errs.email || '',
        password: errs.password || '',
        organization: errs.organization || '',
        position: errs.position || '',
        establishmentType: errs.establishmentType || '',
        phone: errs.phone || '',
      }))
      setIsLoading(false)
      return
    }

    try {
      
      const response = await userAuthService.create({
        email,
        password,
        name,
        organization,
        position,
        telephone: phone,
        establishmentType,
        isDemoRequest: true
      })

      console.log(response)

      if (response.ok) {
        router.push('/auth/signin?message=Compte créé avec succès')
      } else {
        
        showErrorNotification(response.error || 'Une erreur est survenue')
      }
    } catch (error) {
      showErrorNotification('Une erreur est survenue lors de la création du compte')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-50 to-white flex">
      <Link
        href="/"
        className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-md text-teal-700 bg-white shadow hover:bg-teal-50 border border-teal-100"
      >
        <Home className="w-4 h-4 mr-2" />
        {/* Accueil */}
      </Link>

      {/* Section gauche - Formulaire de création de compte */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-5 lg:px-7 py-8 lg:py-10">
        <div className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
          {/* Logo et titre */}
          <div className="text-center mt-0">
            <Link href="/" className="inline-flex items-center space-x-3 mb-4 sm:mb-5">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CongoHMS</h1>
                <p className="text-xs sm:text-sm text-teal-600">Hospital Management System</p>
              </div>
            </Link>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug tracking-tight mb-0 max-w-sm mx-auto">
              Demande d'accès démo
            </h2>
            <p className="text-gray-600 text-[13px] sm:text-sm leading-snug max-w-sm mx-auto">
              Testez CongoHMS gratuitement avec un accès démo complet
            </p>
          </div>

          {/* Formulaire */}
          <form className="mt-3 sm:mt-4 space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              {/* Première ligne - Nom et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full h-11 sm:h-12 pl-10 pr-3 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Ex: Jean Ngandu"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      title="Veuillez saisir une adresse email valide"
                      aria-invalid={fieldErrors.email ? 'true' : 'false'}
                      aria-describedby={fieldErrors.email ? 'email-error' : 'email-help'}
                      required
                      value={email}
                      onChange={(e) => {
                        const v = e.target.value
                        setEmail(v)
                        if (fieldErrors.email) {
                          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
                          if (ok) setFieldErrors(prev => ({ ...prev, email: '' }))
                        }
                      }}
                      className="block w-full h-11 sm:h-12 pl-10 pr-3 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="exemple@domaine.com"
                    />
                  </div>
                  {fieldErrors.email ? (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {fieldErrors.email}
                    </p>
                  ) : (
                    <p id="email-help" className="mt-1 text-xs text-gray-500">
                      Utilisez votre email professionnel.
                    </p>
                  )}
                </div>
              </div>

              {/* Deuxième ligne - Organisation et Poste */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Organisation */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organisation / Hôpital
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="block w-full h-11 sm:h-12 pl-10 pr-3 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Ex: Hôpital Central de Kinshasa"
                    />
                  </div>
                </div>

                {/* Poste */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Poste / Fonction
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      autoComplete="organization-title"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="block w-full h-11 sm:h-12 pl-10 pr-3 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Ex: Médecin Chef, Administrateur, Infirmier"
                    />
                  </div>
                </div>
              </div>

              {/* Troisième ligne - Téléphone et Type d'établissement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern="\+?[0-9\s-]{7,15}"
                      title="Numéro de 7 à 15 chiffres, espaces ou tirets, option + au début"
                      aria-invalid={fieldErrors.phone ? 'true' : 'false'}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                      required
                      value={phone}
                      onChange={(e) => {
                        const v = e.target.value
                        setPhone(v)
                        if (fieldErrors.phone) {
                          const ok = /^\+?[0-9\s\-]{7,15}$/.test(v.trim())
                          if (ok) setFieldErrors({ phone: '' })
                        }
                      }}
                      className="block w-full h-11 sm:h-12 pl-10 pr-3 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Ex: +243 900 000 000"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Type d'établissement */}
                <div>
                  <label htmlFor="establishmentType" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Type d'établissement
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="establishmentType"
                      name="establishmentType"
                      required
                      value={establishmentType}
                      onChange={(e) => setEstablishmentType(e.target.value)}
                      className="block w-full h-11 sm:h-12 appearance-none pl-10 pr-10 border border-gray-300 rounded-md bg-white text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-900"
                    >
                      <option value="">Sélectionnez le type d'établissement</option>
                      <option value="hopital-public">Hôpital public</option>
                      <option value="hopital-prive">Hôpital privé</option>
                      <option value="clinique">Clinique</option>
                      <option value="centre-sante">Centre de santé</option>
                      <option value="dispensaire">Dispensaire</option>
                      <option value="autre">Autre</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mot de passe - pleine largeur */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full h-11 sm:h-12 pl-10 pr-12 border border-gray-300 rounded-md bg-white placeholder-gray-400 text-[16px] sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Au moins 8 caractères"
                    aria-describedby={password && password.length > 0 ? 'password-help' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {password && password.length > 0 && (
                  <>
                    <p id="password-help" className="mt-1 text-xs text-gray-500">
                      Au moins 8 caractères. Ajoutez chiffres et symboles pour plus de sécurité.
                    </p>
                    {/* Indicateur de force du mot de passe */}
                    <div className="mt-2" aria-live="polite">
                      {(() => {
                        const level = getPasswordStrength(password)
                        const labels = ['Faible', 'Moyen', 'Fort']
                        const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-600']
                        return (
                          <div>
                            <div className="h-1.5 w-full bg-gray-200 rounded">
                              <div className={`h-1.5 rounded ${colors[level]}`} style={{ width: `${(level + 1) * 33.33}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-gray-600">Force du mot de passe: {labels[level]}</p>
                          </div>
                        )
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bouton de création de compte */}
            <div className="mt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 sm:py-3.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Traitement de votre demande...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Demander l'accès démo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>

            {/* Lien de connexion */}
            <div className="text-center mt-1">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link href="signin" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 text-teal-600 mr-2" />
              Inscription sécurisée avec chiffrement SSL
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Informations et statistiques */}
        <SignInfos />
    </div>
  );
}