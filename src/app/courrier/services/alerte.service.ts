import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MENU } from '../menu/menu';

const hostCourrier = environment.hostmicroservicecourrier;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class AlerteService {

  private listeCourriersMiseEnProcessus = new BehaviorSubject<any>(null);
  private listeCourriersInterneRecu = new BehaviorSubject<any>(null);
  private listeCourriersAffecte = new BehaviorSubject<any>(null);
  private listeCourriersATraite = new BehaviorSubject<any>(null);

  currentlisteCourriersMiseEnProcessus = this.listeCourriersMiseEnProcessus.asObservable();
  currentlisteCourriersInterneRecu = this.listeCourriersInterneRecu.asObservable();
  currentlisteCourriersAffecte = this.listeCourriersAffecte.asObservable();
  currentlisteCourriersATraite = this.listeCourriersATraite.asObservable();

  menuItems = []

  constructor(private http: HttpClient) {
    this.menuItems = MENU
  }

  /**
   * Affectations
   */

  listeAffectationsAlerte():Observable<any[]>{
    return this.http.get<any[]>(hostCourrier +'affectations/affectationsalertes',httpOptions);
  }

  listeAffectationsAlertePersonnel(idPersonnel : number){
    this.http.get<any[]>(hostCourrier + 'personnels/' + idPersonnel + '/affectationsalertes',httpOptions).subscribe(
      (response : any)=>{
        console.log(response);
        this.listeCourriersMiseEnProcessus.next(response.filter(courrierMiseEnProssus => courrierMiseEnProssus.processus != null))
        this.listeCourriersInterneRecu.next(response.filter(courrierInterneRecu => (courrierInterneRecu.processus == null && courrierInterneRecu.courrier.categorie.code == 3)))
        this.listeCourriersAffecte.next(response.filter(courrierAffecte => (courrierAffecte.processus == null &&  courrierAffecte.courrier.categorie.code == 1)))
      }, (error)=>{
        console.log(error);
      },()=>{
        console.log('Terminer');
      }
    )
  }

  listeAffectationsNotifsPersonnel(idPersonnel : number){
    this.http.get<any[]>(hostCourrier + 'personnels/' + idPersonnel + '/affectationsnotifs',httpOptions).subscribe(
      (response : any)=>{
        console.log(response);
        this.listeCourriersATraite.next(response.filter(courrierATraiter => (courrierATraiter.processus == null &&  courrierATraiter.courrier.categorie.code == 1 && courrierATraiter.personnelRecepteur == idPersonnel)))
      }, (error)=>{
        console.log(error);
      },()=>{
        console.log('Terminer');
      }
    )
  }

  supprimerAlertePersonel(idPersonnel){
    return this.http.patch(hostCourrier + 'affectations/personnel/' + idPersonnel, httpOptions);
  }

}
