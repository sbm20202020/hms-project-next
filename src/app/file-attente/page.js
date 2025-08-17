"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Play, Pause, SkipForward } from "lucide-react"
import { ticketService } from "@/services/dossierService"
import { useEffect } from "react"
import { getTimeInDateTime } from "@/utils/helpers"

export default function FileAttentePage() {
  const [currentNumber, setCurrentNumber] = useState("A-042")
  const [isActive, setIsActive] = useState(true)
  const [selectedService, setSelectedService] = useState("consultation")
  const [queueData, setQueueData] = useState([])
  const [currentTicket, setCurrentTicket] = useState(null)
  const [numberTicketEnAttente, setNumberTicketEnAttente] = useState(0)
  const [doneTickets, setDoneTickets] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tickets] = await Promise.all([
          ticketService.getAll(),
        ])
        const enattenteTickets = tickets.filter(ticket => ticket.status === "attente")
        // console.log("enattenteTickets--->", enattenteTickets)
        setQueueData(enattenteTickets)
        setNumberTicketEnAttente(enattenteTickets.length)
      
        const termineTickets = tickets.filter(ticket => ticket.status === "done")
        console.log("termineTickets--->", termineTickets)
        setDoneTickets(termineTickets)

        const enCoursTickets = tickets.filter(ticket => ticket.status === "isCalled")
        console.log("enCoursTickets--->", enCoursTickets)
        setCurrentTicket(enCoursTickets[0])
      
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        console.log("tickets fetched")
        // setLoading(false)
      }
    }

    fetchData()
  }, [])

  const services = [
    { id: "consultation", name: "Consultation Générale", prefix: "A", color: "bg-blue-500" },
    { id: "urgence", name: "Urgences", prefix: "U", color: "bg-red-500" },
    { id: "pediatrie", name: "Pédiatrie", prefix: "P", color: "bg-green-500" },
    { id: "cardiologie", name: "Cardiologie", prefix: "C", color: "bg-purple-500" },
  ]

  // const queueData = [
  //   { number: "A-043", service: "Consultation", time: "10:30", status: "waiting" },
  //   { number: "U-012", service: "Urgences", time: "10:25", status: "priority" },
  //   { number: "A-044", service: "Consultation", time: "10:35", status: "waiting" },
  //   { number: "P-008", service: "Pédiatrie", time: "10:40", status: "waiting" },
  //   { number: "A-045", service: "Consultation", time: "10:45", status: "waiting" },
  // ]

  const handleNextNumber = async () => {
    try {
      // Marquer le ticket actuel comme "done"
      if (currentTicket) {
        const updatedTicket = await ticketService.update(currentTicket.id, { 
          status: "done", 
          dateDone: new Date() 
        });
        setDoneTickets((prev) => [...prev, {...currentTicket,...updatedTicket}]);
        console.log("Ticket terminé:", updatedTicket);
      }
  
      // Vérifier s'il reste des tickets dans la file
      if (!queueData || queueData.length === 0) {
        console.log("La file est vide");
        setCurrentTicket(null);
        setNumberTicketEnAttente(0)
        return;
      }
  
      // Extraire le prochain ticket de façon sûre
      const [nextTicketToCall, ...restQueue] = queueData;
      setQueueData(restQueue); // on retire le ticket appelé avant l'update
  
      // Appeler le prochain ticket
      const nextTicket = await ticketService.update(nextTicketToCall.id, { 
        status: "isCalled", 
        dateCalled: new Date() 
      });
      setCurrentTicket({...nextTicketToCall,...nextTicket});
      console.log("Appel du ticket suivant:", nextTicket);
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour du ticket:", error);
    }
  };
  
  

  const handlePauseQueue = () => {
    console.log("Pausing queue")
    setIsActive(!isActive)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File d'Attente</h1>
            <p className="text-gray-600">Système de numérotation et gestion des files d'attente</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePauseQueue}
              variant={isActive ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? "Pause" : "Reprendre"}
            </Button>
            {isActive && (
              (currentTicket || queueData.length > 0) && (
                <Button onClick={handleNextNumber} className="flex items-center gap-2">
                  <SkipForward className="w-4 h-4" />
                  Numéro Suivant
                </Button> 
              )
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold">{numberTicketEnAttente}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Temps Moyen</p>
                  <p className="text-2xl font-bold">12min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <SkipForward className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Traités Aujourd'hui</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Urgences</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Number Display */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Numéro Actuel
                <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "En cours d'appel" : "En pause"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTicket && <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">{currentTicket?.code}</div>
                <p className="text-gray-600 mb-4">{currentTicket?.dossierPatient?.service?.nom}</p>
                <div className="text-sm text-gray-500">Créé à {getTimeInDateTime(currentTicket?.dateCreation)}</div>
                <div className="text-sm text-gray-500">Appelé à {getTimeInDateTime(currentTicket?.dateCalled)}</div>
              </div>}
              {!currentTicket && <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600 mb-2">Aucun ticket actuel</div>
              </div>}
            </CardContent>
          </Card>

          {/* Queue List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>File d'Attente</CardTitle>
            </CardHeader>
            <CardContent>
              {queueData.length > 0 && <div className="space-y-3">
                {queueData.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.code}</div>
                        <div className="text-sm text-gray-600">{item.dossierPatient.service.nom}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">{getTimeInDateTime(item.dateCreation)}</div>
                      <Badge variant={"outline"}>
                        {item.dossierPatient.code}
                      </Badge>
                      <Badge variant={item.dossierPatient.niveauUrgence === "urgente" ? "destructive" : "secondary"}>
                        {item.dossierPatient.niveauUrgence === "urgente" ? "Urgente" : "Normale"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>}
              {!queueData.length > 0 && <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600 mb-2">Aucun ticket en attente</div>
              </div>}
            </CardContent>
          </Card>
        </div>

        {/* Tickets traites */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Traités</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
                {doneTickets.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.code}</div>
                        <div className="text-sm text-gray-600">{item.dossierPatient.service.nom}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={"outline"}>
                        {item.dossierPatient.code}
                      </Badge>
                      <Badge variant={"default"}>
                        {item.status === "done" ? "Traité" : ""}
                      </Badge>
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div className="text-sm text-gray-600">{new Date(item.dateDone).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedService === service.id
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div
                    className={`w-8 h-8 ${service.color} text-white rounded-full flex items-center justify-center text-sm font-bold mb-2`}
                  >
                    {service.prefix}
                  </div>
                  <div className="text-sm font-medium">{service.name}</div>
                </button>
              ))}
            </div> */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
