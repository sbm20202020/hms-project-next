import { Activity, Shield, Users, CheckCircle2 } from "lucide-react";

export function SignInfos() {
  return (
    <aside className="hidden lg:flex lg:flex-1 bg-teal-600 relative overflow-hidden" role="complementary" aria-label="Informations CongoHMS">
      {/* Fond dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700" aria-hidden="true"></div>

      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12 text-white">
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          <h3 className="text-3xl xl:text-4xl font-bold tracking-tight mb-4">
            Gérez votre hôpital avec efficacité
          </h3>
          <p className="text-teal-100 text-base xl:text-lg mb-8 leading-relaxed">
            CongoHMS vous permet de centraliser la gestion de votre établissement
            de santé avec des outils modernes et sécurisés.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Colonne gauche: Statistiques + Fonctionnalités */}
            <div>
              {/* Statistiques */}
              <div className="grid grid-cols-1 gap-4">
                <div className="pl-2 flex items-center gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition transform hover:translate-x-0.5">
                  <div className="w-12 h-12 shrink-0 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="py-3">
                    <div className="text-2xl font-bold leading-none">10,000+</div>
                    <div className="text-teal-100 text-sm">Patients traités</div>
                  </div>
                </div>

                <div className="pl-2 flex items-center gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition transform hover:translate-x-0.5">
                  <div className="w-12 h-12 shrink-0 bg-white/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="py-3">
                    <div className="text-2xl font-bold leading-none">99.9%</div>
                    <div className="text-teal-100 text-sm">Disponibilité système</div>
                  </div>
                </div>

                <div className="pl-2 flex items-center gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition transform hover:translate-x-0.5">
                  <div className="w-12 h-12 shrink-0 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="py-3">
                    <div className="text-2xl font-bold leading-none">100%</div>
                    <div className="text-teal-100 text-sm">Données sécurisées</div>
                  </div>
                </div>
              </div>

              {/* Fonctionnalités clés */}
              <div className="mt-6 space-y-3" aria-label="Fonctionnalités clés">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white/90 mt-0.5" />
                  <div>
                    <div className="font-medium leading-tight">Dossiers patients complets</div>
                    <p className="text-teal-100 text-sm">Antécédents, prescriptions et imagerie centralisés.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white/90 mt-0.5" />
                  <div>
                    <div className="font-medium leading-tight">Planification simplifiée</div>
                    <p className="text-teal-100 text-sm">Rendez-vous et ressources optimisés en temps réel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white/90 mt-0.5" />
                  <div>
                    <div className="font-medium leading-tight">Sécurité de niveau clinique</div>
                    <p className="text-teal-100 text-sm">Chiffrement des données et journalisation des accès.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite: Témoignage */}
            <div>
              <figure className="p-6 rounded-lg bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
                <blockquote className="text-teal-100 italic leading-relaxed">
                  « CongoHMS a transformé notre façon de travailler. L'interface est intuitive
                  et nos équipes ont rapidement adopté le système. »
                </blockquote>
                <figcaption className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Merdie Mulebo</div>
                    <div className="text-teal-200 text-sm">Hôpital du Cinquantenaire</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}