import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,
  useFakeData: false,
  // ✅ rien à propos des banques/paiements
  hostmicroserviceutilisateur: "http://localhost:9001/utilisateur/",
  hostmicroservicepersonnel: "http://localhost:9002/rh/",
  hostmicroservicepersonnelonline: "https://jilms.eismv.org:9002/personnel/",
  hostmicroservicepersonnelonlinee: "https://jilms.eismv.org:9002/personnel/",
  httpOptions: { headers: new HttpHeaders({}) },
  hostmicroservicecourrier: "http://localhost:9004/courrier/",
  hostmicroservicemarchepublic: "http://192.168.100.95:9004/marchepublic/",
  hostmicroservicetache: "http://localhost:9008/tache/",
  hostmicroservicegestiondestock: "http://localhost:9005/comptabilitematiere/",
  hostmicroserviceimmobilisation: "http://localhost:9006/immobilisation/",
  hostmicroservicepedagogie: "http://localhost:9012/pedagogie/",
  hostmicroservicepaie: "http://localhost:9003/paie/",
  hostmicroservicecommercial: "http://192.168.100.95:9009/gestioncommercial/",
  hostmicroservicelocalisation: "http://192.168.100.95:9010/localisation/",
  hostmicroservicepublication: "http://192.168.100.95:9011/publication/",
};
