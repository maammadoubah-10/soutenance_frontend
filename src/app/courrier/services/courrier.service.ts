import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Categorie, CategorieDto} from '../models/categorie';
import {Chrono, ChronoDto} from '../models/chrono';
import {Classe, ClasseDto} from '../models/classe';
import {Correspondant, CorrespondantDto} from '../models/correspondant';
import {Courrier, CourrierDto} from '../models/courrier';
import {Etape, EtapeDto} from '../models/etape';
import {Processus, ProcessusDto} from '../models/processus';
import {Registre, RegistreDto} from '../models/registre';
import {TraitementDto, Traitement} from '../models/traitement';
import {TypeCourrier, TypeCourrierDto} from '../models/typeCourrier';
import {Soustype, SoustypeDto} from '../models/soustype';
// import {Onlyoofficeedition} from 'src/app/courrier/models/only-office-edition';
import {ModelDocument} from '../models/model-document';
import {Dossier, DossierDTO} from '../models/dossier';
import {catchError} from 'rxjs/operators';
import {Tache} from "../../tache/models/tache";
import {environment} from "../../../environments/environment";
import {Onlyoofficeedition} from "../models/only-office-edition";
const host = environment.hostmicroservicecourrier;
const hostRh = environment.hostmicroservicepersonnel;
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class CourrierService {
  public contextPathCommentaire: string = environment.hostmicroservicecourrier + "commentairesAffectations";

  constructor(private http: HttpClient) {
  }


  /*
  only office
  */
  public recupModelParId(onlyOfficeModelId: number): Observable<any> {
    return this.http.get<any>(host + 'onlyOffice/' + onlyOfficeModelId + '/telecharger/', {observe: 'response'});
  }

  listeAllModel(): Observable<any> {
    return this.http.get<any>(host + 'documents')
  }

  /*
  Registre
  */

  afficherLesRegistres(): Observable<Registre[]> {
    return this.http.get<Registre[]>(host + 'registres/', httpOptions);
  }

  afficherLesRegistresParService(idService: number): Observable<Registre[]> {
    return this.http.get<Registre[]>(host + 'services/' + idService + '/registres/', httpOptions);
  }

  enregistrerUnRegistre(registre: RegistreDto): Observable<any> {
    return this.http.post<RegistreDto>(host + 'registres/', registre, httpOptions);
  }


  supprimerUnRegistreParId(id: number): Observable<any> {
    return this.http.delete(host + `registres/${id}`);
  }

  ouvrirUnRegistre(id: number): Observable<any> {
    //console.log(id);
    return this.http.patch(host + 'registres/' + id + '/ouvrir', httpOptions);
  }

  modifierUnRegistre(id: number, registre: RegistreDto): Observable<any> {
    return this.http.patch<RegistreDto>(host + `registres/${id}`, registre, httpOptions);
  }

  obtenirLeRegistreOuvert(idCategorie: number, idService: number): Observable<Registre> {
    return this.http.get<Registre>(host + `registres/ouvert/${idCategorie}/${idService}`, httpOptions);
  }

  obtenirLeRegistreArriveService(serviceId: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${host}categories/categoriesParservice/arrivee/?serviceId=${serviceId}`, httpOptions);
  }

  obtenirLeRegistreDepartService(serviceId: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${host}categories/categoriesParservice/depart/?serviceId=${serviceId}`, httpOptions);
  }

  obtenirLeRegistreInterneService(serviceId: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${host}categories/categoriesParservice/interne/?serviceId=${serviceId}`, httpOptions);
  }

  public voirCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(host + 'categories/' + id)
  }

  public voirRegistre(id: number): Observable<Registre> {
    return this.http.get<Registre>(host + 'registres/' + id)
  }

  public voirDossier(id: number): Observable<Dossier> {
    return this.http.get<Dossier>(host + 'dossiers/' + id)
  }

  public voirUnmodelOnlyofficeParmisTout(id:number): Observable<any> {
    return this.http.get<any>(host + 'onlyOfficeModels/' + id)
  }

  public voirCourrier(courrierId: number, instructionId: number): Observable<Courrier> {
    return this.http.get<Courrier>(`${host}affectationCourrier/recuperer-affectation/${courrierId}/${instructionId}`);
  }

  public voirCourrierUnique(courrierId: number): Observable<Courrier> {
    return this.http.get<Courrier>(`${host}affectationCourrier/affectation/${courrierId}/`);
  }

  /*
  Categorie
  */


  afficherLesCategories(serviceId: number): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${host}categories/Parservice?serviceId=${serviceId}`, httpOptions);
  }

  enregistrerUnCategorie(categorie: CategorieDto): Observable<any> {
    return this.http.post<CategorieDto>(host + 'categories/', categorie, httpOptions);
  }

  supprimerUnCategorieParId(id: number): Observable<any> {
    return this.http.delete(host + `categories/${id}`);
  }

  modifierUnCategorie(id: number, categorie: CategorieDto): Observable<any> {
    return this.http.patch<CategorieDto>(host + `categories/${id}`, categorie, httpOptions);
  }

  /*
  Classe
  */

  afficherLesClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(host + 'classes/', httpOptions);
  }

  enregistrerUnClasse(classe: ClasseDto): Observable<any> {
    return this.http.post<ClasseDto>(host + 'classes/', classe, httpOptions);
  }

  supprimerUnClasseParId(id: number): Observable<any> {
    return this.http.delete(host + `classes/${id}`);
  }

  modifierUnClasse(id: number, classe: ClasseDto): Observable<any> {
    return this.http.patch<ClasseDto>(host + `classes/${id}`, classe, httpOptions);
  }

  listeDesPostes(): Observable<any[]> {
    return this.http.get<any[]>(host + 'postes/listes', httpOptions);
  }

  listeDesPostesChefService(): Observable<any[]> {
    return this.http.get<any[]>(host + 'postes/chefservice', httpOptions);
  }


  /*
   type courier
   */

  afficherLesTypeCourriers(): Observable<TypeCourrier[]> {
    return this.http.get<TypeCourrier[]>(host + 'types', httpOptions);
  }

  enregistrerUnTypeCourrier(TypeCourrier: TypeCourrierDto): Observable<any> {
    return this.http.post<TypeCourrierDto>(host + 'types/', TypeCourrier, httpOptions);
  }

  supprimerUnTypeCourrierParId(id: number): Observable<any> {
    return this.http.delete(host + `types/${id}`);
  }

  modifierUnTypeCourrier(id: number, typeCourrier: TypeCourrierDto): Observable<any> {
    return this.http.patch<TypeCourrierDto>(host + `types/${id}`, typeCourrier, httpOptions);
  }

  public rechercheCourrier(objet: string, id:number): Observable<Courrier> {
    const url = `${host}courriers/services/${id}/courriers?objet=${objet}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, {observe: 'response'});
  }

  rechercherTypeCourrierParId(id: number): Observable<any> {
    return this.http.get<any>(host + `types/${id}`);
  }


  /*
 Sous Types
 */

  afficherLesSousTypes(): Observable<Soustype[]> {
    return this.http.get<Soustype[]>(host + 'soustypes/', httpOptions);
  }

  afficherLesSousTypesParType(typeId:number): Observable<Soustype[]> {
    return this.http.get<Soustype[]>(host + `soustypes/types/${typeId}/soustypes`, httpOptions);
  }

  enregistrerUnSousType(Soustype: SoustypeDto): Observable<any> {
    return this.http.post<SoustypeDto>(host + 'soustypes/', Soustype, httpOptions);
  }

  supprimerUnSousTypeParId(id: number): Observable<any> {
    return this.http.delete(host + `soustypes/${id}`);
  }

  modifierUnSousType(id: number, Soustype: SoustypeDto): Observable<any> {
    return this.http.patch<SoustypeDto>(host + `soustypes/${id}`, Soustype, httpOptions);
  }


  /*
  Personnel
  */
  serviceDunPersonnel(id: number): Observable<any> {
    return this.http.get(host + `personnels/${id}/service`);
  }

  dossiersDunPersonnel(id: number): Observable<any> {
    return this.http.get(host + `dossiers/${id}/personnel`);
  }

  voirCourrierParDossierDunPersonnel(id: number): Observable<any> {
    return this.http.get(host + `dossiers/recuperer/${id}`);
  }


  tousLesPersonnels(): Observable<any[]> {
    return this.http.get<any[]>(hostRh + 'personnels/listes', httpOptions);
  }

  tousLesPersonnelsCollaborateurs(idPersonnel: number): Observable<any[]> {
    return this.http.get<any[]>(host + 'personnels/' + idPersonnel + '/personnelscollaborateurs/', httpOptions);
  }

  tousLesServices(): Observable<any[]> {
    return this.http.get<any[]>(hostRh + 'postes/chef-service/true', httpOptions);
  }

  /*
  Chrono
  */

  //Les chronos d'un service
  afficherLesChronos(id: number): Observable<Chrono[]> {
    //return this.http.get<Chrono[]>(host + 'chronos/', httpOptions);

    return this.http.get<Chrono[]>(host + `services/${id}/chronos`, httpOptions);
  }

  enregistrerUnChrono(chrono: ChronoDto): Observable<any> {
    return this.http.post<ChronoDto>(host + 'chronos/', chrono, httpOptions);
  }

  supprimerUnChronoParId(id: number): Observable<any> {
    return this.http.delete(host + `chronos/${id}`);
  }

  modifierUnChrono(id: number, chrono: ChronoDto): Observable<any> {
    return this.http.patch<ChronoDto>(host + `chronos/${id}`, chrono, httpOptions);
  }


  /*
  Priorite
  */


  /*
  Correspondant
  */

  afficherLesCorrespondants(): Observable<Correspondant[]> {
    return this.http.get<Correspondant[]>(host + 'correspondants', httpOptions);
  }

  enregistrerUnCorrespondant(correspondant: CorrespondantDto): Observable<any> {
    return this.http.post<CorrespondantDto>(host + 'correspondants/', correspondant, httpOptions);
  }

  supprimerUnCorrespondantParId(id: number): Observable<any> {
    return this.http.delete(host + `correspondants/${id}`);
  }

  modifierUnCorrespondant(id: number, correspondant: CorrespondantDto): Observable<any> {
    return this.http.patch<CorrespondantDto>(host + `correspondants/${id}`, correspondant, httpOptions);
  }

  ajouterDossierPersonnel(dossierId: number, data : any): Observable<any> {
    return this.http.patch<any>(host + `dossiers/${dossierId}/addCourriers`, data, httpOptions);
  }

  supprimerDossierPersonnel(dossierId: number, data : any): Observable<any> {
    return this.http.patch<any>(host + `dossiers/${dossierId}/removeCourriers`, data, httpOptions);
  }

  envoyerUnCourrierAuSuperieurHierachique( courrierId : number,emetteurId : number, posteId : number): Observable<any> {
    return this.http.post<any>(host + `affectationCourrier/create/${posteId}/${emetteurId}/${courrierId}/`, httpOptions);
  }

  envoyerUnCourrierAmoi( courrierId : number,emetteurId : number, posteId : number, priorite: string, delai: any): Observable<any> {
    return this.http.post<any>(host + `affectationCourrier/createPourMoi/${posteId}/${emetteurId}/${courrierId}/${priorite}/${delai}`, httpOptions);
  }

  attachDesDocsAUnCourrier( courrierId : number, courrierDocumentDtos  : any): Observable<any> {
    return this.http.post<any>(host + `courriers/enregistrerCourrierDocuments/${courrierId}`, courrierDocumentDtos,httpOptions);
  }



  envoyerUnMail(idPersonnel: number, idCourrier: number, data : any): Observable<any> {
    return this.http.post<any>(host + `courriers/all/${idCourrier}/${idPersonnel}/envoyemail?`,data, httpOptions);
  }

  retraitUnMail(slug: any): Observable<any> {
    return this.http.patch<any>(host + `courriers/envoieMail-to-false/${slug}`,null, httpOptions);
  }

  annulerInstructionDejaValider(instructionId: number, personnelId: number): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/annuler-instruction/${instructionId}/validation/${personnelId}`,null, httpOptions);
  }

  envoyerUnMailInterne(idPersonnel: number, idCourrier: number, data : any): Observable<any> {
    return this.http.post<any>(host + `courriers/interne/${idCourrier}/${idPersonnel}/envoyemail?`,data, httpOptions);
  }
  envoyerReceptionParMail(idPersonnel: number, idCourrier: number,format : any): Observable<any> {
    console.log(format);
    console.log(format.toString());
    return this.http.post<any>(`${host}courriers/${idCourrier}/${idPersonnel}/reception`, format )}


  /*
Courrier arrivée ou depart
*/

  validerCourrierAffectation(personnelId: number, courrierId: number): Observable<any> {
    return this.http.patch<CourrierDto>(`${host}affectationCourrier/dg-validation?courrierId=${courrierId}&personnelId=${personnelId}`, null);
  }
  annulerCourrierAffectation(personnelId: number, courrierId: number): Observable<any> {
    return this.http.patch<CourrierDto>(`${host}affectationCourrier/dg-annuler-instruction/${personnelId}/${courrierId}`, null);
  }

  listeInstructionParPersonnel(personnelId: number): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(`${host}affectationCourrier/instructions/${personnelId}`, httpOptions);
  }

  listeInstructionParPersonnelPage(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/instructions/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(host + `affectationCourrier/arrivee/a-traiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }
  listeInstructionParPersonnelPageInterne(personnelId: number, page: number, size: number, sort: string): Observable<Courrier[]> {
    const url = `${host}affectationCourrier/instructions/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier[]>(host + `affectationCourrier/interne/a-traiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }
  listeInstructionParPersonnelPageDepart(personnelId: number, page: number, size: number, sort: string): Observable<Courrier[]> {
    const url = `${host}affectationCourrier/instructions/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier[]>(host + `affectationCourrier/depart/a-traiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }

  // listeInstructionTraiterParPersonnel(personnelId: number): Observable<Courrier[]> {
  //   return this.http.get<Courrier[]>(`${host}affectationCourrier/instructions/traitees/${personnelId}`, httpOptions);
  // }
  listeInstructionTraiterParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier[]> {
    const url = `${host}affectationCourrier/arrivee/dejaTraiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier[]>( url, httpOptions);
  }
  listeInstructionTraiterInterneParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier[]> {
    const url = `${host}affectationCourrier/interne/dejaTraiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier[]>( url, httpOptions);
  }

  listeInstructionTraiterDepartParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier[]> {
    const url = `${host}affectationCourrier/depart/dejaTraiter/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier[]>( url, httpOptions);
  }

  listerArchivesCourrierPage(id: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/archivee/${id}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerArchivesCourrierPageParRegistre(personnelId: number, registreId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/archivee/personnelId/${personnelId}/registreId/${registreId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerCourrierFichiersPartagerAunPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/personnel/${personnelId}/fichiers-dossiers?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerCourrierDeMesFichiersPartagerAunPersonnel(envoyeurId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/envoyeur/${envoyeurId}/fichiers-dossiers?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerCourrierDossierPartagerAunPersonnel(recepteurId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/byRecepteur/${recepteurId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerDossierPartagerAunPersonnel(recepteurId: number,dossierId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/byRecepteur/${recepteurId}/dossierId/${dossierId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerCourrierDeMesDossierPartagerAunPersonnel(envoyeurId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/byEnvoyeur/${envoyeurId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerDeMesDossierPartagerAunPersonnel(recepteurId: number,dossierId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}fichierspartages/byEnvoyeur/${recepteurId}/dossierId/${dossierId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }

  listerModelOnlyOfficePage(page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOfficeModels?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, { observe: 'response' });
  }


  afficherLesCourriers(codeCategorie: number, idService: number): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(host + `courriers/${codeCategorie}/${idService}`, httpOptions);
  }

  afficherLesCourriersInterne(codeCategorie: number, idService: number, personnelId: number): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(host + `courriers/interne/codeCategorie/${codeCategorie}/serviceId/${idService}/personnelId/${personnelId}`, httpOptions);
  }

  afficherLesCourriersSuivi(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/archivee/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(host + `affectationCourrier/arrivee/suivie/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }


  afficherLesCourriersSuiviInterne(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/archivee/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(host + `affectationCourrier/interne/suivie/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }

  afficherLesCourriersSuiviDepart(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}affectationCourrier/arrivee/archivee/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(host + `affectationCourrier/depart/suivie/${personnelId}?page=${page}&size=${size}&sort=${sort}`, httpOptions);
  }

  afficherLesCourriersSigner(objet: string, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOffice/onlyOfficeVersions?objet=${objet}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, httpOptions);
  }

  afficherLesCourriersSignerInterne( personnelId: number, objet: string, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOffice/onlyOfficeVersions/personnelId/${personnelId}?objet=${objet}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, httpOptions);
  }
  afficherLesCourriersConfidentiel(search: string, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}courriers/courrierswithPassword?search=${search}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, httpOptions);
  }
  afficherLesCourriersSignerParRecherche(objet: string, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOffice/onlyOfficeVersions?objet=${objet}&page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<Courrier>(url, httpOptions);
  }



  situationDeLaSignatureDunPersonnel(editionId: number, personnelId: number): Observable<Courrier> {
    const url = `${host}onlyOfficeConfiguration/situationdeMasignature/${editionId}/personnel/${personnelId}`;
    // @ts-ignore
    return this.http.get<Courrier>(url, httpOptions);
  }

  afficherLesCourriersASignerParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOfficeConfiguration/documents-a-signer/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<Courrier>(url);
  }

  afficherLesCourriersAViserParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOfficeConfiguration/documents-a-viser/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<Courrier>(url);
  }

  afficherLesCourriersdejaViserParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOfficeConfiguration/documents-a-viser/dejavises/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<Courrier>(url);
  }


  afficherLesCourriersdejaSignerParPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<Courrier> {
    const url = `${host}onlyOfficeConfiguration/documents-a-signer/dejasignes/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<Courrier>(url);
  }



  afficherLesCourriersTraites(idPersonnel: number): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(host + 'personnels/' + idPersonnel + '/courrierstraites')
  }

  enregistrerUnCourrier(courrier: any, codeCategorie: number, idPersonnel: number): Observable<any> {
    return this.http.post<CourrierDto>(host + `courriers/${codeCategorie}/${idPersonnel}`, courrier);
  }

  supprimerUnCourrierParId(id: number): Observable<any> {
    return this.http.delete(host + `courriers/${id}`);
  }

  supprimerUnModel(id: number): Observable<any> {
    return this.http.delete(host + `onlyOfficeModels/${id}`);
  }

  trouverParSlug(slug: string): Observable<any> {
    return this.http.get<any>(host + `courriers/slug/${slug}`);
  }

  modifierUnCourrier(slug: number, courrier: any): Observable<any> {
    console.log(courrier);
    // const _courrier : CourrierDto = courrier
    console.log(slug);

    return this.http.patch<CourrierDto>(host + `courriers/${slug}`, courrier);
  }

  obtenirLeFichier(fichier: string) {
    return this.http.get(host + `courriers/telechargementdefichier/${fichier}`, {
      responseType: 'blob'
    });
  }

  // telechargerLeFichier(codeFichier: string) {
  //   return (host + 'courriers/telechargementdefichier/' + codeFichier);
  // }

  telechargerLeFichier(codeFichier: string) {
    const url = host + 'courriers/telechargementdefichierParun/' + codeFichier;
    const token = sessionStorage.getItem('token');

    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getFichiersTelecharges(courrierId: number): Observable<string[]> {
    const url = `${host}courriers/${courrierId}/fichiers`;
    return this.http.get<string[]>(url);
  }

  telechargerLesFichiersCourrierArrive(codeFichier: string[]): Observable<ArrayBuffer> {
    const url = `${host}courriers/telechargementdefichier/` + codeFichier;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  // downloadPdf(url: string): Promise<Blob> {
  //   return this.http.get(url, { responseType: 'blob' }).toPromise();
  // }

  recupMotDepasseFichierCourrier(courrierId: number): Observable<any> {
    //alert(idPersonnel);
    return this.http.get<any>(host + `courriers/courrier/password/${courrierId}`, httpOptions);
  }
  telechargerChaqueFichierCourrier(filename: string, courrierId : number): Observable<ArrayBuffer> {
    const url = `${host}courriers/courrierfichier/download/${filename}/courrierId/${courrierId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }


  telechargerLeFichierCourrierArrive(codeFichier: string): Observable<ArrayBuffer> {
    const url = `${host}courriers/telechargementdefichierParun/` + codeFichier;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }


  telechargerLeFichierTraitement(fichier: string) {
    return (host + 'traitements/telecharger/' + fichier);
  }

  telechargerLeFichierCourrier(fichier: string) {
    return (host + 'courriers/telechargementdefichier/' + fichier);
  }


  listerLesCourriersRecusDunPersonnel(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersinternesrecus/`, httpOptions);
  }


  listerLesCourriersExternesRecusDunPersonnel(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersrecus/`, httpOptions);
  }

  listerLesCourriersExternesAffectesAUnPersonnel(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersaffectes/`, httpOptions);
  }

  listerLesCourriersExternesSuivis(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courrierssuivis/`, httpOptions);
  }

  listerLesCourriersExternesEnvoyeAuSuperieur(personnelId: number,page: number, size: number, sort: string): Observable<any[]> {
    // Ajoutez les paramètres de pagination et de tri à l'URL
    const url = `${host}affectationCourrier/en-attente-instruction/${personnelId}?page=${page}&size=${size}&sort=${sort}`;

    // Effectuez la requête HTTP en utilisant l'URL construit
    return this.http.get<any[]>(url, httpOptions);
  }


  listerLesCourriersAttributionAvaliderDg(personnelId: number,page: number, size: number, sort: string): Observable<any[]> {
    // Ajoutez les paramètres de pagination et de tri à l'URL
    const url = `${host}affectationCourrier/a-valider/${personnelId}?page=${page}&size=${size}&sort=${sort}`;

    // Effectuez la requête HTTP en utilisant l'URL construit
    return this.http.get<any[]>(url, httpOptions);
  }


  listerLesCourriersExternesEnTraitement(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courrierstraitement/`, httpOptions);
  }

  listerLesAffectationsDunCourrier(idCourrier: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `courriers/${idCourrier}/affectations/`, httpOptions);
  }

  listerLesDetailsDunCourrier(idCourrier: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `courriers/${idCourrier}/details/`, httpOptions);
  }

  listerLesCourriersEnvoyesDunPersonnel(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersenvoyes/`, httpOptions);
  }


  listerLesCourriersAffecterAuProcessus(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersprocessus/`, httpOptions);
  }

  listerLesCourriersAffecterAuProcessusTraiter(idPersonnel: number): Observable<any[]> {
    //alert(idPersonnel);
    return this.http.get<any[]>(host + `personnels/${idPersonnel}/courriersprocessustraites/`, httpOptions);
  }

//
  affecterUnCourrierPersonnel(instructeurId: number, courrierId: number, courrierDto: any): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/update/personnel/${instructeurId}/courrier/${courrierId}`, courrierDto, httpOptions);
  }

  creerUneConfigurationPourUnCourrier( onlyOfficeConfigurationDto: any): Observable<any> {
    return this.http.post<any>(host + `onlyOfficeConfiguration`, onlyOfficeConfigurationDto, httpOptions);
  }

  retirerUneConfigurationPourUnCourrier( configurationId: number, editionId: number): Observable<any> {
    return this.http.post<any>(host + `onlyOfficeConfiguration/reset/configurationId/${configurationId}/editionId/${editionId}`, null, httpOptions);
  }

  creerEnvoiDeDocumentCourrier( type: string,fichiersPartagesDto : any): Observable<any> {
    return this.http.post<any>(host + `fichierspartages/${type}/enregistrer`, fichiersPartagesDto , httpOptions);
  }

  creerEnvoiToutDocumentCourrier(fichiersPartagesDto : any): Observable<any> {
    return this.http.post<any>(host + `fichierspartages/courrier/enregistrer`, fichiersPartagesDto , httpOptions);
  }

  retirerEnvoiDeDocumentCourrier( type: string,nomFichier: string, personnelId: number): Observable<any> {
    return this.http.post<any>(host + `fichierspartages/retirer/fichier/${type}/${nomFichier}/${personnelId}`, null , httpOptions);
  }

  modifierUneConfigurationPourUnCourrier(id: number, onlyOfficeConfigurationDto: any): Observable<any> {
    const url = `${host}onlyOfficeConfiguration/${id}`;
    return this.http.patch<any>(url, onlyOfficeConfigurationDto, httpOptions);
  }

  mettreEnSingatureUneConfigurationPourUnCourrier(editionId: number): Observable<any> {
    const url = `${host}onlyOfficeConfiguration/mettreEnSignature/${editionId}`;
    return this.http.patch<any>(url, null, httpOptions);
  }

  recupererUneConfigurationPourUndocumentParCourrier(editionId: number): Observable<any> {
    const url = `${host}onlyOfficeConfiguration/${editionId}`;
    return this.http.get<any>(url, { observe: 'response' });
  }


  affecterUnCourrierService(instructeurId: number, courrierId: number, courrierDto: any): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/update/service/${instructeurId}/courrier/${courrierId}/`, courrierDto, httpOptions);
  }

  validerInstructionParPersonnel(instructeurId: number, personnelId: number): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/instruction/${instructeurId}/validation/${personnelId}/`, null, httpOptions);
  }

//
  affecterUnCourrierAproccessus(idPersonnel: number, idCourrier: number, courrierDto: any): Observable<any> {
    return this.http.post<any>(host + `affectations/${idPersonnel}/${idCourrier}/processus`, courrierDto, httpOptions);
  }

//

  fermerUnCourrier(courrierId: number, personnelId: number): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/${personnelId}/${courrierId}/fermer`, null, httpOptions);
  }

  signerUnDocumentParPersonnel(personnelId: number, editionId: number): Observable<any> {
    return this.http.patch<any>(host + `onlyOfficeConfiguration/appliquerMaSignature/personnelId/${personnelId}/edition/${editionId}`, null, httpOptions);
  }

  appliquerVisaUnDocumentParPersonnel(personnelId: number, editionId: number): Observable<any> {
    return this.http.patch<any>(host + `onlyOfficeConfiguration/appliquerMonVisa/personnelId/${personnelId}/edition/${editionId}`, null, httpOptions);
  }

  remettreEnTraitementUnCourrier(courrierId: number, personnelId: number): Observable<any> {
    return this.http.patch<any>(host + `affectationCourrier/${personnelId}/${courrierId}/reouvrir`, null, httpOptions);
  }

  afficherLesProcessuss(): Observable<Processus[]> {
    return this.http.get<Processus[]>(host + 'processus/', httpOptions);
  }

  afficherLesProcessussParSerice(idService: number): Observable<Processus[]> {
    return this.http.get<Processus[]>(host + 'services/' + idService + '/processus', httpOptions);
  }

  enregistrerUnProcessus(processus: ProcessusDto): Observable<any> {
    return this.http.post<ProcessusDto>(host + 'processus/', processus, httpOptions);
  }

  supprimerUnProcessusParId(id: number): Observable<any> {
    return this.http.delete(host + `processus/${id}`);
  }

  supprimerUnDocOnlyoffice(id: number): Observable<any> {
    return this.http.delete(host + `onlyOfficeEditions/delete/edition/${id}`);
  }


  modifierUnProcessus(id: number, processus: ProcessusDto): Observable<any> {
    return this.http.patch<ProcessusDto>(host + `processus/${id}`, processus, httpOptions);
  }


  rechercherProcessusParId(id: number): Observable<any> {
    return this.http.get<any>(host + `processus/${id}`);
  }

//

  afficherLesEtapesDunProcessus(id: number): Observable<Etape[]> {
    return this.http.get<Etape[]>(host + `processus/${id}/etapes`, httpOptions);
  }

  enregistrerUneEtape(etapes: EtapeDto): Observable<any> {
    return this.http.post<ProcessusDto>(host + 'etapes/', etapes, httpOptions);
  }

  supprimerUneEtapeParId(id: number): Observable<any> {
    return this.http.delete(host + `etapes/${id}`);
  }

  modifierUneEtape(id: number, etapes: EtapeDto): Observable<any> {
    return this.http.patch<ProcessusDto>(host + `etapes/${id}`, etapes, httpOptions);
  }

  enregistrerUnTraitement(traitement: any, idCourrier: number, idPersonnel: number): Observable<any> {
    return this.http.post<TraitementDto>(host + `traitements/courrier/${idCourrier}/personnel/${idPersonnel}`, traitement);
  }

  enregistrerUneNote(commentaire: any, idCourrier: number, idPersonnel: number): Observable<any> {
    return this.http.post<any>(host + `commentaires/courrier/${idCourrier}/personnel/${idPersonnel}`, commentaire);
  }

  listerLesNotesDunCourrier(idCourrier: number): Observable<any[]> {
    return this.http.get<any[]>(host + `commentaires/${idCourrier}`, httpOptions);
  }

  listerLesTraitements(idCourrier: number, idPersonnel: number): Observable<Traitement[]> {
    return this.http.get<Traitement[]>(host + `courriers/${idCourrier}/traitementsparetape/${idPersonnel}`);
  }

  listerLesTraitementsCourrier(idCourrier: number): Observable<Traitement[]> {
    return this.http.get<Traitement[]>(host + 'courriers/' + idCourrier + '/traitements');
  }

  listerTraitementsEtape(idCourrier: number, idPersonnel: number) {
    return this.http.get<Traitement[]>(host + 'courriers/' + idCourrier + '/traitementsparetape/' + idPersonnel);
  }

  /* onlyOffice*/


  // getAllOnlyOfficeEditions(): Observable<Onlyoofficeedition[]> {
  //   return this.http.get<Onlyoofficeedition[]>(host + 'onlyOfficeEditions/', httpOptions);
  // }


  public getOnlyOfficeEditionbyId(id: number): Observable<any> {
    return this.http.get<Onlyoofficeedition[]>(host + `onlyOfficeEditions/${id}`, httpOptions);
  }

  public getOnlyOfficeEditionbyType(type: string): Observable<Onlyoofficeedition[]> {
    return this.http.get<Onlyoofficeedition[]>(host + `onlyOfficeEditions/document/${type}`, httpOptions);
  }

  updateOnlyOfficeEdition(id: number, onlyOfficeEdition: Onlyoofficeedition): Observable<Onlyoofficeedition> {
    return this.http.patch<Onlyoofficeedition>(host + `onlyOfficeEditions/update/${id}`, onlyOfficeEdition, httpOptions);
  }

  telechargerFichierOnlyOfficeEdition(type: string): Observable<any> {
    return this.http.get(host + `onlyOfficeEditions/${type}/telecharger`, {responseType: 'blob'});
  }

  telechargerFichierOnlyOfficeEditionPDF(type: string): Observable<any> {
    return this.http.get(host + `onlyOfficeEditions/${type}/telechargerPDF`, {responseType: 'blob'});
  }

  handleOnlyOfficeCallback(piece: string, requestBody: string): Observable<any> {
    return this.http.post<any>(host + `onlyOfficeEditions/document/${piece}`, requestBody, httpOptions);
  }

  /* onlyOffice*/

  /* model document*/
  afficherLesModeldocument(idPersonnel: number): Observable<ModelDocument[]> {
    return this.http.get<ModelDocument[]>(host + 'documents')
  }

  enregistrerUnModeldocument(courrier: any): Observable<any> {
    return this.http.post<ModelDocument>(host + 'documents', courrier);
  }

  supprimerUnModelDocumentParId(id: number): Observable<any> {
    return this.http.delete(host + `documents/${id}`);
  }

  trouverModeldocumentParType(type: string): Observable<any> {
    return this.http.get<any>(host + `documents/${type}`);
  }

  modifierModeldocument(id: number, model: ModelDocument): Observable<any> {
    console.log(model);
    const _model: ModelDocument = model
    console.log(id);
    return this.http.patch<ModelDocument>(host + `documents/update/${id}`, model, httpOptions);
  }

// dossier

  afficherLesDossiers(): Observable<DossierDTO[]> {
    return this.http.get<DossierDTO[]>(host + `dossiers`, httpOptions);
  }

  afficherLesDossiersDunPersonnel(idPersonnel: number): Observable<DossierDTO[]> {
    return this.http.get<DossierDTO[]>(host + `dossiers/${idPersonnel}/personnel`, httpOptions);
  }


  enregistrerUnDossier(idPersonnel: number, dossier: DossierDTO): Observable<any> {
    return this.http.post<DossierDTO>(host + `dossiers/personnel/${idPersonnel}`, dossier, httpOptions);
  }


  supprimerUnDossierParId(id: number): Observable<any> {
    return this.http.delete(host + `dossiers/${id}`, httpOptions);
  }


  modifierUnDossier(id: number, dossier: DossierDTO): Observable<any> {
    return this.http.put<DossierDTO>(host + `dossiers/${id}`, dossier, httpOptions);
  }

  getDossierById(id: number): Observable<DossierDTO> {
    return this.http.get<DossierDTO>(host + `dossiers/${id}`, httpOptions);
  }

  assignerDossierAService(dossierId: number, serviceId: number): Observable<any> {
    return this.http.post<any>(host + `dossiers/${dossierId}/assigner-service/${serviceId}`, null, httpOptions)
      .pipe(
        catchError(error => {
          throw 'Erreur lors de l\'assignation du dossier à un service: ' + error;
        })
      );
  }

//pour le calcule de la date de traitement
  addBusinessDays(days: number): Date {
    const today = new Date();
    let remainingDays = days;
    let currentDate = new Date(today);

    while (remainingDays > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Si ce n'est pas un week-end
        remainingDays--;
      }
    }

    return currentDate;
  }

// Fonction pour formater la date et l'heure
  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hour = this.padZero(date.getHours()); // Utilisation de getHours() pour obtenir l'heure locale au format 24h
    const minute = this.padZero(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

// Fonction pour ajouter un zéro devant les nombres < 10
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }


  //////////////////COMMENTAIRE COURRIER

  enregistrerUnCommentaire(formData : any): Observable<Tache> {
    return this.http.post<Tache>(this.contextPathCommentaire + '/enregistrer', formData);
  }
  telechargerFichierCommentaire(fileCode: string): Observable<ArrayBuffer> {
    const url = `${this.contextPathCommentaire}/telecharger/${fileCode}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  telechargerFichierPdfVersionCourrierEdition(editionId: number ,version: string): Observable<Blob> {
    const url = `${host}onlyOffice/download/editionId/${editionId}/version/${version}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'blob', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }


  telechargerFichierPdfVersionCourrierEditionVersion(versionId: number): Observable<ArrayBuffer> {
    const url = `${host}onlyOffice/telecharger/versionId/${versionId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  telechargerFichierPdfVersionCourrierEditionFilecode(fileCode: string): Observable<ArrayBuffer> {
    const url = `${host}onlyOffice/download/${fileCode}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }
  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }
  public listerCommentaireParTache(affectation_Courrier_id  : number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPathCommentaire + '/affectationCourriers/'+ affectation_Courrier_id  +'/commentaires'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<any>(url, { observe: 'response' });
  }

  telechargerFichierPdfVersionSignerCourrierFilecode(filename : string, courrierId:number): Observable<ArrayBuffer> {
    const url = `${host}courriers/courrierDocument/download/${filename}/courrierId/${courrierId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  telechargerFichierZIPPartage(dossierId : number): Observable<Blob> {
    const url = `${host}fichierspartages/telechargerFichiersZip/${dossierId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'blob', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }


  telechargerFichierZIP(courrierId : number): Observable<Blob> {
    const url = `${host}courriers/telechargerFichiersZip/${courrierId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'blob', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  telechargerFichierPartager(personnelId : number, partageId: number): Observable<ArrayBuffer> {
    const url = `${host}fichierspartages/download/${personnelId}/partage/${partageId}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, {  responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }
}
