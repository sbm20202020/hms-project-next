'use client';

import { useEffect, useState, Suspense } from 'react';
import { Home, Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Users, Activity } from 'lucide-react';
import { signIn } from 'next-auth/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link';
import { showErrorNotification, showSuccessNotification } from '@/utils/helpers';
import React from 'react'
const LoginPage = ({searchParams}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // const searchParams = useSearchParams()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const message = params.get('message')
    
    if (message) {
      showSuccessNotification(message)
    
      // Remplace la valeur du paramètre 'message' par une nouvelle valeur
      params.set('message', '') // <- ici tu mets la valeur que tu veux
      params.delete("message")
      router.replace(`?${params.toString()}`)
    }
    // const message = searchParams.get('message',null)
    // if (message) {
    //   showSuccessNotification(message)
    //   const params = new URLSearchParams(searchParams.toString())
    //   params.delete("message") // supprime le paramètre
    //   router.replace(`?${params.toString()}`)
    // }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if(result.error === "CredentialsSignin" || result.status === 401){
        showErrorNotification("Email ou mot de passe incorrect...")
      }else{
        showErrorNotification("Une erreur est survenue lors de la connexion")
      }
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
      <div className="relative min-h-screen bg-gradient-to-br from-teal-50 to-white flex">
        <Link
          href="/"
          className="absolute top-4 left-4 z-20 inline-flex items-center px-3 py-1.5 rounded-md text-teal-700 bg-white shadow hover:bg-teal-50 border border-teal-100"
        >
          <Home className="w-4 h-4 mr-2" />
          Accueil
        </Link>
        {/* Section gauche - Formulaire de connexion */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Logo et titre */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-600 rounded-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">CongoHMS</h1>
                  <p className="text-sm text-teal-600">Hospital Management System</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bon retour !
              </h2>
              <p className="text-gray-600">
                Connectez-vous à votre compte pour accéder au système
              </p>
            </div>

            {/* Formulaire */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="••••••••"
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
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-teal-600 hover:text-teal-700 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Se connecter
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>

              {/* Lien d'inscription */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    Demander un accès
                  </Link>
                </p>
              </div>
            </form>

            {/* Informations de sécurité */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 text-teal-600 mr-2" />
                Connexion sécurisée avec chiffrement SSL
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Informations et statistiques */}
        <div className="hidden lg:flex lg:flex-1 bg-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700"></div>
          
          {/* Motif décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-6">
                Gérez votre hôpital avec efficacité
              </h3>
              <p className="text-teal-100 text-lg mb-8 leading-relaxed">
                CongoHMS vous permet de centraliser la gestion de votre établissement 
                de santé avec des outils modernes et sécurisés.
              </p>

              {/* Statistiques */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-teal-100">Patients traités</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-teal-100">Disponibilité système</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-teal-100">Données sécurisées</div>
                  </div>
                </div>
              </div>

              {/* Témoignage */}
              <div className="mt-12 p-6 bg-gray-10 bg-opacity-10 rounded-lg backdrop-blur-sm">
                <p className="text-teal-100 italic mb-4">
                  "CongoHMS a transformé notre façon de travailler. L'interface est intuitive 
                  et nos équipes ont rapidement adopté le système."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">DM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Marie Kabila</div>
                    <div className="text-teal-200 text-sm">Hôpital Central de Kinshasa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};


export default LoginPage;