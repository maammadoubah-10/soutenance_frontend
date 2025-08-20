// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {HttpHeaders} from "@angular/common/http";

export const environment = {
  production: false,
  useFakeData: false,
  hostmicroserviceutilisateur:"http://localhost:9001/utilisateur/",
  hostmicroservicepersonnel: 'http://localhost:9002/rh/',
  hostmicroservicepersonnelonline: 'https://jilms.eismv.org:9002/personnel/',
  hostmicroservicepersonnelonlinee: 'https://jilms.eismv.org:9002/personnel/',
  httpOptions: {headers: new HttpHeaders({})},
  hostmicroservicecourrier: "http://localhost:9003/courrier/",
  hostmicroservicemarchepublic: "http://192.168.100.95:9004/marchepublic/",
  hostmicroservicetache: "http://localhost:9008/tache/",
  hostmicroservicegestiondestock: "http://localhost:9005/comptabilitematiere/",
  hostmicroserviceimmobilisation:"http://localhost:9006/immobilisation/",
  hostmicroservicepedagogie:"http://localhost:9012/pedagogie/",
  hostmicroservicepaie: "http://localhost:9100/paie/",
  hostmicroservicecommercial:"http://192.168.100.95:9009/gestioncommercial/",
  hostmicroservicelocalisation:"http://192.168.100.95:9010/localisation/",
  hostmicroservicepublication:"http://192.168.100.95:9011/publication/"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
