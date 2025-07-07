import { Metadata } from "next"
import { Video, Calendar, Users, Clock, Play, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Webinaires cybersécurité | Formations en ligne Cyna",
  description: "Participez aux webinaires cybersécurité Cyna. Formations en ligne gratuites, conférences experts, actualités sécurité et bonnes pratiques.",
}

/**
 * Page webinaires - Formations et événements en ligne
 * Présentation des webinaires passés et à venir
 */
export default function WebinarsPage() {
  // Webinaires à venir
  const upcomingWebinars = [
    {
      title: "Les menaces cyber 2025 : anticiper pour mieux protéger",
      date: "2025-01-15",
      time: "14:00 - 15:00",
      speaker: "Marie Dubois",
      speakerTitle: "Directrice Technique, Cyna",
      description: "Découvrez les nouvelles menaces cybersécurité prévues pour 2025 et les stratégies de protection adaptées.",
      topics: [
        "Évolution du paysage des menaces",
        "IA et cybersécurité offensive",
        "Nouvelles vulnérabilités IoT",
        "Stratégies de défense adaptées"
      ],
      level: "Intermédiaire",
      duration: "60 min",
      registrations: 142,
      maxParticipants: 500,
      featured: true,
      tag: "Prochainement"
    },
    {
      title: "RGPD et cybersécurité : conformité en 2025",
      date: "2025-01-22",
      time: "11:00 - 12:00",
      speaker: "Léa Rodriguez",
      speakerTitle: "Consultante RSSI, Cyna",
      description: "Mise à jour sur les exigences RGPD et impact sur votre stratégie cybersécurité.",
      topics: [
        "Évolutions réglementaires 2024-2025",
        "Obligations de sécurité renforcées",
        "Audit de conformité",
        "Cas pratiques sectoriels"
      ],
      level: "Débutant",
      duration: "60 min",
      registrations: 87,
      maxParticipants: 300,
      featured: false,
      tag: "Inscription ouverte"
    }
  ]

  // Webinaires passés (replays disponibles)
  const pastWebinars = [
    {
      title: "SOC pour PME : retour d'expérience et bonnes pratiques",
      date: "2024-12-10",
      speaker: "Thomas Leroy",
      speakerTitle: "Responsable SOC, Cyna",
      description: "Comment mettre en place un SOC efficace dans une PME avec des ressources limitées.",
      duration: "45 min",
      views: 1240,
      rating: 4.8,
      category: "SOC",
      thumbnail: "/webinars/soc-pme.jpg",
      hasReplay: true
    },
    {
      title: "Tests d'intrusion : méthodologie et outils 2024",
      date: "2024-11-28",
      speaker: "Sarah Chen",
      speakerTitle: "Experte Pentest, Cyna",
      description: "Découvrez les dernières méthodologies de tests d'intrusion et les outils incontournables.",
      duration: "55 min",
      views: 980,
      rating: 4.9,
      category: "Pentest",
      thumbnail: "/webinars/pentest-2024.jpg",
      hasReplay: true
    },
    {
      title: "Sensibilisation phishing : former ses équipes efficacement",
      date: "2024-11-15",
      speaker: "Antoine Moreau",
      speakerTitle: "Architecte Sécurité, Cyna",
      description: "Stratégies et outils pour sensibiliser vos collaborateurs aux risques de phishing.",
      duration: "40 min",
      views: 1560,
      rating: 4.7,
      category: "Formation",
      thumbnail: "/webinars/phishing-training.jpg",
      hasReplay: true
    },
    {
      title: "Incident de sécurité : gestion de crise et communication",
      date: "2024-10-25",
      speaker: "Jean-Pierre Martin",
      speakerTitle: "Directeur Général, Cyna",
      description: "Comment gérer efficacement un incident de sécurité et communiquer en situation de crise.",
      duration: "50 min",
      views: 2100,
      rating: 4.9,
      category: "Gestion de crise",
      thumbnail: "/webinars/incident-response.jpg",
      hasReplay: true
    }
  ]

  // Statistiques
  const stats = [
    {
      value: "25+",
      label: "Webinaires organisés",
      description: "Depuis le lancement du programme"
    },
    {
      value: "5,000+",
      label: "Participants formés",
      description: "Professionnels sensibilisés"
    },
    {
      value: "4.8/5",
      label: "Note moyenne",
      description: "Satisfaction des participants"
    },
    {
      value: "100%",
      label: "Gratuits",
      description: "Tous nos webinaires sont gratuits"
    }
  ]

  // Thématiques populaires
  const popularTopics = [
    { name: "SOC & Monitoring", count: 8, color: "bg-blue-500" },
    { name: "Tests d'intrusion", count: 6, color: "bg-red-500" },
    { name: "Formation équipes", count: 7, color: "bg-green-500" },
    { name: "Conformité RGPD", count: 4, color: "bg-purple-500" },
    { name: "Gestion de crise", count: 3, color: "bg-orange-500" },
    { name: "Nouvelles menaces", count: 5, color: "bg-pink-500" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
              <Video className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Webinaires</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Formations cybersécurité
              <span className="block text-[#A67FFB]">en ligne</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Participez à nos webinaires gratuits animés par nos experts. 
              Restez à la pointe de la cybersécurité avec des formations pratiques et accessibles.
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#A67FFB] mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-[#161A22] mb-2">
                  {stat.label}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webinaires à venir */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Prochains webinaires
            </h2>
            <p className="text-xl text-gray-600">
              Inscrivez-vous dès maintenant à nos formations à venir
            </p>
          </div>
          
          <div className="space-y-8">
            {upcomingWebinars.map((webinar, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                webinar.featured ? 'ring-2 ring-[#A67FFB] ring-opacity-50' : ''
              }`}>
                {webinar.featured && (
                  <div className="bg-[#A67FFB] text-white text-center py-2 text-sm font-medium">
                    🌟 Webinaire en vedette
                  </div>
                )}
                
                <div className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Informations principales */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          webinar.tag === 'Prochainement' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {webinar.tag}
                        </span>
                        <span className="text-sm text-gray-500">{webinar.level}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[#161A22] mb-4">
                        {webinar.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-6">
                        {webinar.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#161A22] mb-2">
                            Au programme :
                          </h4>
                          <ul className="space-y-2">
                            {webinar.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-[#A67FFB] rounded-full"></div>
                                <span className="text-sm">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informations pratiques */}
                    <div className="bg-gradient-to-br from-[#A67FFB]/5 to-purple-50 rounded-xl p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-[#A67FFB]" />
                          <div>
                            <div className="font-semibold text-[#161A22]">
                              {new Date(webinar.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600">{webinar.time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-[#A67FFB]" />
                          <span className="text-gray-700">{webinar.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-[#A67FFB]" />
                          <span className="text-gray-700">
                            {webinar.registrations}/{webinar.maxParticipants} inscrits
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mb-6">
                        <h4 className="font-semibold text-[#161A22] mb-2">Intervenant :</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#A67FFB] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {webinar.speaker.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-[#161A22]">
                              {webinar.speaker}
                            </div>
                            <div className="text-sm text-gray-600">
                              {webinar.speakerTitle}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-[#A67FFB] text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        S'inscrire gratuitement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webinaires passés (replays) */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Replays disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Rattrapez les webinaires que vous avez manqués
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {pastWebinars.map((webinar, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Thumbnail placeholder */}
                <div className="relative bg-gradient-to-br from-[#A67FFB] to-purple-600 h-48 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white/80" />
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {webinar.duration}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {webinar.views} vues
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#A67FFB]/10 text-[#A67FFB] text-xs rounded-full">
                      {webinar.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${
                          i < Math.floor(webinar.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}>
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-600 ml-1">
                        {webinar.rating}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#161A22] mb-2">
                    {webinar.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {webinar.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                    <span>{webinar.speaker}</span>
                    <span>•</span>
                    <span>
                      {new Date(webinar.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <button className="w-full bg-[#A67FFB] text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                    <Play className="h-4 w-4" />
                    Voir le replay
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 font-medium px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Voir tous les replays
            </button>
          </div>
        </div>
      </section>

      {/* Thématiques populaires */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Thématiques populaires
            </h2>
            <p className="text-xl text-gray-600">
              Les sujets les plus demandés par notre communauté
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${topic.color}`}></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#161A22]">
                      {topic.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {topic.count} webinaires
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter et CTA */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <BookOpen className="h-16 w-16 text-[#A67FFB] mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ne manquez aucun webinaire
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Inscrivez-vous à notre newsletter pour être informé des prochains 
                webinaires et recevoir nos guides exclusifs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A67FFB]"
                />
                <button className="btn-primary whitespace-nowrap">
                  S'abonner
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mt-3">
                Vous recevrez 1 email par semaine maximum. Désabonnement en un clic.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Avantages de nos webinaires
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">100% gratuits et accessibles</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Animés par des experts certifiés</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Sessions interactives avec Q&A</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Replays disponibles à vie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 