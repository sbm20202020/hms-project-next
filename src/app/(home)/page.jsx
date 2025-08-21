'use client';
import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Award,
  Stethoscope,
  Ambulance,
  Building2,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestion des Patients',
      description: 'Système complet de gestion des dossiers patients avec historique médical détaillé'
    },
    {
      icon: Calendar,
      title: 'Planification des RDV',
      description: 'Interface intuitive pour la gestion des rendez-vous et la planification des consultations'
    },
    {
      icon: FileText,
      title: 'Dossiers Médicaux',
      description: 'Stockage sécurisé et accès rapide aux dossiers médicaux électroniques'
    },
    {
      icon: Activity,
      title: 'Suivi en Temps Réel',
      description: 'Monitoring continu des activités hospitalières et des indicateurs de performance'
    },
    {
      icon: Shield,
      title: 'Sécurité Avancée',
      description: 'Protection des données patients conforme aux standards internationaux'
    },
    {
      icon: Stethoscope,
      title: 'Outils Médicaux',
      description: 'Suite complète d\'outils pour le personnel médical et paramédical'
    }
  ];

  const stats = [
    { number: '50+', label: 'Hôpitaux Partenaires' },
    { number: '10,000+', label: 'Patients Traités' },
    { number: '500+', label: 'Professionnels de Santé' },
    { number: '99.9%', label: 'Disponibilité Système' }
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Kabila',
      role: 'Directrice Médicale, Hôpital Central de Kinshasa',
      content: 'CongoHMS a révolutionné notre façon de gérer les patients. L\'interface est intuitive et les fonctionnalités répondent parfaitement à nos besoins.',
      rating: 5
    },
    {
      name: 'Jean Mukendi',
      role: 'Administrateur, Clinique Saint-Joseph',
      content: 'Grâce à CongoHMS, nous avons réduit de 60% le temps de traitement administratif et amélioré significativement la qualité des soins.',
      rating: 5
    }
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CongoHMS</h1>
                <p className="text-sm text-teal-600">Hospital Management System</p>
              </div>
            </Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Fonctionnalités</a>
              <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors">À Propos</a>
              <a href="#contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</a>
              <Link href="/auth/signin" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Se connecter
              </Link>
            </nav>
            {/* Mobile toggle button */}
            <button
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {/* Mobile dropdown */}
          <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden`}> 
            <div className="bg-white border-t border-gray-100 shadow-md">
              <div className="px-4 py-3 space-y-2">
                <a href="#features" className="block text-gray-700 hover:text-teal-600 py-2" onClick={() => setMobileOpen(false)}>Fonctionnalités</a>
                <a href="#about" className="block text-gray-700 hover:text-teal-600 py-2" onClick={() => setMobileOpen(false)}>À Propos</a>
                <a href="#contact" className="block text-gray-700 hover:text-teal-600 py-2" onClick={() => setMobileOpen(false)}>Contact</a>
                <Link href="/auth/signin" className="block bg-teal-600 text-white text-center px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors mt-2" onClick={() => setMobileOpen(false)}>
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Révolutionnez la 
                <span className="text-teal-600"> Gestion Hospitalière</span> 
                en RDC
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                CongoHMS est la solution complète de gestion hospitalière conçue spécifiquement 
                pour les établissements de santé de la République Démocratique du Congo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                  Commencer Maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg hover:bg-teal-50 transition-colors">
                  Voir la Démo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">1,247 Patients Actifs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">89 RDV Aujourd'hui</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">24 Médecins Disponibles</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Occupation des lits</span>
                      <span className="text-sm font-medium text-gray-900">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Complètes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils conçus pour optimiser la gestion hospitalière 
              et améliorer la qualité des soins en République Démocratique du Congo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi Choisir CongoHMS ?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                CongoHMS a été développé en collaboration avec des professionnels de santé congolais 
                pour répondre aux défis spécifiques du système de santé en RDC.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Interface en Français</h4>
                    <p className="text-gray-600">Conçu pour les utilisateurs francophones avec une interface intuitive</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Adapté au Contexte Local</h4>
                    <p className="text-gray-600">Prend en compte les spécificités du système de santé congolais</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Local</h4>
                    <p className="text-gray-600">Équipe de support basée en RDC pour une assistance rapide</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Building2 className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Hôpitaux</h4>
                <p className="text-gray-600">Gestion complète des établissements hospitaliers</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Ambulance className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Urgences</h4>
                <p className="text-gray-600">Module spécialisé pour les services d'urgence</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Award className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Qualité</h4>
                <p className="text-gray-600">Outils d'amélioration continue de la qualité</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Sécurité</h4>
                <p className="text-gray-600">Protection maximale des données patients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de professionnels de santé qui utilisent CongoHMS
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Prêt à Transformer Votre Hôpital ?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Contactez-nous dès aujourd'hui pour une démonstration personnalisée
            </p>
            <Link href="/auth/signup" className="bg-white text-teal-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Demander une Démo
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <Phone className="w-8 h-8 text-white mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Téléphone</h4>
              <p className="text-teal-100">+243 123 456 789</p>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 text-white mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Email</h4>
              <p className="text-teal-100">contact@congohms.cd</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-white mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Adresse</h4>
              <p className="text-teal-100">Kinshasa, République Démocratique du Congo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">CongoHMS</h3>
                  <p className="text-sm text-gray-400">Hospital Management System</p>
                </div>
              </div>
              <p className="text-gray-400">
                La solution de gestion hospitalière de référence en République Démocratique du Congo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CongoHMS. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;